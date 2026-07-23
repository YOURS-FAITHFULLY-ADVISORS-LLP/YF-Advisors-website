# YF Advisors Website API Endpoints Documentation

This document contains full, comprehensive technical specifications for all API endpoints, including file locations, HTTP methods, authorization requirements, rate limits, request parameters, request body schemas, validation rules, and expected response payloads (both success and error outputs).

---

## Standard API Response & Error Conventions

All standard API endpoints (wrapped by `withApiHandler`) conform to a uniform response structure.

### Success Response Format (`200 OK` / `201 Created`)
```json
{
  "success": true,
  "message": "Operation description string",
  "data": { ... },
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```
*Note: `meta` is included only for paginated list endpoints.*

### Error Response Format (`400` / `401` / `404` / `422` / `500`)
```json
{
  "success": false,
  "message": "High level error message",
  "errors": [
    "Detailed error description 1",
    "field.name: Validation message"
  ]
}
```

---

## 1. Authentication API Endpoints (Starts Here)

### 1.1 Admin Login
- **File**: [src/app/api/admin/auth/login/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/auth/login/route.ts)
- **Method**: `POST`
- **Authentication**: Public (`{ isPublic: true }`)
- **Function**: Validates admin credentials against `ADMIN_ID` & `ADMIN_PASS` environment variables (supports plain text or bcrypt hash), issues JWT token, and sets standard HTTP-only session cookie.

#### Request Body (`application/json`)
| Field | Type | Required | Validation |
| :--- | :--- | :--- | :--- |
| `username` | string | **Yes** | Non-empty string (`z.string().min(1)`) |
| `password` | string | **Yes** | Non-empty string (`z.string().min(1)`) |

```json
{
  "username": "admin",
  "password": "SuperSecretPassword123"
}
```

#### Expected Responses

**`200 OK` - Success**
```json
{
  "success": true,
  "message": "Admin logged in successfully",
  "data": {
    "user": {
      "id": "admin",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**`401 Unauthorized` - Incorrect Credentials**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": [
    "Incorrect Admin ID or Password"
  ]
}
```

**`422 Unprocessable Entity` - Schema Validation Error**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "username: Admin ID is required"
  ]
}
```

**`500 Internal Server Error` - Server Config Missing**
```json
{
  "success": false,
  "message": "Admin authentication credentials are not configured on the server",
  "errors": []
}
```

---

### 1.2 Admin Session Check (Me)
- **File**: [src/app/api/admin/auth/me/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/auth/me/route.ts)
- **Method**: `GET`
- **Authentication**: Admin Session Required (via Cookie `admin_session` OR `Authorization: Bearer <token>` Header)
- **Function**: Verifies if the user has an active admin JWT token / cookie and returns the current user profile.

#### Expected Responses

**`200 OK` - Active Session**
```json
{
  "success": true,
  "message": "Admin session is active",
  "data": {
    "user": {
      "id": "vishal@yfadvisors.in",
      "role": "admin"
    }
  }
}
```

**`401 Unauthorized` - No Active Session / Token Expired**
```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": [
    "No active admin session or token provided"
  ]
}
```

---

### 1.3 Admin Logout
- **File**: [src/app/api/admin/auth/logout/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/auth/logout/route.ts)
- **Method**: `POST`
- **Authentication**: Public / Admin
- **Function**: Clears the `admin_session` cookie on the server.

#### Expected Response

**`200 OK` - Success**
```json
{
  "success": true,
  "message": "Admin logged out successfully",
  "data": null
}
```

---

## 2. Public Contact API Endpoints

### 2.1 Submit Contact / Lead Form
- **File**: [src/app/api/contact/route.js](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/contact/route.js)
- **Method**: `POST`
- **Authentication**: Public
- **Rate Limit & Security**:
  - Max 5 requests per 1-minute window per IP.
  - Max 10 total lifetime requests per IP address before permanent block.
  - HTML content sanitization applied to inputs.
  - Triggers email notification via Nodemailer SMTP.

#### Request Body (`application/json`)
| Field | Type | Required | Description / Constraints |
| :--- | :--- | :--- | :--- |
| `name` | string | **Yes** | Client full name (sanitized, max 1000 chars) |
| `email` | string | **Yes** | Valid email address (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) |
| `contact` | string | **Yes** | Valid phone number (min 10 digits/chars) |
| `service` | string | **Yes** | Service title or topic of inquiry |
| `message` | string | No | Detailed message or description |

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "contact": "+91 9876543210",
  "service": "Corporate Advisory",
  "message": "Interested in financial advisory services for business expansion."
}
```

