import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import crypto from 'crypto';

// Helper to hash IP address for anonymity
function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + (process.env.ANALYTICS_SALT || 'yf_analytics_salt')).digest('hex').substring(0, 16);
}

// Generate visitor ID if not present: V-XXXXXX
async function generateVisitorId(): Promise<string> {
  const count = await prisma.analyticsVisitor.count();
  const nextNum = (count + 1).toString().padStart(6, '0');
  return `V-${nextNum}`;
}

// Lightweight geo-IP lookup using free ip-api.com service (no API key needed)
async function getGeoInfo(ip: string): Promise<{ country: string; city: string }> {
  // Skip geo for localhost / private IPs
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return { country: 'Local', city: 'Local' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2s timeout
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      return {
        country: data.country || 'Unknown',
        city: data.city || 'Unknown',
      };
    }
  } catch {
    // Geo lookup failed — not critical, fallback gracefully
  }
  return { country: 'Unknown', city: 'Unknown' };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type, // 'init' | 'page_view' | 'button_click' | 'event' | 'heartbeat' | 'leave'
      visitorId: incomingVisitorId,
      sessionId: incomingSessionId,
      page,
      title,
      buttonName,
      metadata,
      device,
      browser,
      os,
      language,
      timezone,
      screenResolution,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      timeSpent,
    } = body;

    // SERVER-SIDE GUARD: Reject admin page analytics — only track public website
    if (page && typeof page === 'string' && page.startsWith('/admin')) {
      return NextResponse.json({ success: false, error: 'Admin pages are not tracked' }, { status: 200 });
    }

    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip') || (forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1');
    const ipHash = hashIp(realIp);

    let visitorId = incomingVisitorId;
    let isNewVisitor = false;

    // 1. Find or Create Visitor
    let visitor = visitorId
      ? await prisma.analyticsVisitor.findUnique({ where: { visitorId } })
      : null;

    if (!visitor) {
      visitorId = await generateVisitorId();
      isNewVisitor = true;

      // Real geo-IP lookup for actual country and city
      const geo = await getGeoInfo(realIp);

      visitor = await prisma.analyticsVisitor.create({
        data: {
          visitorId,
          ipHash,
          country: geo.country,
          city: geo.city,
          browser: browser || 'Unknown',
          device: device || 'Unknown',
          os: os || 'Unknown',
          language: language || 'Unknown',
          timezone: timezone || 'Unknown',
          screenResolution: screenResolution || 'Unknown',
          referrer: referrer || 'Direct',
          utmSource: utmSource || null,
          utmMedium: utmMedium || null,
          utmCampaign: utmCampaign || null,
          landingPage: page || '/',
          exitPage: page || '/',
          visitCount: 1,
          firstVisit: new Date(),
          lastVisit: new Date(),
        },
      });
    } else {
      // Update last visit timestamp and exit page
      await prisma.analyticsVisitor.update({
        where: { visitorId },
        data: {
          lastVisit: new Date(),
          exitPage: page || visitor.exitPage,
        },
      });
    }

    // 2. Find or Create Session
    let sessionId = incomingSessionId;
    let session = sessionId
      ? await prisma.analyticsSession.findUnique({ where: { id: sessionId } })
      : null;

    if (!session) {
      session = await prisma.analyticsSession.create({
        data: {
          visitorId,
          startedAt: new Date(),
          endedAt: new Date(),
          duration: 0,
          bounce: true,
          pages: 1,
        },
      });
      sessionId = session.id;

      if (!isNewVisitor) {
        // Non-blocking visitor count increment
        prisma.analyticsVisitor.update({
          where: { visitorId },
          data: { visitCount: { increment: 1 } },
        }).catch(() => {});
      }
    } else {
      // Non-blocking session duration update
      const now = new Date();
      const durationSeconds = Math.max(0, Math.floor((now.getTime() - new Date(session.startedAt).getTime()) / 1000));
      const isBounce = (session.pages <= 1) && (durationSeconds < 10);
      prisma.analyticsSession.update({
        where: { id: sessionId },
        data: {
          endedAt: now,
          duration: durationSeconds,
          bounce: isBounce,
        },
      }).catch(() => {});
    }

    // 3. Process Event Types
    if (type === 'page_view') {
      await prisma.analyticsPageView.create({
        data: {
          visitorId,
          sessionId: sessionId!,
          page: page || '/',
          title: title || 'YF Advisors',
          enteredAt: new Date(),
          timeSpent: timeSpent || 0,
        },
      });

      // Secondary session bounce & pages count update
      (async () => {
        try {
          const totalViews = await prisma.analyticsPageView.count({ where: { sessionId: sessionId! } });
          const currentDuration = session?.duration || 0;
          const isBounce = totalViews <= 1 && currentDuration < 10;
          await prisma.analyticsSession.update({
            where: { id: sessionId! },
            data: {
              pages: totalViews,
              bounce: isBounce,
            },
          });
        } catch (e) {}
      })();
    } else if (type === 'button_click' || type === 'event' || type === 'conversion') {
      await Promise.all([
        prisma.analyticsEvent.create({
          data: {
            visitorId,
            sessionId: sessionId!,
            eventType: metadata?.eventType || type,
            page: page || '/',
            buttonName: buttonName || metadata?.buttonName || null,
            metadata: metadata || {},
          },
        }),
        prisma.analyticsSession.update({
          where: { id: sessionId! },
          data: { bounce: false },
        }),
      ]);
    } else if (type === 'leave' && timeSpent) {
      // Async last page view & session duration updates
      (async () => {
        try {
          const lastPv = await prisma.analyticsPageView.findFirst({
            where: { visitorId, sessionId: sessionId! },
            orderBy: { enteredAt: 'desc' },
          });
          if (lastPv) {
            await prisma.analyticsPageView.update({
              where: { id: lastPv.id },
              data: {
                leftAt: new Date(),
                timeSpent: (lastPv.timeSpent || 0) + timeSpent,
              },
            });
          }
          if (session) {
            const totalDuration = Math.max(session.duration, timeSpent);
            const isBounce = (session.pages <= 1) && (totalDuration < 10);
            await prisma.analyticsSession.update({
              where: { id: sessionId! },
              data: {
                duration: totalDuration,
                bounce: isBounce,
              },
            });
          }
        } catch (e) {}
      })();
    }

    return NextResponse.json({
      success: true,
      visitorId,
      sessionId,
    });
  } catch (error) {
    console.error('Analytics collect error:', error);
    return NextResponse.json({ success: false, error: 'Internal analytics error' }, { status: 500 });
  }
}
