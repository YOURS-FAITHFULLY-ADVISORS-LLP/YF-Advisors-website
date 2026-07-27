'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function TrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const visitorIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const entryTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // 1. Initialize Visitor storage
    if (typeof window === 'undefined') return;

    // IGNORE ADMIN PORTAL - Do not track admin activity
    if (pathname.startsWith('/admin') || window.location.pathname.startsWith('/admin')) {
      return;
    }

    let vId = localStorage.getItem('yf_analytics_vid');
    let sId = sessionStorage.getItem('yf_analytics_sid');

    // Detect browser & device details
    const userAgent = navigator.userAgent;
    let device = 'Desktop';
    if (/Mobi|Android|iPhone/i.test(userAgent)) device = 'Mobile';
    else if (/iPad|Tablet/i.test(userAgent)) device = 'Tablet';

    let browser = 'Chrome';
    if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari';
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Edg/i.test(userAgent)) browser = 'Edge';

    let os = 'Windows';
    if (/Macintosh|Mac OS X/i.test(userAgent)) os = 'macOS';
    else if (/Android/i.test(userAgent)) os = 'Android';
    else if (/iPhone|iPad/i.test(userAgent)) os = 'iOS';
    else if (/Linux/i.test(userAgent)) os = 'Linux';

    const sendEvent = async (type: string, extraData = {}) => {
      try {
        const payload = {
          type,
          visitorId: vId,
          sessionId: sId,
          page: window.location.pathname + (window.location.hash ? window.location.hash : ''),
          title: document.title,
          device,
          browser,
          os,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          referrer: document.referrer || 'Direct',
          utmSource: searchParams?.get('utm_source') || null,
          utmMedium: searchParams?.get('utm_medium') || null,
          utmCampaign: searchParams?.get('utm_campaign') || null,
          timeSpent: Math.round((Date.now() - entryTimeRef.current) / 1000),
          ...extraData,
        };

        const res = await fetch('/api/analytics/collect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success) {
          if (data.visitorId) {
            vId = data.visitorId;
            localStorage.setItem('yf_analytics_vid', data.visitorId);
            visitorIdRef.current = data.visitorId;
          }
          if (data.sessionId) {
            sId = data.sessionId;
            sessionStorage.setItem('yf_analytics_sid', data.sessionId);
            sessionIdRef.current = data.sessionId;
          }
        }
      } catch (err) {
        // Silent catch for analytics
      }
    };

    // Track Section Scroll Changes (debounced to prevent scroll-through inflation)
    let sectionDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    let lastTrackedSection = '';

    const handleSectionChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const section = customEvent.detail?.section || '';
      const fullPath = customEvent.detail?.fullPath || (window.location.pathname + (window.location.hash ? window.location.hash : ''));

      // Clear any pending section tracking
      if (sectionDebounceTimer) {
        clearTimeout(sectionDebounceTimer);
      }

      // Only track if user stays on this section for 1.5s (not just scrolling past)
      sectionDebounceTimer = setTimeout(() => {
        if (section !== lastTrackedSection) {
          lastTrackedSection = section;
          sendEvent('page_view', { page: fullPath });
        }
      }, 1500);
    };

    window.addEventListener('sectionchange', handleSectionChange);

    // Track Page View on Route Change
    entryTimeRef.current = Date.now();
    sendEvent('page_view');

    // Setup CTA Button Click Event Listener
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest('button, a') as HTMLElement | null;
      if (!clickable) return;

      const text = clickable.innerText?.trim() || clickable.getAttribute('aria-label') || clickable.getAttribute('title') || 'CTA';
      const href = clickable.getAttribute('href') || '';

      let eventType = 'button_click';
      if (href.includes('wa.me') || href.includes('whatsapp')) eventType = 'whatsapp_click';
      else if (href.startsWith('tel:')) eventType = 'phone_click';
      else if (href.startsWith('mailto:')) eventType = 'email_click';

      sendEvent('button_click', {
        buttonName: text.substring(0, 40),
        metadata: { eventType, href },
      });
    };

    window.addEventListener('click', handleClick);

    // Heartbeat every 30s to keep visitor status online
    const interval = setInterval(() => {
      sendEvent('heartbeat');
    }, 30000);

    // Handle Page Exit
    const handleUnload = () => {
      const timeSpent = Math.round((Date.now() - entryTimeRef.current) / 1000);
      navigator.sendBeacon('/api/analytics/collect', JSON.stringify({
        type: 'leave',
        visitorId: vId,
        sessionId: sId,
        page: window.location.pathname + (window.location.hash ? window.location.hash : ''),
        timeSpent,
      }));
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('sectionchange', handleSectionChange);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('beforeunload', handleUnload);
      clearInterval(interval);
    };
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerContent />
    </Suspense>
  );
}