#### Expected Responses

**`200 OK` - Success**
```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

**`400 Bad Request` - Missing Required Fields / Invalid Input**
```json
{
  "success": false,
  "error": "All required fields must be filled."
}
```
*(OR `"Invalid email address."` / `"Invalid phone number."`)*

**`429 Too Many Requests` - Window or Total Request Limit Exceeded**
```json
{
  "success": false,
  "error": "Too many requests. Please try again in a minute."
}
```
*(OR `"Maximum request limit exceeded. Please contact us directly."`)*

**`500 Internal Server Error` - Mailer or Server Error**
```json
{
  "success": false,
  "error": "An error occurred. Please try again later."
}
```

---

### 2.2 Disallowed Contact GET Endpoint
- **File**: [src/app/api/contact/route.js](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/contact/route.js)
- **Method**: `GET`
- **Authentication**: Public

#### Expected Response
**`405 Method Not Allowed`**
```json
{
  "error": "Method not allowed"
}
```

---

## 3. Admin Content & CMS Management

### 3.1 About Page Content Management

- **File**: [src/app/api/admin/about/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/about/route.ts)
- **Authentication**: Admin Session Required

#### A. Fetch About Page Details
- **Method**: `GET`
- **Request Parameters**: None

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "About details retrieved successfully",
  "data": {
    "id": "clx...",
    "title": "About YF Advisors",
    "subtitle": "Empowering Businesses with Strategic Financial Advisory",
    "whoWeAreTitle": "Who We Are",
    "whoWeAreContent": "YF Advisors is a premier financial advisory firm.",
    "whyChooseTitle": "Why Choose Us",
    "whyChooseContent": "Proven expertise across corporate advisory and compliance.",
    "createdAt": "2026-07-23T10:00:00.000Z",
    "updatedAt": "2026-07-23T10:00:00.000Z",
    "visionPoints": [
      { "id": "v1", "aboutId": "clx...", "title": "Client-centric strategy", "order": 0 }
    ],
    "missionPoints": [
      { "id": "m1", "aboutId": "clx...", "title": "Delivering excellence", "order": 0 }
    ],
    "statistics": [
      { "id": "s1", "aboutId": "clx...", "title": "Years Experience", "value": "15+", "icon": "award", "order": 0 }
    ]
  }
}
```

#### B. Update About Page Content
- **Method**: `PATCH`
- **Revalidates Caches**: `/about`, `/`

##### Request Body (`application/json` - All fields optional for partial update)
```json
{
  "title": "About YF Advisors LLP",
  "subtitle": "Leading Financial & Business Advisors",
  "whoWeAreTitle": "Who We Are",
  "whoWeAreContent": "Updated description content...",
  "whyChooseTitle": "Why Choose YF Advisors",
  "whyChooseContent": "Key reasons and capabilities...",
  "visionPoints": [
    { "title": "Vision point 1", "order": 0 },
    { "title": "Vision point 2", "order": 1 }
  ],
  "missionPoints": [
    { "title": "Mission point 1", "order": 0 }
  ],
  "statistics": [
    { "title": "Clients Served", "value": "500+", "icon": "users", "order": 0 }
  ]
}
```

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "About content updated successfully",
  "data": { ... }
}
```

---

### 3.2 Contact Details Management

- **File**: [src/app/api/admin/contact/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/contact/route.ts)
- **Authentication**: Admin Session Required

#### A. Fetch Contact Details
- **Method**: `GET`

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Contact details retrieved successfully",
  "data": {
    "id": "clx...",
    "title": "Contact Details",
    "officeTitle": "Our Office",
    "address": "YF Advisors Office Address, New Delhi, India",
    "emailTitle": "Email Us",
    "email": "info@yfadvisors.in",
    "phoneTitle": "Call Us",
    "phone": "+91 99999 99999",
    "googleMap": "https://maps.google.com/...",
    "officeHours": "Mon - Fri: 9:00 AM - 6:00 PM",
    "createdAt": "2026-07-23T10:00:00.000Z",
    "updatedAt": "2026-07-23T10:00:00.000Z"
  }
}
```

