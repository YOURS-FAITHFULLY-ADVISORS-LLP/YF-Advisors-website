import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import nodemailer from 'nodemailer';

const ipRequestCounts = new Map();
const ipRateLimits = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_TOTAL_REQUESTS = 10;

setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRateLimits.entries()) {
    if (now - data.windowStart > RATE_LIMIT_WINDOW) {
      ipRateLimits.delete(ip);
    }
  }
}, 5 * 60 * 1000);

function getClientIp(headersList) {
  const forwarded = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const cfConnectingIp = headersList.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

function isIpBlocked(ip) {
  const totalRequests = ipRequestCounts.get(ip) || 0;
  return totalRequests >= MAX_TOTAL_REQUESTS;
}

function checkRateLimit(ip) {
  const now = Date.now();
  const ipData = ipRateLimits.get(ip);

  if (!ipData || now - ipData.windowStart > RATE_LIMIT_WINDOW) {
    ipRateLimits.set(ip, {
      count: 1,
      windowStart: now,
    });
    return true;
  }

  if (ipData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  ipData.count++;
  return true;
}

function incrementIpCount(ip) {
  const currentCount = ipRequestCounts.get(ip) || 0;
  ipRequestCounts.set(ip, currentCount + 1);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

function sanitizeInput(input) {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 1000);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const headersList = headers();
    const clientIp = getClientIp(headersList);

    if (isIpBlocked(clientIp)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Maximum request limit exceeded. Please contact us directly.' 
        },
        { status: 429 }
      );
    }

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please try again in a minute.' 
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, contact, service, message } = body;

    if (!name || !email || !contact || !service) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'All required fields must be filled.' 
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email address.' 
        },
        { status: 400 }
      );
    }

    if (!isValidPhone(contact)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid phone number.' 
        },
        { status: 400 }
      );
    }

    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      contact: sanitizeInput(contact),
      service: sanitizeInput(service),
      message: message ? sanitizeInput(message) : '',
      submittedAt: new Date().toISOString(),
      ip: clientIp,
    };

    incrementIpCount(clientIp);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_RECEIVER, 
      subject: `New Contact Inquiry: ${sanitizedData.name} - ${sanitizedData.service}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #00A79D;">New Website Inquiry</h2>
          <p><strong>Service:</strong> ${sanitizedData.service}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Name:</strong> ${sanitizedData.name}</p>
          <p><strong>Email:</strong> ${sanitizedData.email}</p>
          <p><strong>Phone:</strong> ${sanitizedData.contact}</p>
          <p><strong>Date:</strong> ${new Date(sanitizedData.submittedAt).toLocaleString()}</p>
          <p><strong>IP:</strong> ${sanitizedData.ip}</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0;"><strong>Message:</strong></p>
            <p style="margin-top: 5px;">${sanitizedData.message || 'No message provided.'}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully!' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}