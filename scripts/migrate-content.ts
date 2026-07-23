// scripts/migrate-content.ts

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { servicesData } from "../src/data/services/data";
import { blogPosts } from "../src/data/blogs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function getPublicImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const supabaseUrl = process.env.SUPABASE_URL;
  const bucket = process.env.SUPABASE_BUCKET || "uploads";

  if (supabaseUrl) {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
  }

  return path.startsWith("/") ? path : `/${path}`;
}

const getSupabasePublicUrl = getPublicImageUrl;

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\bservice(s)?\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}


// --- Add with other imports ---
import { blogPosts } from "../src/data/blogs";

// ==========================================
// 1. TEAM MIGRATION
// ==========================================

async function migrateTeam() {
  const teamData = [
    { id: 1, name: "Vishal Aggarwal", role: "Founder and Partner", description: "Chartered Accountant. Specialization: Business Process Re-engineering & Advisory.", experience: "Experience: 14+ years", image: "team/vishal.png", linkedin: "https://www.linkedin.com/in/vishal777/" },
    { id: 2, name: "Kirti Aggarwal", role: "Co-Founder and Partner", description: "Chartered Accountant. Specialization: Finance and legal operations in MNCs.", experience: "Experience: 12+ years", image: "team/kirti.png", linkedin: "https://www.linkedin.com/in/kkirti-aggarwal-a14a20125/" },
    { id: 3, name: "Saket Drona", role: "Partner", description: "Post Graduate IIM. Specialization: International offshoring & Op Excellence.", experience: "Experience: 26+ years", image: "team/saket.png", linkedin: "https://www.linkedin.com/in/saket-drona-30b0571/" },
    { id: 4, name: "Shiv Mittal", role: "Partner", description: "Specializes in Strategic Financial Management, Cash Flow & Systems.", experience: "Experience: 21+ years", image: "team/shiv.png", linkedin: "https://www.linkedin.com/in/shiv-mittal-02227344/" },
    { id: 5, name: "Deepak Babel", role: "Partner", description: "Specializes in Internal Audits, Data Analytics & Outsourcing Ops.", experience: "Experience: 15+ years", image: "team/deepak.png", linkedin: "https://www.linkedin.com/in/deepak-babel-1b576722b/" },
    { id: 6, name: "Sanjay Choudhary", role: "Growth Partner", description: "Masters, IIM Calcutta. Specialization: Operations & Delivery Quality.", experience: "Experience: 30+ years", image: "team/sanjay.png", linkedin: "https://www.linkedin.com/in/sanjay-kumar-choudhary-10a5b516/" },
    { id: 7, name: "Jyoti Mittal", role: "Growth Partner", description: "Masters in Marketing & HR. Specialization: Talent Mgmt & Acquisition.", experience: "Experience: 27+ years", image: "team/jyoti.png", linkedin: "https://www.linkedin.com/in/jyoti-mittal-99a2794/" },
    { id: 8, name: "CS. Pawan Kumar Laddha", role: "Advocate", description: "B.E., CS. | Fintech, e-Commerce & Blockchain Lawyer", experience: "Experience: 25+ years", image: "team/pawan.png", linkedin: "https://www.linkedin.com/in/pawan-l-0b82716/" },
    { id: 9, name: "Nipun Khanna", role: "Chartered Accountant", description: "Specialization: Income Tax & GST Litigation, Appeal Matters", experience: "Experience: 15+ years", image: "team/nipun.png", linkedin: "https://www.linkedin.com/in/ca-nipun-khanna-5875ba3a/" },
  ];

  for (let i = 0; i < teamData.length; i++) {
    const m = teamData[i];
    const profileImageUrl = getPublicImageUrl(m.image);

    await prisma.team.upsert({
      where: { id: `team-member-${m.id}` },
      update: {
        name: m.name,
        designation: m.role,
        profileImage: profileImageUrl,
        bio: m.description,
        experience: m.experience,
        linkedinUrl: m.linkedin,
        displayOrder: i,
      },
      create: {
        id: `team-member-${m.id}`,
        name: m.name,
        designation: m.role,
        profileImage: profileImageUrl,
        bio: m.description,
        experience: m.experience,
        linkedinUrl: m.linkedin,
        displayOrder: i,
      },
    });
  }

  console.log("✓ Team members migrated:", teamData.length);
}

// ==========================================
// 2. SERVICES MIGRATION
// ==========================================