#### B. Update Contact Details
- **Method**: `PATCH`
- **Revalidates Caches**: `/contact`, `/`

##### Request Body (`application/json` - All fields optional)
```json
{
  "title": "Get in Touch",
  "officeTitle": "Headquarters",
  "address": "123 Business Hub, Connaught Place, New Delhi, 110001",
  "emailTitle": "Direct Email",
  "email": "contact@yfadvisors.in",
  "phoneTitle": "Phone Helpline",
  "phone": "+91 11 2345 6789",
  "googleMap": "https://maps.google.com/?q=New+Delhi",
  "officeHours": "Mon - Sat: 9:00 AM - 7:00 PM"
}
```

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Contact details updated successfully",
  "data": { ... }
}
```

---

### 3.3 Homepage Content Management

- **File**: [src/app/api/admin/homepage/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/homepage/route.ts)
- **Authentication**: Admin Session Required

#### A. Fetch Homepage Content
- **Method**: `GET`

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Homepage details retrieved successfully",
  "data": {
    "id": "clx...",
    "heroTitle": "Welcome to YF Advisors",
    "heroDescription": "Your trusted partner for financial planning and advisory services.",
    "heroImage": "https://example.com/hero.jpg",
    "heroButtonText": "Explore Services",
    "heroButtonLink": "/services",
    "createdAt": "2026-07-23T10:00:00.000Z",
    "updatedAt": "2026-07-23T10:00:00.000Z"
  }
}
```

#### B. Update Homepage Hero Section
- **Method**: `PATCH`
- **Revalidates Caches**: `/`

##### Request Body (`application/json` - All fields optional)
```json
{
  "heroTitle": "Empowering Corporate Growth & Financial Clarity",
  "heroDescription": "Tailored financial advisory, valuation, and transaction consulting.",
  "heroImage": "/uploads/hero-banner.jpg",
  "heroButtonText": "Schedule a Consultation",
  "heroButtonLink": "/contact"
}
```

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Homepage content updated successfully",
  "data": { ... }
}
```

---

### 3.4 Global Website Settings Management

- **File**: [src/app/api/admin/settings/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/settings/route.ts)
- **Authentication**: Admin Session Required

#### A. Fetch Global Settings
- **Method**: `GET`

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Global settings retrieved successfully",
  "data": {
    "id": "clx...",
    "companyName": "YF Advisors LLP",
    "companyEmail": "info@yfadvisors.in",
    "companyPhone": "+91 99999 99999",
    "companyAddress": "YF Advisors Office, New Delhi, India",
    "googleMapUrl": null,
    "logo": "/logo.png",
    "favicon": "/favicon.ico",
    "ogImage": "/og-default.png",
    "facebookUrl": "https://facebook.com/yfadvisors",
    "instagramUrl": "https://instagram.com/yfadvisors",
    "linkedinUrl": "https://linkedin.com/company/yfadvisors",
    "twitterUrl": "https://twitter.com/yfadvisors",
    "youtubeUrl": null,
    "defaultMetaTitle": "YF Advisors - Premier Financial Advisory Services",
    "defaultMetaDescription": "Strategic financial advisory, compliance, tax, and process re-engineering.",
    "defaultKeywords": "financial advisory, compliance, taxation, consulting",
    "officeHours": "Mon - Fri: 9:00 AM - 6:00 PM"
  }
}
```

#### B. Update Global Settings
- **Method**: `PATCH`
- **Revalidates Caches**: `/`

