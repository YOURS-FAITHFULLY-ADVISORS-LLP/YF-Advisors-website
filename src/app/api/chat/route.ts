import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';
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

    const mistral = new Mistral({ apiKey });
    const repo = new KnowledgeRepository();

    // 1. Fetch live database counts & content for complete website context
    const [totalBlogsCount, totalServicesCount, testimonials, teamMembers, contactInfo] = await Promise.all([
      prisma.blog.count({ where: { status: 'PUBLISHED' } }),
      prisma.service.count({ where: { status: 'PUBLISHED' } }),
      prisma.testimonial.findMany({ where: { status: 'PUBLISHED' }, select: { review: true, name: true, company: true, rating: true } }),
      prisma.team.findMany({ where: { status: 'PUBLISHED' }, select: { name: true, designation: true } }),
      prisma.contact.findFirst(),
    ]);

    let contextChunks: any[] = [];
    try {
      // 2. Generate query embedding using Mistral Embeddings API
      const queryVector = await generateSingleEmbedding(messageText, apiKey);
      // 3. Perform semantic search over vector database (Top 10 relevant chunks)
      contextChunks = await repo.searchSimilarChunks(queryVector, 10);
    } catch (embErr) {
      console.warn('Note: Vector search fallback mode activated:', embErr);
    } finally {
      await repo.disconnect();
    }

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
      ? teamMembers.map((m) => `- ${m.name} (${m.designation})`).join('\n')
      : '- Advisory & Financial Experts Team';

    const officeHoursText = contactInfo?.officeHours || 'Monday to Saturday: 9:00 AM - 7:00 PM (IST). Closed on Sundays.';
    const contactPhone = contactInfo?.phone || '+91 8080506185';
    const contactEmail = contactInfo?.email || 'info@yfadvisors.in';
    const contactAddress = contactInfo?.address || 'Mumbai, Maharashtra, India';

    // 4. Formulate Prompt Engineer Grade RAG System Prompt
    const systemPrompt = `[IDENTITY & ROLE]
You are the official AI Assistant for YF Advisors (Your Faithfully Advisors LLP). Your core mission is to deliver high-precision, well-formatted, factual responses regarding YF Advisors' services, products, blog insights, and company details.

[LIVE DATABASE METRICS & SITE CONTEXT]
- Total Published Blogs: ${totalBlogsCount}
- Total Published Services: ${totalServicesCount}
- Office Hours: ${officeHoursText}
- Office Address: ${contactAddress}
- Contact Phone: ${contactPhone}
- Contact Email: ${contactEmail}

[FLAGSHIP DIGITAL & FIELD PRODUCTS]
1. **AuditVeda**: Mobile audit management application for simplified compliance, real-time audit tracking, digital evidence, and instant report generation.
   - Official Link: https://www.auditveda.com/
2. **PayVeda**: Web payroll & HR management platform for instant payslip access/downloads, attendance, leave management, and tax/compliance alerts.
   - Official Link: https://www.payveda.co.in/
3. **BTL & Field Execution**: On-ground brand activations, retail/market audits, and last-mile execution.

[CLIENT TESTIMONIALS & FEEDBACK]
${formattedTestimonials}

[LEADERSHIP & EXPERT TEAM]
${formattedTeam}

[KNOWLEDGE BASE RETRIEVAL CONTEXT]
${contextText || 'No specific document context found.'}

[RESPONSE GENERATION RULES]
1. **Accuracy & Truthfulness**: Never guess or invent numbers. State accurately that YF Advisors has ${totalBlogsCount} published blogs and ${totalServicesCount} published services.
2. **Product Enquiries (AuditVeda & PayVeda)**: Always provide a full overview of features and include the direct URL (e.g. https://www.auditveda.com/ or https://www.payveda.co.in/) so the user can visit and launch the product website directly.
3. **Office Hours & Location**: When asked about hours or address, state:
   - **Office Hours**: ${officeHoursText}
   - **Address**: ${contactAddress}
4. **Formatting**: 
   - DO NOT use markdown headers (#, ##, ###).
   - Use bold text for key terms (**Title**).
   - Use punchy bullet points with clear spacing.
5. **Contact Standard**: Conclude helpful answers with: Phone: ${contactPhone} | Email: ${contactEmail}.`;

    // 5. Call Mistral Chat Completion using official SDK
    let botAnswer = '';
    try {
      const chatResponse = await mistral.chat.complete({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: messageText },
        ],
        temperature: 0.3,
        maxTokens: 600,
      });

      const choiceContent = chatResponse.choices?.[0]?.message?.content;
      if (typeof choiceContent === 'string') {
        botAnswer = choiceContent;
      } else if (Array.isArray(choiceContent)) {
        botAnswer = choiceContent.map((chunk: any) => chunk.text || '').join('');
      }
    } catch (sdkErr) {
      console.error('Mistral SDK Chat Completion error:', sdkErr);
      botAnswer = `Our office hours are ${officeHoursText}. Office Address: ${contactAddress}. You can reach our support team directly at ${contactEmail} or call ${contactPhone}.`;
    }

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
    const fallbackMsg = 'Thank you for contacting YF Advisors! You can reach our support team directly at info@yfadvisors.in or call +91 8080506185 (Monday to Saturday, 9:00 AM - 7:00 PM).';
    return NextResponse.json({
      success: true,
      message: fallbackMsg,
      userId: 'guest',
      messages: [
        {
          id: `msg_${Date.now()}`,
          role: 'bot',
          sender: 'bot',
          content: fallbackMsg,
          text: fallbackMsg,
          timestamp: new Date().toISOString(),
        },
      ],
    });
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
