"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

export default function BookkeepingPage() {
  return (
    <ArticleWrapper>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <Image 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop" 
          alt="Bookkeeping Services" 
          fill 
          priority 
          className="hero-img" 
        />
        <div className="hero-content">
          <span className="category-badge">Services</span>
          <h1 className="article-title">Bookkeeping Services for Small Business</h1>
          <div className="meta-data">August 26, 2024 • By YF Advisors</div>
        </div>
      </div>

      <div className="container">
        <div className="nav-bar">
          <Link href="/blog" className="back-link">&larr; Back to Insights</Link>
        </div>

        <div className="content-grid">
          {/* Main Content */}
          <div className="article-body">
            <p className="intro-text">
              Managing finances is a cornerstone of running a successful small business. While passion, determination, and a great product or service are essential, keeping your financial house in order is what ensures your business can thrive. Bookkeeping services, often underestimated, are one of the most critical aspects of business management.
            </p>
            <p>
              It’s the process of recording and organizing financial transactions, providing a clear picture of your business’s financial health. In this article, we’ll delve into the world of bookkeeping services for small business, exploring their importance, types, benefits, and best practices to help your business succeed.
            </p>

            <h2 className="section-heading">Importance of Accurate Bookkeeping</h2>
            
            <h3 className="sub-heading">Compliance with Legal Requirements</h3>
            <p>
              Accurate bookkeeping isn’t just a good practice; it’s a legal requirement. Governments require businesses to maintain proper financial records to ensure compliance with tax laws and regulations. Inaccurate or incomplete records can lead to penalties, fines, or even legal action. Ensuring your books are up-to-date and accurate is essential to staying on the right side of the law.
            </p>

            <h3 className="sub-heading">Financial Analysis and Decision Making</h3>
            <p>
              Beyond compliance, bookkeeping provides crucial insights into your business’s financial health. It allows you to analyze your income and expenses, identify trends, and make informed decisions. Whether it’s deciding on a new investment, cutting costs, or planning for the future, bookkeeping gives you the data you need to steer your business in the right direction.
            </p>

            <h2 className="section-heading">Types of Bookkeeping Services</h2>
            <ul>
              <li><strong>In-House Bookkeeping:</strong> Handled by the owner or an employee. Offers control but can be time-consuming.</li>
              <li><strong>Outsourced Bookkeeping:</strong> A popular choice for saving time and reducing errors. You gain access to expertise without the overhead of full-time staff.</li>
              <li><strong>Online Bookkeeping:</strong> Accessible and often automated. Allows you to manage books from anywhere with user-friendly interfaces.</li>
            </ul>

            <h2 className="section-heading">Key Bookkeeping Tasks</h2>
            <p>The primary task of bookkeeping is recording every financial transaction your business makes. Key tasks include:</p>
            <ul>
              <li><strong>Recording Financial Transactions:</strong> Sales, expenses, payments, and receipts.</li>
              <li><strong>Managing Accounts Receivable/Payable:</strong> Tracking money owed to you and money you owe to suppliers.</li>
              <li><strong>Payroll Processing:</strong> Calculating wages, withholding taxes, and ensuring compliance.</li>
              <li><strong>Bank Reconciliation:</strong> Comparing financial records with bank statements to ensure accuracy.</li>
              <li><strong>Financial Reporting:</strong> Generating balance sheets, income statements, and cash flow statements.</li>
            </ul>

            <h2 className="section-heading">Benefits of Professional Services</h2>
            <p>
              One of the most significant benefits of hiring professional bookkeeping services is the time it saves. Managing your books can be time-consuming, especially as your business grows. Professional bookkeepers have the expertise and tools to handle your finances efficiently, reducing the risk of errors that could lead to costly mistakes.
            </p>

            <h2 className="section-heading">Implementing Bookkeeping Software</h2>
            <p>
              Popular software like QuickBooks, Xero, and FreshBooks cater to small businesses. Modern software often integrates with other business tools such as CRM systems and payment processors, streamlining operations and reducing manual data entry.
            </p>

            <h2 className="section-heading">Common Mistakes to Avoid</h2>
            <ul>
              <li><strong>Mixing Personal and Business Expenses:</strong> Always keep separate bank accounts and credit cards for your business.</li>
              <li><strong>Failing to Reconcile Bank Statements:</strong> Make it a habit to reconcile accounts at least monthly to catch errors early.</li>
            </ul>

            <h2 className="section-heading">The Future of Bookkeeping</h2>
            <p>
              The future of bookkeeping is being shaped by automation and cloud-based solutions. Advances in technology are making it possible to automate routine tasks, while cloud platforms offer real-time access to financial data, allowing bookkeepers to focus on strategic advisory services.
            </p>

            <h2 className="section-heading">Frequently Asked Questions</h2>
            
            <div className="faq-item">
              <h4>What is the average cost of bookkeeping services?</h4>
              <p>On average, small businesses can expect to pay between $300 and $2,500 per month depending on complexity and whether you choose in-house or outsourced services.</p>
            </div>
            
            <div className="faq-item">
              <h4>How often should small businesses update their books?</h4>
              <p>Ideally, books should be updated weekly to ensure an accurate view of cash flow, though daily updates are best for high-volume businesses.</p>
            </div>

            <div className="faq-item">
              <h4>Can bookkeeping be done without software?</h4>
              <p>Yes, but it is prone to errors and inefficient. Software automates calculations and reporting, saving significant time.</p>
            </div>

            <div className="faq-item">
              <h4>What’s the difference between bookkeeping and accounting?</h4>
              <p>Bookkeeping focuses on recording daily transactions, while accounting involves analyzing, summarizing, and interpreting that data for financial decisions.</p>
            </div>

            {/* CTA Box */}
            <div className="cta-box">
              <h3>Get Organized Today</h3>
              <p>Don&apos;t let finances slow you down. Contact YF Advisors for professional bookkeeping tailored for small businesses.</p>
              <Link href="/#contact"><button>Contact Us</button></Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-widget">
              <h4>Read Next</h4>
              <ul>
                <li><Link href="/blog/accounting-bookkeeping-services-you-need-to-know">Accounting Services</Link></li>
                <li><Link href="/blog/diwali-celebration-2024">Diwali Celebration 2024</Link></li>
              </ul>
            </div>
            <div className="sidebar-widget">
              <h4>Categories</h4>
              <div className="categories-list">
                <span>Services</span>
                <span>News and Events</span>
                <span>Brochure</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </ArticleWrapper>
  );
}