##### Request Body (`application/json` - Partial updates allowed)
```json
{
  "companyName": "YF Advisors LLP",
  "companyEmail": "contact@yfadvisors.in",
  "companyPhone": "+91 11 9876 5432",
  "linkedinUrl": "https://linkedin.com/company/yfadvisors-official",
  "defaultMetaTitle": "YF Advisors | Expert Financial & Strategic Corporate Advisory",
  "defaultMetaDescription": "Leading financial advisory firm providing CFO services, valuation, and regulatory compliance."
}
```

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Global settings updated successfully",
  "data": { ... }
}
```

---

## 4. Admin Team Management API Endpoints

- **Files**:
  - [src/app/api/admin/team/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/team/route.ts)
  - [src/app/api/admin/team/[id]/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/team/%5Bid%5D/route.ts)
  - [src/app/api/admin/team/[id]/status/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/team/%5Bid%5D/status/route.ts)

### 4.1 List Team Members
- **Method**: `GET`
- **Path**: `/api/admin/team`
- **Authentication**: Admin Session Required
- **Query Parameters**:
  - `page` *(number, default: 1)*
  - `limit` *(number, default: 10, max: 100)*
  - `search` *(string, matches name, designation, bio)*
  - `status` *(string: `"DRAFT"` \| `"PUBLISHED"`)*
  - `sortBy` *(string: `"displayOrder"` \| `"name"` \| `"createdAt"` \| `"updatedAt"`)*
  - `sortOrder` *(string: `"asc"` \| `"desc"`)*

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Team members retrieved successfully",
  "data": [
    {
      "id": "team_123",
      "name": "Jane Smith",
      "designation": "Managing Partner",
      "profileImage": "https://example.com/jane.jpg",
      "bio": "Over 15 years experience in M&A advisory.",
      "experience": "15+ Years",
      "linkedinUrl": "https://linkedin.com/in/janesmith",
      "status": "PUBLISHED",
      "displayOrder": 1,
      "createdAt": "2026-07-23T10:00:00.000Z",
      "updatedAt": "2026-07-23T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

### 4.2 Create Team Member
- **Method**: `POST`
- **Path**: `/api/admin/team`
- **Authentication**: Admin Session Required
- **Revalidates Caches**: `/about`, `/team`, `/`

#### Request Body (`application/json`)
| Field | Type | Required | Constraints |
| :--- | :--- | :--- | :--- |
| `name` | string | **Yes** | Min 1 char |
| `designation` | string | **Yes** | Min 1 char |
| `profileImage` | string | **Yes** | Min 1 char URL/path |
| `bio` | string | **Yes** | Min 1 char |
| `experience` | string | No | Optional |
| `linkedinUrl` | string | No | Optional URL |
| `status` | string | No | `"DRAFT"` \| `"PUBLISHED"` (default `"PUBLISHED"`) |
| `displayOrder` | number | No | Integer >= 0 (default `0`) |

```json
{
  "name": "Jane Smith",
  "designation": "Managing Partner",
  "profileImage": "/images/team/jane.jpg",
  "bio": "Experienced corporate advisor specializing in restructuring and growth strategy.",
  "experience": "15+ Years",
  "linkedinUrl": "https://linkedin.com/in/janesmith",
  "status": "PUBLISHED",
  "displayOrder": 1
}
```

**`201 Created` - Expected Output**
```json
{
  "success": true,
  "message": "Team member created successfully",
  "data": { ... }
}
```

---

### 4.3 Get Single Team Member
- **Method**: `GET`
- **Path**: `/api/admin/team/:id`
- **Authentication**: Admin Session Required

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Team member retrieved successfully",
  "data": { "id": "team_123", ... }
}
```

**`404 Not Found`**
```json
{
  "success": false,
  "message": "Team member not found",
  "errors": ["No team member found with the specified ID"]
}
```

---

### 4.4 Update Team Member
- **Method**: `PATCH`
- **Path**: `/api/admin/team/:id`
- **Authentication**: Admin Session Required
- **Revalidates Caches**: `/about`, `/team`, `/`

#### Request Body (`application/json` - Partial update)
```json
{
  "designation": "Senior Managing Partner",
  "displayOrder": 0
}
```

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Team member updated successfully",
  "data": { ... }
}
```

---

### 4.5 Toggle Team Member Status
- **Method**: `PATCH`
- **Path**: `/api/admin/team/:id/status`
- **Authentication**: Admin Session Required
- **Revalidates Caches**: `/about`, `/team`, `/`

#### Request Body (`application/json`)
```json
{
  "status": "DRAFT"
}
```

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Team member status updated successfully",
  "data": {
    "id": "team_123",
    "status": "DRAFT"
  }
}
```

