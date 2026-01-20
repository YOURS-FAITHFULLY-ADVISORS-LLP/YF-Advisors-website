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
    const headersList = await headers();
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
      subject: `New Lead: ${sanitizedData.name} - ${sanitizedData.service}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 30px; margin-bottom: 30px;">
            
            <div style="background-color: #00A79D; padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">New Website Inquiry</h1>
              <p style="color: #e0fffc; margin: 8px 0 0 0; font-size: 14px;">You received a new message from the contact form</p>
            </div>

            <div style="padding: 30px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #888888; font-size: 13px; width: 30%; text-transform: uppercase; letter-spacing: 0.5px;">Name</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 16px; font-weight: 600;">${sanitizedData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #888888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Service</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #00A79D; font-size: 16px; font-weight: bold;">${sanitizedData.service}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #888888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 16px;">
                    <a href="mailto:${sanitizedData.email}" style="color: #333333; text-decoration: none;">${sanitizedData.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #888888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 16px;">
                    <a href="tel:${sanitizedData.contact}" style="color: #333333; text-decoration: none;">${sanitizedData.contact}</a>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 30px; background-color: #f8f9fa; border-left: 4px solid #00A79D; padding: 20px; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold;">Message</p>
                <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${sanitizedData.message || 'No message provided.'}</p>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center;">
                <p style="margin: 0; color: #999999; font-size: 12px;">Submitted on ${new Date(sanitizedData.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                <p style="margin: 5px 0 0 0; color: #cccccc; font-size: 11px;">IP Address: ${sanitizedData.ip}</p>
              </div>
            </div>

            <div style="background-color: #333333; padding: 15px; text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">&copy; ${new Date().getFullYear()} YF Advisors System Notification</p>
            </div>
          </div>
        </body>
        </html>
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