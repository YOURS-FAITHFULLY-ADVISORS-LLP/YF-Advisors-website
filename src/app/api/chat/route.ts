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

    // 1. Fetch total published blogs count for accurate counting queries
    const totalBlogsCount = await prisma.blog.count({
      where: { status: 'PUBLISHED' },
    });

    // 2. Generate query embedding using Mistral Embeddings API
    const queryVector = await generateSingleEmbedding(messageText, apiKey);

    // 3. Perform semantic search over vector database (Top 8 relevant chunks)
    const contextChunks = await repo.searchSimilarChunks(queryVector, 8);

    let contextText = '';
    if (contextChunks.length > 0) {
      contextText = contextChunks
        .map(
          (c, idx) =>
            `--- Document ${idx + 1}: ${c.pageTitle} (${c.pageUrl}) ---\n${c.content}`
        )
        .join('\n\n');
    }

    // 4. Formulate RAG Prompt for Mistral Chat Completion
    const systemPrompt = `You are the official AI assistant for YF Advisors (Your Faithfully Advisors LLP).
You answer user questions accurately, professionally, and politely based on the provided website knowledge base context.

Database Stats:
- Total Published Blogs: ${totalBlogsCount}

Knowledge Base Context:
${contextText || 'No specific document context found.'}

Core Product Info:
- **AuditVeda**: Mobile audit management application. Features real-time audit tracking, digital checklists & evidence, and instant report generation. Website: https://www.auditveda.com/
- **PayVeda**: Web payroll & HR management platform. Features payslip access/downloads, leave & attendance management, and tax/compliance alerts. Website: https://www.payveda.co.in/
- **BTL & Field Execution**: On-ground brand activations, retail & market audits, and last-mile execution.

Formatting Rules:
- DO NOT use markdown headers (like #, ##, or ###). Use simple bold text for titles/categories (e.g. **AuditVeda**, **PayVeda**, **Finance Consulting**).
- Give concise, beautifully structured responses with short bullet points.
- When asked how many blogs exist, state accurately that there are ${totalBlogsCount} published blogs.
- When asked about products like AuditVeda or PayVeda, ALWAYS mention their core capabilities, features, and include their direct website URLs (https://www.auditveda.com/ for AuditVeda, https://www.payveda.co.in/ for PayVeda).
- Never output long walls of text. Keep list items punchy (1-2 sentences max).
- If appropriate, provide contact info (Phone: +91 8080506185, Email: info@yfadvisors.in).`;

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