---

### 4.6 Delete Team Member
- **Method**: `DELETE`
- **Path**: `/api/admin/team/:id`
- **Authentication**: Admin Session Required
- **Revalidates Caches**: `/about`, `/team`, `/`

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Team member deleted successfully",
  "data": {
    "id": "team_123"
  }
}
```

---

## 5. Admin Testimonials Management API Endpoints

- **Files**:
  - [src/app/api/admin/testimonials/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/testimonials/route.ts)
  - [src/app/api/admin/testimonials/[id]/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/testimonials/%5Bid%5D/route.ts)
  - [src/app/api/admin/testimonials/[id]/status/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/testimonials/%5Bid%5D/status/route.ts)

### 5.1 List Testimonials
- **Method**: `GET`
- **Path**: `/api/admin/testimonials`
- **Authentication**: Admin Session Required
- **Query Parameters**:
  - `page` *(number, default: 1)*
  - `limit` *(number, default: 10, max: 100)*
  - `search` *(string, matches name, company, designation, review)*
  - `status` *(string: `"DRAFT"` \| `"PUBLISHED"`)*
  - `isVerified` *(boolean: `true` \| `false`)*
  - `sortBy` *(string: `"displayOrder"` \| `"rating"` \| `"name"` \| `"createdAt"` \| `"updatedAt"`)*
  - `sortOrder` *(string: `"asc"` \| `"desc"`)*

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Testimonials retrieved successfully",
  "data": [
    {
      "id": "testi_123",
      "name": "Robert Chen",
      "designation": "CFO",
      "company": "Tech Ventures Ltd",
      "profileImage": null,
      "initials": "RC",
      "review": "YF Advisors provided exceptional valuation services.",
      "rating": 5,
      "isVerified": true,
      "status": "PUBLISHED",
      "displayOrder": 1,
      "createdAt": "2026-07-23T10:00:00.000Z",
      "updatedAt": "2026-07-23T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

### 5.2 Create Testimonial
- **Method**: `POST`
- **Path**: `/api/admin/testimonials`
- **Authentication**: Admin Session Required
- **Revalidates Caches**: `/testimonials`, `/`

#### Request Body (`application/json`)
| Field | Type | Required | Constraints |
| :--- | :--- | :--- | :--- |
| `name` | string | **Yes** | Min 1 char |
| `designation` | string | **Yes** | Min 1 char |
| `review` | string | **Yes** | Min 1 char |
| `company` | string | No | Optional company name |
| `profileImage` | string | No | Optional image URL/path |
| `initials` | string | No | Optional avatar initials |
| `rating` | number | No | Integer from 1 to 5 (default `5`) |
| `isVerified` | boolean | No | Default `true` |
| `status` | string | No | `"DRAFT"` \| `"PUBLISHED"` (default `"PUBLISHED"`) |
| `displayOrder` | number | No | Integer >= 0 (default `0`) |

```json
{
  "name": "Robert Chen",
  "designation": "CFO",
  "company": "Tech Ventures Ltd",
  "initials": "RC",
  "review": "YF Advisors provided exceptional valuation services during our fundraising round.",
  "rating": 5,
  "isVerified": true,
  "status": "PUBLISHED",
  "displayOrder": 1
}
```

**`201 Created` - Expected Output**
```json
{
  "success": true,
  "message": "Testimonial created successfully",
  "data": { ... }
}
```

---

### 5.3 Get Single Testimonial
- **Method**: `GET`
- **Path**: `/api/admin/testimonials/:id`
- **Authentication**: Admin Session Required

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Testimonial retrieved successfully",
  "data": { "id": "testi_123", ... }
}
```

---

### 5.4 Update Testimonial
- **Method**: `PATCH`
- **Path**: `/api/admin/testimonials/:id`
- **Authentication**: Admin Session Required
- **Revalidates Caches**: `/testimonials`, `/`