async function migrateServices() {
  for (const svc of servicesData) {
    const iconName = (svc.icon as { displayName?: string; name?: string }).displayName
      ?? (svc.icon as { displayName?: string; name?: string }).name
      ?? null;

    const description = svc.introText.map((p) => `<p>${p}</p>`).join("\n");
    const keyValue = svc.benefitsDetail[0]?.title ?? "";

    await prisma.$transaction(async (tx) => {
      const service = await tx.service.upsert({
        where: { slug: svc.id },
        update: {
          title: svc.title,
          icon: iconName,
          image: null,
          cardDescription: svc.shortDescription,
          keyValue,
          description,
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
        create: {
          slug: svc.id,
          title: svc.title,
          icon: iconName,
          image: null,
          cardDescription: svc.shortDescription,
          keyValue,
          description,
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });

      await tx.serviceOffering.deleteMany({ where: { serviceId: service.id } });
      await tx.serviceCapability.deleteMany({ where: { serviceId: service.id } });
      await tx.serviceBenefit.deleteMany({ where: { serviceId: service.id } });
      await tx.whyChoosePoint.deleteMany({ where: { serviceId: service.id } });
      await tx.workStep.deleteMany({ where: { serviceId: service.id } });

      if (svc.detailedServices?.length) {
        await tx.serviceOffering.createMany({
          data: svc.detailedServices.map((item, idx) => ({
            serviceId: service.id,
            title: item.title,
            description: item.description,
            order: idx,
          })),
        });
      }

      if (svc.coreServices?.length) {
        await tx.serviceCapability.createMany({
          data: svc.coreServices.map((item, idx) => ({
            serviceId: service.id,
            title: item.title,
            description: item.description,
            order: idx,
          })),
        });
      }

      if (svc.benefitsDetail?.length) {
        await tx.serviceBenefit.createMany({
          data: svc.benefitsDetail.map((item, idx) => ({
            serviceId: service.id,
            title: item.title,
            description: item.description,
            order: idx,
          })),
        });
      }

      if (svc.whyChooseUs?.length) {
        await tx.whyChoosePoint.createMany({
          data: svc.whyChooseUs.map((item, idx) => ({
            serviceId: service.id,
            title: item.title,
            description: item.description,
            order: idx,
          })),
        });
      }

      if (svc.workProcess?.length) {
        await tx.workStep.createMany({
          data: svc.workProcess.map((item, idx) => ({
            serviceId: service.id,
            title: item.title,
            description: item.description,
            stepNumber: idx + 1,
          })),
        });
      }
    });

    console.log("✓ Service migrated:", svc.id);
  }

  const allServices = await prisma.service.findMany();

  for (const svc of servicesData) {
    const current = allServices.find((s) => s.slug === svc.id);
    if (!current) continue;

    await prisma.relatedService.deleteMany({ where: { serviceId: current.id } });

    for (let idx = 0; idx < (svc.otherServices ?? []).length; idx++) {
      const otherTitle = svc.otherServices[idx];
      const related = allServices.find(
        (s) =>
          s.title.toLowerCase() === otherTitle.toLowerCase() ||
          normalizeTitle(s.title) === normalizeTitle(otherTitle)
      );

      if (!related) {
        console.warn(
          `⚠️ Related service not found for "${svc.title}" -> "${otherTitle}". Skipped.`
        );
        continue;
      }

      await prisma.relatedService.create({
        data: {
          serviceId: current.id,
          relatedId: related.id,
          displayOrder: idx,
        },
      });
    }
  }

  console.log("✓ Services migration complete:", servicesData.length, "services processed");
}

// ==========================================
// 3. BLOG MIGRATION
// ==========================================

interface BlogSectionSeed {
  heading: string | null;
  content: string; // HTML
}

interface BlogSeed {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string; // parsed into publishedAt
  excerpt: string;
  cardDescription: string;
  imagePath: string; // storage path, e.g. "blog/diwali-celebration.jpg"
  sections: BlogSectionSeed[];
}

const blogSeeds: BlogSeed[] = [
  {
    slug: "diwali-celebration-2024",
    title: "Diwali Celebration 2024",
    category: "News and Events",
    author: "YF Advisors",
    date: "November 15, 2024",
    excerpt: blogPosts.find((p) => p.slug === "diwali-celebration-2024")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "diwali-celebration-2024")!.excerpt,
    imagePath: "blog/diwali-celebration.jpg",
    sections: [
      {
        heading: "Festive Vibes and Togetherness",
        content:
          "<p>Join us as we celebrate Diwali 2024 with vibrant decorations, festive lights, and the joy of togetherness. Our team embraced the spirit of the festival with traditional rituals, sweets, and heartfelt moments captured in beautiful images.</p>",
      },
      {
        heading: "Explore Our Diwali Celebration",
        content:
          "<p>Browse through the images from our Diwali event and feel the warmth and happiness that filled the air during this special occasion.</p>",
      },
      {
        heading: "Join Our Culture",
        content:
          '<p>We believe in celebrating success together. Want to join us?</p><p><a href="/#contact">Contact Us</a></p>',
      },
    ],
  },
  {
    slug: "accounting-bookkeeping-services-you-need-to-know",
    title: "Accounting & Bookkeeping Services You Need to Know",
    category: "Services",
    author: "YF Advisors",
    date: "August 30, 2024",
    excerpt: blogPosts.find((p) => p.slug === "accounting-bookkeeping-services-you-need-to-know")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "accounting-bookkeeping-services-you-need-to-know")!.excerpt,
    imagePath: "blog/bookeeping&account.jpg", // ⚠️ see note above re: page.tsx filename mismatch
    sections: [
      {
        heading: "Introduction",
        content:
          "<p>Whether you're a startup or a seasoned business owner, managing finances is a crucial aspect of running a successful business. At the heart of this management are accounting and bookkeeping services—two sides of the same coin that keep your financial house in order.</p>",
      },
      {
        heading: "The Backbone of Business Success",
        content:
          '<p>You\'ve probably heard the saying, "You can\'t manage what you don\'t measure." This is where accounting and bookkeeping come in. These services are the backbone of business success, providing the data you need to make informed decisions, stay compliant with tax laws, and plan for the future. Without accurate bookkeeping and insightful accounting, even the most promising businesses can run into trouble.</p>',
      },
      {
        heading: "Core Accounting Services",
        content: `<h3>Financial Statement Preparation</h3>
<p>One of the most critical accounting services is the preparation of financial statements. These documents, including the balance sheet, income statement, and cash flow statement, provide a snapshot of your business's financial health. They help you understand your profitability, liquidity, and cash flow, enabling you to make informed decisions about the future of your business. Without these statements, you're essentially flying blind.</p>
<h3>Tax Planning and Compliance</h3>
<p>Tax season can be stressful, but with proper accounting, it doesn't have to be. Accountants help businesses navigate the complexities of tax laws, ensuring you're compliant while minimizing your tax liability. This service involves more than just filing your taxes—it's about planning throughout the year to take advantage of tax deductions and credits, keeping your business in the best possible financial position.</p>
<h3>Auditing Services</h3>
<p>Audits aren't just for big corporations. Small businesses can also benefit from auditing services, which provide an objective examination of your financial statements. Audits can be conducted internally or externally and help identify areas where your business could be more efficient or where risks need to be mitigated. Whether it's for compliance, investor confidence, or simply ensuring your books are accurate, auditing is a valuable service.</p>`,
      },
      {
        heading: "Essential Bookkeeping Services",
        content: `<h3>Transaction Recording</h3>
<p>At the core of bookkeeping is transaction recording. Every sale, purchase, and payment your business makes needs to be recorded accurately. This might seem like a simple task, but it requires meticulous attention to detail. Accurate transaction recording ensures that your financial statements are correct and that you can track the flow of money through your business.</p>
<h3>Payroll Management</h3>
<p>Payroll is another vital aspect of bookkeeping. Ensuring your employees are paid accurately and on time is not just about keeping them happy—it's also about staying compliant with employment laws. Payroll management includes calculating wages, withholding taxes, and ensuring that all payroll records are accurate and up-to-date.</p>
<h3>Bank Reconciliation</h3>
<p>Bank reconciliation is a process that compares your business's financial records with your bank statements to ensure they match. This service is crucial for identifying discrepancies, such as missing transactions or errors, and correcting them. Regular bank reconciliation helps prevent fraud, catch errors early, and ensure your financial records are accurate.</p>`,
      },
      {
        heading: "Benefits of Professional Services",
        content: `<ul>
<li><strong>Accurate Financial Reporting:</strong> When professionals handle your books, you can trust that your financial data is correct, up-to-date, and ready for analysis.</li>
<li><strong>Time and Cost Efficiency:</strong> Professional bookkeeping and accounting services save you time and reduce the risk of errors, allowing you to focus on growing your business.</li>
</ul>`,
      },
      {
        heading: "Choosing the Right Services",
        content: `<h3>In-House vs. Outsourced Services</h3>
<p>In-house services give you more control and immediate access to your financial data, but they require a significant investment in time and resources. Outsourcing, on the other hand, can be more cost-effective, providing you with access to professional expertise without the overhead of hiring full-time staff. The choice depends on your business size, complexity, and specific needs.</p>
<h3>Evaluating Your Business Needs</h3>
<p>To choose the right accounting and bookkeeping services, start by evaluating your business's specific needs. Consider factors like the volume of transactions, the complexity of your financial operations, and your budget. Smaller businesses with straightforward finances might only need basic bookkeeping, while larger or more complex businesses may require a full suite of accounting services.</p>`,
      },
      {
        heading: "Conclusion: Building a Strong Financial Foundation",
        content:
          '<p>Accounting and bookkeeping services are more than just a necessary evil—they\'re the building blocks of a successful business. By ensuring your financial records are accurate and up-to-date, you can make informed decisions, stay compliant with regulations, and plan for the future with confidence.</p><p><a href="/#contact">Contact Us Today</a></p>',
      },
      {
        heading: "Frequently Asked Questions",
        content: `<h4>What is the average cost of bookkeeping services for a small business?</h4>
<p>The cost varies widely, but on average, small businesses can expect to pay between $300 and $2,500 per month depending on complexity and service level (in-house vs. outsourced).</p>`,
      },
    ],
  },
  {
    slug: "bookkeeping-services-for-small-business",
    title: "Bookkeeping Services for Small Business",
    category: "Services",
    author: "YF Advisors",
    date: "August 26, 2024",
    excerpt: blogPosts.find((p) => p.slug === "bookkeeping-services-for-small-business")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "bookkeeping-services-for-small-business")!.excerpt,
    imagePath: "blog/bk-services.jpg",
    sections: [
      {
        heading: "Introduction",
        content:
          "<p>Managing finances is a cornerstone of running a successful small business. While passion, determination, and a great product or service are essential, keeping your financial house in order is what ensures your business can thrive. Bookkeeping services, often underestimated, are one of the most critical aspects of business management.</p><p>It's the process of recording and organizing financial transactions, providing a clear picture of your business's financial health. In this article, we'll delve into the world of bookkeeping services for small business, exploring their importance, types, benefits, and best practices to help your business succeed.</p>",
      },
      {
        heading: "Importance of Accurate Bookkeeping",
        content: `<h3>Compliance with Legal Requirements</h3>
<p>Accurate bookkeeping isn't just a good practice; it's a legal requirement. Governments require businesses to maintain proper financial records to ensure compliance with tax laws and regulations. Inaccurate or incomplete records can lead to penalties, fines, or even legal action. Ensuring your books are up-to-date and accurate is essential to staying on the right side of the law.</p>
<h3>Financial Analysis and Decision Making</h3>
<p>Beyond compliance, bookkeeping provides crucial insights into your business's financial health. It allows you to analyze your income and expenses, identify trends, and make informed decisions. Whether it's deciding on a new investment, cutting costs, or planning for the future, bookkeeping gives you the data you need to steer your business in the right direction.</p>`,
      },
      {
        heading: "Types of Bookkeeping Services",
        content: `<ul>
<li><strong>In-House Bookkeeping:</strong> Handled by the owner or an employee. Offers control but can be time-consuming.</li>
<li><strong>Outsourced Bookkeeping:</strong> A popular choice for saving time and reducing errors. You gain access to expertise without the overhead of full-time staff.</li>
<li><strong>Online Bookkeeping:</strong> Accessible and often automated. Allows you to manage books from anywhere with user-friendly interfaces.</li>
</ul>`,
      },
      {
        heading: "Key Bookkeeping Tasks",
        content: `<p>The primary task of bookkeeping is recording every financial transaction your business makes. Key tasks include:</p>
<ul>
<li><strong>Recording Financial Transactions:</strong> Sales, expenses, payments, and receipts.</li>
<li><strong>Managing Accounts Receivable/Payable:</strong> Tracking money owed to you and money you owe to suppliers.</li>
<li><strong>Payroll Processing:</strong> Calculating wages, withholding taxes, and ensuring compliance.</li>
<li><strong>Bank Reconciliation:</strong> Comparing financial records with bank statements to ensure accuracy.</li>
<li><strong>Financial Reporting:</strong> Generating balance sheets, income statements, and cash flow statements.</li>
</ul>`,
      },
      {
        heading: "Benefits of Professional Services",
        content:
          "<p>One of the most significant benefits of hiring professional bookkeeping services is the time it saves. Managing your books can be time-consuming, especially as your business grows. Professional bookkeepers have the expertise and tools to handle your finances efficiently, reducing the risk of errors that could lead to costly mistakes.</p>",
      },
      {
        heading: "Implementing Bookkeeping Software",
        content:
          "<p>Popular software like QuickBooks, Xero, and FreshBooks cater to small businesses. Modern software often integrates with other business tools such as CRM systems and payment processors, streamlining operations and reducing manual data entry.</p>",
      },
      {
        heading: "Common Mistakes to Avoid",
        content: `<ul>
<li><strong>Mixing Personal and Business Expenses:</strong> Always keep separate bank accounts and credit cards for your business.</li>
<li><strong>Failing to Reconcile Bank Statements:</strong> Make it a habit to reconcile accounts at least monthly to catch errors early.</li>
</ul>`,
      },
      {
        heading: "The Future of Bookkeeping",
        content:
          "<p>The future of bookkeeping is being shaped by automation and cloud-based solutions. Advances in technology are making it possible to automate routine tasks, while cloud platforms offer real-time access to financial data, allowing bookkeepers to focus on strategic advisory services.</p>",
      },
      {
        heading: "Frequently Asked Questions",
        content: `<h4>What is the average cost of bookkeeping services?</h4>
<p>On average, small businesses can expect to pay between $300 and $2,500 per month depending on complexity and whether you choose in-house or outsourced services.</p>
<h4>How often should small businesses update their books?</h4>
<p>Ideally, books should be updated weekly to ensure an accurate view of cash flow, though daily updates are best for high-volume businesses.</p>
<h4>Can bookkeeping be done without software?</h4>
<p>Yes, but it is prone to errors and inefficient. Software automates calculations and reporting, saving significant time.</p>
<h4>What's the difference between bookkeeping and accounting?</h4>
<p>Bookkeeping focuses on recording daily transactions, while accounting involves analyzing, summarizing, and interpreting that data for financial decisions.</p>`,
      },
      {
        heading: "Get Organized Today",
        content:
          '<p>Don\'t let finances slow you down. Contact YF Advisors for professional bookkeeping tailored for small businesses.</p><p><a href="/#contact">Contact Us</a></p>',
      },
    ],
  },
  {
    slug: "brochure-call-to-action",
    title: "Brochure: Call to Action",
    category: "Brochure",
    author: "YF Advisors",
    date: "August 11, 2024",
    excerpt: blogPosts.find((p) => p.slug === "brochure-call-to-action")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "brochure-call-to-action")!.excerpt,
    imagePath: "blog/brochure.png",
    sections: [
      {
        heading: "Yours Faithfully Advisors — Your Trusted Outsourcing Partners",
        content:
          "<p>In today's fast-paced business environment, efficiency is key. Our comprehensive brochure outlines how YF Advisors can streamline your operations, reduce overhead costs, and allow you to focus on what matters most—growing your core business.</p>",
      },
      {
        heading: "Why Choose YF Advisors?",
        content: `<ul>
<li><strong>Accounting & Bookkeeping:</strong> Precise financial tracking to keep you compliant and informed.</li>
<li><strong>Payroll Management:</strong> Timely and accurate payroll processing for your entire team.</li>
<li><strong>Tax Planning:</strong> Strategic tax compliance to maximize your savings.</li>
<li><strong>Financial Consulting:</strong> Expert advice to guide your business expansion.</li>
</ul>`,
      },
      {
        heading: "Ready to Get Started?",
        content:
          '<p><strong>Email:</strong> <a href="mailto:info@yfadvisors.in">info@yfadvisors.in</a></p><p><strong>Phone:</strong> +91 22 46054371</p><p><strong>Visit Us:</strong> Millennium Business Park, Mahape, Mumbai</p>',
      },
    ],
  },
  {
    slug: "happy-new-year-2022",
    title: "Wish You a Happy New Year 2022",
    category: "News and Events",
    author: "YF Advisors",
    date: "October 7, 2022",
    excerpt: blogPosts.find((p) => p.slug === "happy-new-year-2022")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "happy-new-year-2022")!.excerpt,
    imagePath: "blog/new-year-2022.jpg",
    sections: [
      {
        heading: "Season's Greetings from YF Advisors",
        content:
          '<p>As we embark on another year, we take this moment to extend our heartfelt gratitude for your continued trust and partnership.</p><p><strong>We wish you and your family a Happy New Year 2022. May this year bring prosperity, health, and new opportunities.</strong></p><p>At Yours Faithfully Advisors LLP, we are committed to supporting your growth through our dedicated Consulting & Outsourcing services. We look forward to achieving new milestones together in the coming year.</p><p>Warm Regards,<br/>The Team at Yours Faithfully Advisors<br/><a href="/">www.yfadvisors.in</a></p>',
      },
      {
        heading: "Start the Year Strong",
        content:
          '<p>Let\'s discuss how we can optimize your business operations this year.</p><p><a href="/#contact">Contact Us</a></p>',
      },
    ],
  },
  {
    slug: "outsourcing-financial-accounting-and-payroll",
    title: "Outsourcing of Financial Accounting and Payroll",
    category: "Services",
    author: "YF Advisors",
    date: "October 6, 2022",
    excerpt: blogPosts.find((p) => p.slug === "outsourcing-financial-accounting-and-payroll")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "outsourcing-financial-accounting-and-payroll")!.excerpt,
    imagePath: "blog/Outsourcing-of-financial-accounting-payroll.jpg",
    sections: [
      {
        heading: "Introduction",
        content:
          "<p>Streamline your financial processes with expert outsourcing solutions. Outsourcing accounting allows you to focus on your core business goals while ensuring your financial data is accurate, compliant, and always up-to-date.</p>",
      },
      {
        heading: "The Strategic Value of Outsourcing",
        content:
          "<p>In today's competitive landscape, businesses are constantly seeking ways to improve efficiency and reduce operational costs. Managing financial accounting and payroll in-house can be resource-intensive, requiring specialized software, continuous training, and dedicated staff. Outsourcing these critical functions transforms them from a burden into a strategic advantage.</p>",
      },
      {
        heading: "Financial Accounting Services",
        content: `<p>Outsourcing your financial accounting ensures that your books are maintained according to the latest accounting standards without the overhead of an in-house team. Key services often include:</p>
<ul>
<li><strong>General Ledger Maintenance:</strong> Keeping your financial records organized and accurate.</li>
<li><strong>Accounts Payable & Receivable:</strong> Managing cash flow efficiently to maintain healthy vendor and client relationships.</li>
<li><strong>Bank Reconciliation:</strong> Ensuring all transactions match your bank statements to prevent errors and fraud.</li>
<li><strong>Financial Reporting:</strong> Generating timely balance sheets and income statements for better decision-making.</li>
</ul>`,
      },
      {
        heading: "Simplifying Payroll Management",
        content: `<p>Payroll is one of the most complex administrative tasks for any business. It involves more than just writing checks; it requires adherence to strict tax laws and employment regulations. Outsourcing payroll offers:</p>
<ul>
<li><strong>Accuracy and Compliance:</strong> Calculating the correct tax deductions and filings to avoid penalties.</li>
<li><strong>Timely Payments:</strong> Ensuring employees are paid on time, every time, boosting morale.</li>
<li><strong>Data Security:</strong> Protecting sensitive employee information with advanced security measures used by professional firms.</li>
</ul>`,
      },
      {
        heading: "Why Choose YF Advisors?",
        content:
          "<p>At YF Advisors, we combine technology with expertise to deliver seamless accounting and payroll services. We act as an extension of your team, providing the financial clarity you need to grow your business with confidence.</p>",
      },
      {
        heading: "Ready to Streamline Your Finances?",
        content:
          '<p>Let us handle the numbers so you can handle the growth.</p><p><a href="/#contact">Get a Quote</a></p>',
      },
    ],
  },
  {
    slug: "optimism-and-self-belief",
    title: "Optimism and Self Belief",
    category: "News and Events",
    author: "YF Advisors",
    date: "October 6, 2022",
    excerpt: blogPosts.find((p) => p.slug === "optimism-and-self-belief")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "optimism-and-self-belief")!.excerpt,
    imagePath: "blog/optimism.jpg",
    sections: [
      {
        heading: "Navigating Uncertainty",
        content:
          "<p>We are living in a world of Knightian uncertainty in the absence of determinate knowledge about the next mutation of COVID-19.</p><p>The ability to forecast the future course of the economy is so contingent on the evolution of the virus that one prognosis is as good or as bad as the other and as ephemeral.</p><blockquote>If the last two years of living with the virus have taught us anything, it is to remain humble, but grounded in self-belief, never losing confidence and optimism.</blockquote><p>At YF Advisors, we believe that maintaining this optimism is essential for business resilience. Adapting to change with confidence allows organizations to overcome unpredictable challenges and emerge stronger.</p>",
      },
      {
        heading: "Build Resilience with Us",
        content:
          '<p>Partner with YF Advisors to navigate economic uncertainty with confidence.</p><p><a href="/#contact">Contact Us</a></p>',
      },
    ],
  },
  {
    slug: "benefits-of-outsourcing",
    title: "Benefits of Outsourcing to Organization",
    category: "Services",
    author: "YF Advisors",
    date: "October 6, 2022",
    excerpt: blogPosts.find((p) => p.slug === "benefits-of-outsourcing")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "benefits-of-outsourcing")!.excerpt,
    imagePath: "blog/benefits-of-outsourcing.jpg",
    sections: [
      {
        heading: "Introduction",
        content:
          "<p>The outsourcing and shared services market is expected to cross the $1 trillion threshold within six years. This projection highlights a massive shift in global business strategies, moving beyond simple cost-saving measures to comprehensive value creation.</p>",
      },
      {
        heading: "Drivers of Rapid Market Growth",
        content: `<p>The reasons for this rapid market growth are two-fold but closely aligned:</p>
<ul>
<li><strong>Digital Disruption:</strong> Recent innovations have given rise to new exponential technologies. These are leading to digital disruption and transformation not only of organizations but also of entire industries and even nations.</li>
<li><strong>Technological Advancements:</strong> Technologies such as Cloud Computing, Artificial Intelligence (AI), and Robotic Process Automation (RPA) are being actively adopted within the Outsourcing and Shared Services (OSS) industry itself.</li>
</ul>`,
      },
      {
        heading: "Key Benefits Breakdown",
        content:
          '<p>Why are organizations rushing to outsource? The data paints a clear picture. As shown in the chart below, the primary driver is the ability to focus on core business functions, followed closely by cost reduction.</p><figure><img src="__IMAGE_URL__" alt="Chart showing benefits of outsourcing: 70% focus on core functions, 65% cost cutting" /><figcaption>Figure 1: Survey results on the primary benefits of outsourcing to organizations.</figcaption></figure>',
      },
      {
        heading: "From Cost-Efficiency to Value-Creation",
        content:
          "<p>By adopting new technologies, the industry is evolving from a pure cost-efficiency model to new innovative value-creation models.</p><p>This tech-enabled transformation presents significant opportunities for the industry's potential impact and growth. Organizations can now leverage outsourcing not just to save money, but to access intellectual capital, solve capability issues, and enhance overall service quality.</p>",
      },
      {
        heading: "Optimize Your Operations",
        content:
          '<p>Leverage our expertise to focus on your core business functions today.</p><p><a href="/contact">Contact Us</a></p>',
      },
    ],
  },
  {
    slug: "shared-services",
    title: "Shared Services",
    category: "Services",
    author: "YF Advisors",
    date: "October 6, 2022",
    excerpt: blogPosts.find((p) => p.slug === "shared-services")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "shared-services")!.excerpt,
    imagePath: "blog/shared-services.jpg",
    sections: [
      {
        heading: "Introduction",
        content:
          "<p>The success of a business in the modern era depends heavily on providing value beyond cost.</p>",
      },
      {
        heading: "Building a Lean Culture",
        content:
          "<p>Making customer interactions seamless and simple is key to retaining repeat customers and building a lean culture. In today's competitive landscape, efficiency isn't just about cutting costs—it's about optimizing every touchpoint to deliver superior value.</p>",
      },
      {
        heading: "Transparency and Synchronization",
        content:
          "<p>When your internal business culture is synchronized, it becomes easier to be more transparent with your clients in terms of KPIs (Key Performance Indicators) and cost structure.</p><p>Shared services allow disparate business units to operate under a unified framework, ensuring that data, processes, and goals are aligned. This alignment fosters trust and clarity, which are essential for long-term client relationships.</p>",
      },
      {
        heading: "Optimize Your Operations",
        content:
          '<p>Discover how our Shared Services model can drive value for your organization.</p><p><a href="/#contact">Contact Us</a></p>',
      },
    ],
  },
  {
    slug: "rethink-your-back-office",
    title: "Rethink Your Back Office",
    category: "Services",
    author: "YF Advisors",
    date: "October 6, 2022",
    excerpt: blogPosts.find((p) => p.slug === "rethink-your-back-office")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "rethink-your-back-office")!.excerpt,
    imagePath: "blog/rethink-your-office.jpg",
    sections: [
      {
        heading: "Introduction",
        content:
          "<p>Globalization, emerging technologies, and overall market volatility require you to have a more adaptable, flexible, and cost-effective business model.</p>",
      },
      {
        heading: "The Need for New Approaches",
        content:
          "<p>You do not have the luxury of an inefficient back office. New approaches are needed to remain successful and maintain a sustainable competitive advantage in today's rapidly evolving landscape.</p>",
      },
      {
        heading: "Benefits of Business Process Outsourcing (BPO)",
        content: `<p>Adopting BPO strategies offers several transformative benefits for your organization:</p>
<ul>
<li><strong>Lower Costs:</strong> Reduce operational overheads significantly.</li>
<li><strong>Global Expansion:</strong> Scale your operations across borders with ease.</li>
<li><strong>Enhanced Efficiency & Productivity:</strong> Streamline workflows to get more done in less time.</li>
<li><strong>Higher Operational Visibility:</strong> Gain deeper insights into your business performance.</li>
</ul>`,
      },
      {
        heading: "Connect With Us",
        content:
          "<p>Reach out to Yours Faithfully Advisors LLP to explore more on how Shared Services can transform your business.</p>",
      },
    ],
  },
  {
    slug: "food-and-team-bonding",
    title: "Food and Team Bonding",
    category: "Services",
    author: "YF Advisors",
    date: "October 6, 2022",
    excerpt: blogPosts.find((p) => p.slug === "food-and-team-bonding")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "food-and-team-bonding")!.excerpt,
    imagePath: "blog/food-and-team-bonding.jpg",
    sections: [
      {
        heading: "Food and team bonding – you can't go wrong!",
        content:
          "<p>As an employer, it must be your plan to get people together for a company lunch at least once a month. A meal together is an excellent way for team members to share conversation, ideas, and laughter.</p><p>While there are varied ways to build team bonding, nothing is more effective or cost-efficient than team-building lunches. It creates a relaxed environment where hierarchies dissolve, and genuine connections are formed.</p><p>Subsequently, a warm, free lunch for them will turn out to be an extraordinary experience for you. Until you take your employees out to a team lunch, you miss out on how awesome they actually are outside of their daily tasks.</p><p>Also, it's not a secret that <strong>appreciated employees are happy employees</strong>. Investing in these small moments of connection yields significant returns in morale and retention.</p>",
      },
    ],
  },
  {
    slug: "invoice-validation-ap-process-p2p",
    title: "Invoice Validation AP Process (P2P)",
    category: "Services",
    author: "YF Advisors",
    date: "October 6, 2022",
    excerpt: blogPosts.find((p) => p.slug === "invoice-validation-ap-process-p2p")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "invoice-validation-ap-process-p2p")!.excerpt,
    imagePath: "blog/invoice-validation.jpg",
    sections: [
      {
        heading: "Challenges in Traditional Invoice Processing",
        content:
          "<p><strong>1) Do you find Vendor Management and Cost tracking a Hassel?</strong></p><p><strong>2) Do you think the traditional way of handling vendors and doing 3-way invoice checking can achieve 100% accuracy?</strong></p><p>The answer is <strong>No</strong>, and it needs robust technology to bridge the workflow gaps.</p>",
      },
      {
        heading: "Bridging the Gap with Technology",
        content: `<p>Happy to announce that we at <strong>YOURS FAITHFULLY ADVISORS LLP</strong> have partnered with 100% cloud-based Technology and successfully achieved operating efficiency by <strong>30%</strong>.</p>
<p>This technological integration helps finance and operations teams to:</p>
<ul>
<li>Track costs on a real-time basis.</li>
<li>Conclude Provisions at the highest accuracy levels.</li>
<li>Streamline the entire Procure-to-Pay (P2P) lifecycle.</li>
</ul>`,
      },
    ],
  },
  {
    slug: "spark-of-hope",
    title: "Spark of Hope",
    category: "Services",
    author: "YF Advisors",
    date: "September 6, 2022",
    excerpt: blogPosts.find((p) => p.slug === "spark-of-hope")!.excerpt,
    cardDescription: blogPosts.find((p) => p.slug === "spark-of-hope")!.excerpt,
    imagePath: "blog/spark.jpg", // ⚠️ page.tsx references "/blog/shark.jpg" — likely a typo; storage only has spark.jpg
    sections: [
      {
        heading: "Introduction",
        content:
          "<p>A way to live and work that aligned with the new normal. We foresee a more balanced and welcoming year ahead.</p>",
      },
      {
        heading: "What will emanate in the future?",
        content: `<p>As we look forward, several key trends and shifts are emerging that will define the next phase of business and life:</p>
<ul>
<li><strong>Entrepreneurial Spirit:</strong> A young breed jam-packed with innovative ideas will lead to multiple new entrepreneurs entering the market.</li>
<li><strong>Economic Revival:</strong> The overall economy will revive, creating ample Job Opportunities and facilitating cash flow rotation.</li>
<li><strong>Evolving Hiring Patterns:</strong> Recruitment strategies can change from seeking a "perfect fit" to accepting "near fits" and upskilling them.</li>
<li><strong>GBS Revolution:</strong> A new era of revolution through "Global Business Services (GBS), Outsourcing, and Shared Services solutions" focused on back-office optimization.</li>
<li><strong>Education Re-evaluation:</strong> Traditional methods are impending towards a web-based digital training ecosystem.</li>
<li><strong>Hybrid Work Models:</strong> The hybrid model of working will become more acceptable by companies, employees, educational institutes, and students alike.</li>
<li><strong>Health & Fitness:</strong> A paradigm shift from just being a workaholic to prioritizing health and fitness—a major learning from the pandemic which appears to continue in 2022 and onwards.</li>
</ul>`,
      },
      {
        heading: "Looking Forward",
        content:
          "<p>What do you think will emanate in the coming years? The future belongs to those who adapt.</p>",
      },
    ],
  },
];