// --- Styles ---
const ArticleWrapper = styled.article`
  background-color: #f8fafc; min-height: 100vh; padding-bottom: 80px; font-family: 'Inter', sans-serif;
  .hero-section { position: relative; height: 50vh; min-height: 400px; display: flex; align-items: center; justify-content: center; text-align: center; color: white; }
  .hero-img { object-fit: cover; z-index: 1; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,43,73,0.6), rgba(0,43,73,0.9)); z-index: 2; }
  .hero-content { position: relative; z-index: 3; max-width: 900px; padding: 0 20px; }
  .category-badge { background: #00A79D; color: white; padding: 6px 16px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 24px; display: inline-block; }
  .article-title { font-size: 2.75rem; font-weight: 800; line-height: 1.2; margin-bottom: 24px; }
  .meta-data { font-size: 1rem; opacity: 0.9; font-weight: 500; }
  .container { max-width: 1200px; margin: -60px auto 0; position: relative; z-index: 5; padding: 0 20px; }
  .nav-bar { margin-bottom: 30px; }
  .back-link { color: white; text-decoration: none; font-weight: 600; background: rgba(0,43,73,0.6); padding: 8px 16px; border-radius: 20px; backdrop-filter: blur(4px); transition: all 0.3s; &:hover { background: #00A79D; } }
  .content-grid { display: grid; grid-template-columns: 1fr 320px; gap: 60px; @media (max-width: 968px) { grid-template-columns: 1fr; } }
  .article-body { background: white; padding: 60px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); color: #334155; line-height: 1.8; font-size: 1.1rem; }
  .section-heading { color: #002B49; font-size: 1.8rem; margin: 40px 0 20px; font-weight: 800; }
  .sub-heading { color: #00A79D; font-size: 1.4rem; margin: 30px 0 15px; font-weight: 700; }
  p { margin-bottom: 24px; }
  ul { margin-bottom: 30px; padding-left: 20px; }
  li { margin-bottom: 10px; }
  .intro-text { font-size: 1.25rem; color: #475569; border-left: 4px solid #00A79D; padding-left: 24px; font-style: italic; }
  .faq-item { margin-bottom: 30px; }
  .faq-item h4 { color: #002B49; margin-bottom: 8px; font-size: 1.15rem; font-weight: 700; }
  .cta-box { background: linear-gradient(135deg, #e0f2f1 0%, #ffffff 100%); padding: 40px; border-radius: 12px; text-align: center; margin-top: 60px; border: 1px solid rgba(0,167,157,0.3); }
  .cta-box h3 { margin-top: 0; color: #002B49; font-size: 1.5rem; }
  .cta-box button { background: #002B49; color: white; border: none; padding: 14px 32px; font-size: 1rem; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 20px; transition: all 0.3s; &:hover { background: #00A79D; } }
  .sidebar-widget { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; margin-bottom: 30px; }
  .sidebar-widget h4 { color: #002B49; margin-bottom: 24px; text-transform: uppercase; border-bottom: 2px solid #00A79D; padding-bottom: 12px; display: inline-block; }
  .sidebar-widget ul { list-style: none; padding: 0; }
  .sidebar-widget li { padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
  .sidebar-widget a { color: #64748b; text-decoration: none; transition: color 0.3s; &:hover { color: #00A79D; } }
  .categories-list span { display: block; padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9; }
`;