#### Request Body (`application/json` - Partial update)
```json
{
  "rating": 5,
  "isVerified": true
}
```

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Testimonial updated successfully",
  "data": { ... }
}
```

---

### 5.5 Toggle Testimonial Status
- **Method**: `PATCH`
- **Path**: `/api/admin/testimonials/:id/status`
- **Authentication**: Admin Session Required
- **Revalidates Caches**: `/testimonials`, `/`

#### Request Body (`application/json`)
```json
{
  "status": "PUBLISHED"
}
```

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Testimonial status updated successfully",
  "data": { "id": "testi_123", "status": "PUBLISHED" }
}
```

---

### 5.6 Delete Testimonial
- **Method**: `DELETE`
- **Path**: `/api/admin/testimonials/:id`
- **Authentication**: Admin Session Required
- **Revalidates Caches**: `/testimonials`, `/`

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Testimonial deleted successfully",
  "data": { "id": "testi_123" }
}
```

---

## 6. Admin Services Management API Endpoints

### 6.1 Toggle Service Status
- **File**: [src/app/api/admin/services/[id]/status/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/services/%5Bid%5D/status/route.ts)
- **Method**: `PATCH`
- **Path**: `/api/admin/services/:id/status`
- **Authentication**: Admin Session Required
- **Behavior**: Automatically updates `publishedAt` timestamp when status is set to `PUBLISHED`.
- **Revalidates Caches**: `/services`, `/services/:slug`

#### Request Body (`application/json`)
```json
{
  "status": "PUBLISHED"
}
```

#### Expected Responses

**`200 OK` - Success**
```json
{
  "success": true,
  "message": "Service status updated successfully",
  "data": {
    "id": "service_123",
    "slug": "corporate-advisory",
    "status": "PUBLISHED",
    "publishedAt": "2026-07-23T10:00:00.000Z"
  }
}
```

**`404 Not Found`**
```json
{
  "success": false,
  "message": "Service not found",
  "errors": ["Cannot update status of non-existing service"]
}
```

---

## 7. Admin Blogs Management API Endpoints

- **Files**:
  - [src/app/api/admin/blogs/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/blogs/route.ts)
  - [src/app/api/admin/blogs/[id]/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/blogs/%5Bid%5D/route.ts)
  - [src/app/api/admin/blogs/[id]/status/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/blogs/%5Bid%5D/status/route.ts)

### 7.1 List Blogs
- **Method**: `GET`
- **Path**: `/api/admin/blogs`
- **Authentication**: Admin Session Required
- **Query Parameters**:
  - `page` *(number, default: 1)*
  - `limit` *(number, default: 10, max: 100)*
  - `search` *(string, matches title, cardDescription, excerpt, category, tags)*
  - `status` *(string: `"DRAFT"` \| `"PUBLISHED"`)*
  - `sortBy` *(string: `"title"` \| `"createdAt"` \| `"updatedAt"` \| `"publishedAt"`)*
  - `sortOrder` *(string: `"asc"` \| `"desc"`)*

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Blogs retrieved successfully",
  "data": [
    {
      "id": "blog_123",
      "title": "Understanding Financial Valuation",
      "slug": "understanding-financial-valuation",
      "cardDescription": "A comprehensive guide to financial valuation models.",
      "excerpt": "Financial valuation is key for corporate strategy.",
      "image": "https://example.com/blog.jpg",
      "category": "Corporate Finance",
      "tags": "valuation, advisory",
      "author": "YF Advisors",
      "content": "Full blog content in markdown or HTML",
      "status": "PUBLISHED",
      "publishedAt": "2026-07-23T10:00:00.000Z",
      "createdAt": "2026-07-23T10:00:00.000Z",
      "updatedAt": "2026-07-23T10:00:00.000Z",
      "sections": []
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

### 7.2 Create Blog
- **Method**: `POST`
- **Path**: `/api/admin/blogs`
- **Authentication**: Admin Session Required
- **Revalidates Caches**: `/blogs`, `/blogs/:slug`, `/`

#### Request Body (`application/json`)
| Field | Type | Required | Constraints |
| :--- | :--- | :--- | :--- |
| `title` | string | **Yes** | Min 1 char |
| `slug` | string | **Yes** | Unique slug |
| `cardDescription` | string | **Yes** | Min 1 char |
| `excerpt` | string | **Yes** | Min 1 char |
| `image` | string | No | Optional header image URL/path |
| `category` | string | No | Optional category |
| `tags` | string | No | Optional comma-separated tags |
| `author` | string | No | Default `"YF Advisors"` |
| `content` | string | No | Optional main text body |
| `status` | string | No | `"DRAFT"` \| `"PUBLISHED"` (default `"DRAFT"`) |

```json
{
  "title": "Understanding Financial Valuation",
  "slug": "understanding-financial-valuation",
  "cardDescription": "A comprehensive guide to financial valuation models.",
  "excerpt": "Financial valuation is key for corporate strategy.",
  "category": "Corporate Finance",
  "tags": "valuation, advisory",
  "status": "PUBLISHED"
}
```

**`201 Created` - Expected Output**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": { ... }
}
```