async function migrateBlog() {
  for (const seed of blogSeeds) {
    const imageUrl = getSupabasePublicUrl(seed.imagePath);
    const publishedAt = new Date(seed.date);

    await prisma.$transaction(async (tx) => {
      const blog = await tx.blog.upsert({
        where: { slug: seed.slug },
        update: {
          title: seed.title,
          cardDescription: seed.cardDescription,
          excerpt: seed.excerpt,
          image: imageUrl,
          category: seed.category,
          tags: null,
          author: seed.author,
          status: "PUBLISHED",
          publishedAt,
        },
        create: {
          title: seed.title,
          slug: seed.slug,
          cardDescription: seed.cardDescription,
          excerpt: seed.excerpt,
          image: imageUrl,
          category: seed.category,
          tags: null,
          author: seed.author,
          status: "PUBLISHED",
          publishedAt,
        },
      });

      // Clear existing sections to keep this idempotent
      await tx.blogSection.deleteMany({ where: { blogId: blog.id } });

      // Resolve the chart image placeholder for benefits-of-outsourcing
      const chartImageUrl =
        seed.slug === "benefits-of-outsourcing"
          ? getSupabasePublicUrl("blog/benefits-of-outsourcing.jpg")
          : null;

      await tx.blogSection.createMany({
        data: seed.sections.map((section, idx) => ({
          blogId: blog.id,
          heading: section.heading,
          content: chartImageUrl
            ? section.content.replace("__IMAGE_URL__", chartImageUrl)
            : section.content,
          displayOrder: idx,
        })),
      });
    });

    console.log("Blog migrated:", seed.slug, "-", seed.sections.length, "sections");
  }

  console.log("Blog migration complete:", blogSeeds.length, "posts processed");
}

async function main() {
  console.log("--- Starting Full Content Migration ---");
  await migrateTeam();
  await migrateServices();
  await migrateBlog();
  console.log("--- Migration Completed Successfully ---");
}

main()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });