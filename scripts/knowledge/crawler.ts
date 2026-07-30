import { PrismaClient } from '@prisma/client';
import { ScannedPage } from './types';
import { extractCleanText } from './extractor';

/**
 * Discovers all website pages:
 * 1. Static routes (Home, About, Contact, Services listing, Blogs listing, Terms, etc.)
 * 2. Dynamic Service pages from Prisma DB (`/services/[slug]`)
 * 3. Dynamic Blog pages from Prisma DB (`/blogs/[slug]`)
 * 
 * Filters out admin, auth, and API routes.
 */
export async function crawlWebsite(prisma: PrismaClient): Promise<ScannedPage[]> {
  const pages: ScannedPage[] = [];

  // --- 1. STATIC PAGES ---
  const staticPages = [
    {
      url: '/',
      title: 'Homepage - YF Advisors',
      category: 'static' as const,
      fetchContent: async () => {
        const homepage = await prisma.homepage.findFirst({ orderBy: { createdAt: 'asc' } });
        let text = `YF Advisors - Premier Financial, Accounting & Legal Solutions.\n`;
        if (homepage) {
          text += `Hero Title: ${homepage.heroTitle}\n`;
          text += `Hero Description: ${homepage.heroDescription}\n`;
          if (homepage.heroCards) {
            try {
              const cards = JSON.parse(homepage.heroCards);
              if (Array.isArray(cards)) {
                text += `Core Services Badges:\n` + cards.map((c) => `- ${c.title}: ${c.subtitle}`).join('\n');
              }
            } catch (e) {}
          }
        }
        return text;
      },
    },
    {
      url: '/about-us',
      title: 'About Us - YF Advisors',
      category: 'static' as const,
      fetchContent: async () => {
        const about = await prisma.about.findFirst({
          include: {
            visionPoints: true,
            missionPoints: true,
            statistics: true,
          },
        });
        if (!about) return 'About YF Advisors - Strategic financial partners helping businesses grow with clarity, compliance, and confidence.';
        let text = `${about.title}\n${about.subtitle}\n`;
        text += `Who We Are: ${about.whoWeAreTitle}\n${about.whoWeAreContent}\n`;
        text += `Why Choose Us: ${about.whyChooseTitle}\n${about.whyChooseContent}\n`;
        if (about.visionPoints?.length) {
          text += `Vision:\n` + about.visionPoints.map((v) => `- ${v.title}`).join('\n') + '\n';
        }
        if (about.missionPoints?.length) {
          text += `Mission:\n` + about.missionPoints.map((m) => `- ${m.title}`).join('\n') + '\n';
        }
        if (about.statistics?.length) {
          text += `Statistics:\n` + about.statistics.map((s) => `- ${s.title}: ${s.value}`).join('\n') + '\n';
        }
        return text;
      },
    },
    {
      url: '/contact',
      title: 'Contact Us - YF Advisors',
      category: 'static' as const,
      fetchContent: async () => {
        const contact = await prisma.contact.findFirst();
        if (!contact) return 'Contact YF Advisors for advisory and compliance queries. Phone: +91 8080506185 Email: info@yfadvisors.in';
        return `Contact Us: ${contact.title}\nOffice: ${contact.officeTitle} - ${contact.address}\nEmail: ${contact.emailTitle} - ${contact.email}\nPhone: ${contact.phoneTitle} - ${contact.phone}\nOffice Hours: ${contact.officeHours || 'Monday to Saturday, 9 AM - 7 PM'}`;
      },
    },
    {
      url: '/services',
      title: 'Our Services - YF Advisors',
      category: 'static' as const,
      fetchContent: async () => {
        const services = await prisma.service.findMany({ where: { status: 'PUBLISHED' } });
        return `YF Advisors Professional Services:\n` + services.map((s) => `• ${s.title}: ${s.cardDescription} (${s.keyValue})`).join('\n');
      },
    },
    {
      url: '/blogs',
      title: 'Insights & Blogs - YF Advisors',
      category: 'static' as const,
      fetchContent: async () => {
        const blogs = await prisma.blog.findMany({ where: { status: 'PUBLISHED' } });
        return `YF Advisors Insights & Articles:\n` + blogs.map((b) => `• ${b.title}: ${b.cardDescription}`).join('\n');
      },
    },
    {
      url: '/#products',
      title: 'Digital & Field Products (AuditVeda, PayVeda, BTL) - YF Advisors',
      category: 'static' as const,
      fetchContent: async () => {
        return `YF Advisors Digital & Field Solutions Products:\n\n` +
          `Product 1: AuditVeda\n` +
          `Tagline: Audit Management Simplified\n` +
          `Type: Mobile App\n` +
          `Description: A comprehensive solution designed to streamline your audit processes. Track compliance, manage checklists, and generate real-time reports directly from your device.\n` +
          `Key Features:\n` +
          `- Real-time Audit Tracking\n` +
          `- Digital Checklists & Evidence\n` +
          `- Instant Report Generation\n` +
          `Official Website & Link: https://www.auditveda.com/\n\n` +
          `Product 2: PayVeda\n` +
          `Tagline: Payroll in Your Pocket\n` +
          `Type: Web Platform\n` +
          `Description: Experience seamless payroll and HR management on the web. PayVeda empowers employees and employers with instant access to payslips, leave management, and attendance tracking.\n` +
          `Key Features:\n` +
          `- View & Download Payslips\n` +
          `- Leave & Attendance Management\n` +
          `- Tax & Compliance Alerts\n` +
          `Official Website & Link: https://www.payveda.co.in/\n\n` +
          `Product 3: BTL & Field Execution\n` +
          `Tagline: Last-Mile Excellence & On-Ground Activation\n` +
          `Type: Field Execution\n` +
          `Description: Comprehensive on-ground activations and brand promotions designed to recreate real-world conditions for last-mile excellence and operational intelligence.\n` +
          `Key Features:\n` +
          `- On-ground activations & brand promotions\n` +
          `- Retail and market audits\n` +
          `- End-to-end field-led & last-mile execution initiatives.`;
      },
    },
  ];

  for (const p of staticPages) {
    const raw = await p.fetchContent();
    pages.push({
      url: p.url,
      title: p.title,
      category: p.category,
      rawText: extractCleanText(raw),
    });
  }

  // --- 2. DYNAMIC SERVICE PAGES ---
  const services = await prisma.service.findMany({
    include: {
      offerings: { orderBy: { order: 'asc' } },
      capabilities: { orderBy: { order: 'asc' } },
      benefits: { orderBy: { order: 'asc' } },
      whyChooseUs: { orderBy: { order: 'asc' } },
      workSteps: { orderBy: { stepNumber: 'asc' } },
    },
  });

  for (const s of services) {
    let serviceText = `Service: ${s.title}\n`;
    serviceText += `Summary: ${s.cardDescription}\nKey Value: ${s.keyValue}\n\nOverview:\n${s.description}\n\n`;

    if (s.offerings.length > 0) {
      serviceText += `Core Offerings:\n` + s.offerings.map((o) => `• ${o.title}: ${o.description}`).join('\n') + '\n\n';
    }

    if (s.capabilities.length > 0) {
      serviceText += `Capabilities & Deliverables:\n` + s.capabilities.map((c) => `• ${c.title}: ${c.description}`).join('\n') + '\n\n';
    }

    if (s.benefits.length > 0) {
      serviceText += `Key Benefits:\n` + s.benefits.map((b) => `• ${b.title}: ${b.description}`).join('\n') + '\n\n';
    }

    if (s.whyChooseUs.length > 0) {
      serviceText += `Why Choose YF Advisors for ${s.title}:\n` + s.whyChooseUs.map((w) => `• ${w.title}: ${w.description}`).join('\n') + '\n\n';
    }

    if (s.workSteps.length > 0) {
      serviceText += `Process & Steps:\n` + s.workSteps.map((step) => `Step ${step.stepNumber} - ${step.title}: ${step.description}`).join('\n') + '\n\n';
    }

    pages.push({
      url: `/services/${s.slug}`,
      title: `${s.title} - Services | YF Advisors`,
      category: 'service',
      rawText: extractCleanText(serviceText),
    });
  }

  // --- 3. DYNAMIC BLOG PAGES ---
  const blogs = await prisma.blog.findMany({
    include: {
      sections: { orderBy: { displayOrder: 'asc' } },
    },
  });

  for (const b of blogs) {
    let blogText = `Blog Article: ${b.title}\nCategory: ${b.category || 'Financial & Tax Advisory'}\nAuthor: ${b.author}\n\nExcerpt:\n${b.excerpt}\n\n`;

    if (b.content) {
      blogText += `${b.content}\n\n`;
    }

    if (b.sections.length > 0) {
      blogText += b.sections.map((sec) => `${sec.heading || ''}\n${sec.content}`).join('\n\n');
    }

    pages.push({
      url: `/blogs/${b.slug}`,
      title: `${b.title} - YF Advisors Blog`,
      category: 'blog',
      rawText: extractCleanText(blogText),
    });
  }

  return pages;
}