---

### 7.3 Get Single Blog
- **Method**: `GET`
- **Path**: `/api/admin/blogs/:id`
- **Authentication**: Admin Session Required

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Blog retrieved successfully",
  "data": { "id": "blog_123", ... }
}
```

---

### 7.4 Update Blog
- **Method**: `PATCH`
- **Path**: `/api/admin/blogs/:id`
- **Authentication**: Admin Session Required
- **Revalidates Caches**: `/blogs`, `/blogs/:slug`, `/`

#### Request Body (`application/json` - Partial update)
```json
{
  "title": "Updated Title",
  "status": "PUBLISHED"
}
```

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": { ... }
}
```

---

### 7.5 Toggle Blog Status
- **Method**: `PATCH`
- **Path**: `/api/admin/blogs/:id/status`
- **Authentication**: Admin Session Required
- **Revalidates Caches**: `/blogs`, `/blogs/:slug`, `/`

#### Request Body (`application/json`)
```json
{
  "status": "PUBLISHED"
}
```

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Blog status updated successfully",
  "data": { "id": "blog_123", "status": "PUBLISHED" }
}
```

---

### 7.6 Delete Blog
- **Method**: `DELETE`
- **Path**: `/api/admin/blogs/:id`
- **Authentication**: Admin Session Required
- **Revalidates Caches**: `/blogs`, `/blogs/:slug`, `/`

**`200 OK` - Expected Output**
```json
{
  "success": true,
  "message": "Blog deleted successfully",
  "data": { "id": "blog_123" }
}
```

---

## 8. Pending & Stubbed API Endpoint Routes

The following route files are initialized in the codebase structure (`export {};`) for future module implementation:

| Module / Feature | Method(s) | Endpoint Path | File Location | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Services CRUD** | GET, POST | `/api/admin/services` | [src/app/api/admin/services/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/services/route.ts) | Stubbed |
| **Service By ID** | GET, PATCH, DELETE | `/api/admin/services/:id` | [src/app/api/admin/services/[id]/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/services/%5Bid%5D/route.ts) | Stubbed |
| **Blog Sections** | GET, POST | `/api/admin/blogs/:id/sections` | [src/app/api/admin/blogs/[id]/sections/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/blogs/%5Bid%5D/sections/route.ts) | Stubbed |
| **Blog Section By ID** | PATCH, DELETE | `/api/admin/blogs/:id/sections/:sectionId` | [src/app/api/admin/blogs/[id]/sections/[sectionId]/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/blogs/%5Bid%5D/sections/%5BsectionId%5D/route.ts) | Stubbed |
| **Blog Sections Reorder** | PATCH | `/api/admin/blogs/:id/sections/reorder` | [src/app/api/admin/blogs/[id]/sections/reorder/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/blogs/%5Bid%5D/sections/reorder/route.ts) | Stubbed |
| **Dashboard Statistics** | GET | `/api/admin/dashboard/stats` | [src/app/api/admin/dashboard/stats/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/dashboard/stats/route.ts) | Stubbed |
| **Media File Uploads** | POST | `/api/admin/uploads` | [src/app/api/admin/uploads/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/uploads/route.ts) | Stubbed |
| **Testimonial Verification Toggle** | PATCH | `/api/admin/testimonials/:id/verified` | [src/app/api/admin/testimonials/[id]/verified/route.ts](file:///home/sahil-hode/Documents/My%20Data/intern/YF%20Advisors%20Intern/projects/yfa-website/src/app/api/admin/testimonials/%5Bid%5D/verified/route.ts) | Stubbed |

