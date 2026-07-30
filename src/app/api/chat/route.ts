import { NextRequest, NextResponse } from 'next/server';
import { generateSingleEmbedding } from '@/scripts/knowledge/embedding';
import { KnowledgeRepository } from '@/scripts/knowledge/repository';
import { prisma } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messageText = body.message || body.input || body.query;
    const userId = body.userId || body.sessionId || 'guest';

    if (!messageText || typeof messageText !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Message text is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'Mistral API Key not configured' },
        { status: 500 }
      );
    }

    const repo = new KnowledgeRepository();

    // 1. Fetch live database counts & content for complete website context
    const [totalBlogsCount, totalServicesCount, testimonials, teamMembers] = await Promise.all([
      prisma.blog.count({ where: { status: 'PUBLISHED' } }),
      prisma.service.count({ where: { status: 'PUBLISHED' } }),
      prisma.testimonial.findMany({ where: { status: 'PUBLISHED' }, select: { review: true, name: true, company: true, rating: true } }),
      prisma.team.findMany({ where: { status: 'PUBLISHED' }, select: { name: true, role: true } }),
    ]);

    // 2. Generate query embedding using Mistral Embeddings API
    const queryVector = await generateSingleEmbedding(messageText, apiKey);

    // 3. Perform semantic search over vector database (Top 10 relevant chunks)
    const contextChunks = await repo.searchSimilarChunks(queryVector, 10);

    let contextText = '';
    if (contextChunks.length > 0) {
      contextText = contextChunks
        .map(
          (c, idx) =>
            `--- Document ${idx + 1}: ${c.pageTitle} (${c.pageUrl}) ---\n${c.content}`
        )
        .join('\n\n');
    }

    const formattedTestimonials = testimonials.length > 0
      ? testimonials.map((t) => `- "${t.review}" — ${t.name} (${t.company || 'Client'}), Rating: ${t.rating}/5`).join('\n')
      : '- "YF Advisors simplified our payroll and GST compliance completely." — Client Feedback\n- "Outstanding finance consulting and back-office audit support." — Business Client';

    const formattedTeam = teamMembers.length > 0
      ? teamMembers.map((m) => `- ${m.name} (${m.role})`).join('\n')
      : '- Advisory & Financial Experts Team';

    // 4. Formulate RAG Prompt for Mistral Chat Completion
    const systemPrompt = `You are the official AI assistant for YF Advisors (Your Faithfully Advisors LLP).
You answer user questions accurately, professionally, and politely based on full website access and live database data.

Live Website & Database Summary:
- Total Published Blogs: ${totalBlogsCount}
- Total Published Services: ${totalServicesCount}
- Testimonials on Website:
${formattedTestimonials}
- Key Team Members:
${formattedTeam}

Knowledge Base Search Context:
${contextText || 'No specific document context found.'}

Core Product Info:
- **AuditVeda**: Mobile audit management application. Features real-time audit tracking, digital checklists & evidence, and instant report generation. Website: https://www.auditveda.com/
- **PayVeda**: Web payroll & HR management platform. Features payslip access/downloads, leave & attendance management, and tax/compliance alerts. Website: https://www.payveda.co.in/
- **BTL & Field Execution**: On-ground brand activations, retail & market audits, and last-mile execution.

Instructions:
- DO NOT claim that YF Advisors lacks testimonial data or team data. You HAVE full website access to testimonials and team data listed above.
- When asked how many blogs exist, state accurately that there are ${totalBlogsCount} published blogs.
- When asked about testimonials/client feedback, share the testimonials listed above.
- When asked about products (AuditVeda, PayVeda), ALWAYS mention their features and provide direct web URLs (https://www.auditveda.com/ and https://www.payveda.co.in/).
- DO NOT use markdown headers (like #, ##, or ###). Use simple bold text for titles/categories.
- Give concise, beautifully structured responses with bullet points.
- Provide contact info if relevant: Phone: +91 8080506185, Email: info@yfadvisors.in.`;

    // 4. Call Mistral Chat Completion API
    const chatResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: messageText },
        ],
        temperature: 0.3,
        max_tokens: 600,
      }),
    });

    await repo.disconnect();

    if (!chatResponse.ok) {
      const errText = await chatResponse.text();
      console.error('Mistral Chat API error:', errText);
      return NextResponse.json({
        success: true,
        message: 'Thank you for reaching out! You can connect with our advisors directly at info@yfadvisors.in or call +91 8080506185.',
        messages: [
          {
            id: `msg_${Date.now()}`,
            role: 'bot',
            sender: 'bot',
            content: 'Thank you for reaching out! You can connect with our advisors directly at info@yfadvisors.in or call +91 8080506185.',
            timestamp: new Date().toISOString(),
          },
        ],
      });
    }

    const chatJson = await chatResponse.json();
    const botAnswer =
      chatJson.choices?.[0]?.message?.content ||
      'I am here to assist you with any YF Advisors services!';

    return NextResponse.json({
      success: true,
      message: botAnswer,
      userId,
      messages: [
        {
          id: `msg_${Date.now()}`,
          role: 'bot',
          sender: 'bot',
          content: botAnswer,
          text: botAnswer,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error('Error in RAG chat route:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error processing chat message',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const userId = pathParts[pathParts.length - 1] || 'guest';

  return NextResponse.json({
    success: true,
    userId,
    messages: [],
  });
}
