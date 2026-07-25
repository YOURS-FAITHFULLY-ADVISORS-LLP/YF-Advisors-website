# 📊 YFA Website Real Visitor Analytics & Geolocation System Plan

This document outlines the end-to-end architecture, IP geolocation resolution, real-time online/offline status calculation, and tracking logic implemented in the YFA Website codebase.

---

## 🚀 1. Overview & Privacy Architecture

- **Privacy-Friendly**: No personally identifiable information (PII) like names or emails are collected. IP addresses are hashed using SHA-256 before storage.
- **Admin Filtering**: Route guard ignores all `/admin` routes so admin activity does not skew website analytics.
- **Real-Time Heartbeat**: Client-side background pinging keeps active visitor states accurate in real time.

---

## 🆔 2. Visitor Identity & Storage Protocol

| Entity | Identifier Format | Storage Medium | Lifecycle & Behavior |
| :--- | :--- | :--- | :--- |
| **Visitor ID** | `V-000001`, `V-000002`... | `localStorage` (`yf_analytics_vid`) | **Persistent across visits.** Next numeric ID generated upon first visit. |
| **Session ID** | UUID string | `sessionStorage` (`yf_analytics_sid`) | **Session-based.** Created per browser tab session; resets when tab closes. |
| **Hashed IP** | 16-char SHA-256 string | Server Database (`ipHash`) | Generated via `crypto.createHash('sha256').update(ip + ANALYTICS_SALT)`. |

---

## 🌍 3. Real IP Resolution & Geolocation Logic

1. **Client Request Handling**:
   - Client sends HTTP requests to `/api/analytics/collect`.
2. **Server IP Detection**:
   - Reads client IP from HTTP headers:
     `x-real-ip` -> `x-forwarded-for` (first IP) -> fallback `127.0.0.1`.
3. **Geo-IP API Lookup (`http://ip-api.com`)**:
   - Bypasses local/private IP ranges (`127.0.0.1`, `192.168.x`, `10.x`, `172.x`).
   - Fetches real-time `country` and `city` data via a 2-second timeout fetch call.
   - Saved directly into `AnalyticsVisitor` table upon initial visitor creation.

---

## 🟢 4. Real-Time Online / Offline Status Logic

1. **Client-Side Heartbeat (Every 30 Seconds)**:
   - `AnalyticsTracker.tsx` runs an interval sending `{ type: 'heartbeat', visitorId, sessionId }` to `/api/analytics/collect`.
2. **`lastVisit` Timestamp Refresh**:
   - Server updates `lastVisit = new Date()` on every payload received (page view, button click, or heartbeat).
3. **Active Cutoff Calculation (5-Minute Threshold)**:
   - Server & API evaluate:
     ```ts
     const activeCutoff = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
     const isOnline = visitor.lastVisit >= activeCutoff;
     ```
   - **Online Badge**: Green pill (`bg-emerald-500/10 text-emerald-600`)
   - **Offline Badge**: Slate pill (`bg-slate-200/60 text-slate-500`)

---

## 📱 5. Client & Device Detection Logic

Evaluated in `AnalyticsTracker.tsx` via `navigator.userAgent`:

- **Device**: Categorized into `Mobile` (`Mobi|Android|iPhone`), `Tablet` (`iPad|Tablet`), or `Desktop`.
- **Browser**: Parsed into `Chrome`, `Safari`, `Firefox`, or `Edge`.
- **Operating System**: Parsed into `Windows`, `macOS`, `Android`, `iOS`, or `Linux`.
- **Screen & Timezone**: Captures `screen.width x screen.height`, browser language, and `Intl.DateTimeFormat().resolvedOptions().timeZone`.

---

## 🧭 6. Journey Flow, CTA Clicks & Page Exit Tracking

1. **Pageviews**:
   - Triggered on Next.js route change (`usePathname`, `useSearchParams`).
   - Updates `landingPage` (on first visit) and `exitPage` (on navigation).
2. **CTA Button Click Analytics**:
   - Global event listener intercepts clicks on `button` and `a` elements.
   - Categorizes special actions: `whatsapp_click` (`wa.me`), `phone_click` (`tel:`), `email_click` (`mailto:`).
3. **Page Leave Beacon**:
   - `beforeunload` fires `navigator.sendBeacon('/api/analytics/collect')` with `{ type: 'leave', timeSpent }` to compute exact time spent on pages.

---

## 🗄️ 7. Database Models & Schema Summary

```prisma
model AnalyticsVisitor {
  visitorId        String   @id // e.g. V-000015
  ipHash           String
  country          String   // e.g. India, Germany
  city             String   // e.g. Mumbai, Nuremberg
  browser          String
  device           String
  os               String
  landingPage      String
  exitPage         String
  visitCount       Int      @default(1)
  firstVisit       DateTime @default(now())
  lastVisit        DateTime @updatedAt
  sessions         AnalyticsSession[]
  pageViews        AnalyticsPageView[]
  events           AnalyticsEvent[]
}

model AnalyticsSession {
  id               String   @id @default(uuid())
  visitorId        String
  startedAt        DateTime
  endedAt          DateTime
  duration         Int      // In seconds
  bounce           Boolean  @default(true)
  pages            Int      @default(1)
}
```

---

## ⚙️ 8. Admin API Endpoints

- **`GET /api/admin/analytics/dashboard`**: Aggregates total visitors, unique count, active online count, device percentages, top cities/countries, and CTA clicks.
- **`GET /api/admin/analytics/visitors`**: Returns paginated list ordered by sequential `visitorId` (`sortBy=visitorId&sortOrder=desc`) with search & online filter.
- **`GET /api/admin/analytics/visitor/[visitorId]`**: Returns full technical spec details and step-by-step page journey flow.
