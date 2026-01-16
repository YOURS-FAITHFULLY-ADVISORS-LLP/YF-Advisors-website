"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

export default function AccountingPage() {
  return (
    <ArticleWrapper>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <Image 
          src="/blog/bookkeeping&services.jpg" 
          alt="Accounting & Bookkeeping Services" 
          fill 
          priority 
          className="hero-img" 
        />
        <div className="hero-content">
          <span className="category-badge">Services</span>
          <h1 className="article-title">Accounting & Bookkeeping Services You Need to Know</h1>
          <div className="meta-data">August 30, 2024 • By YF Advisors</div>
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
              Whether you’re a startup or a seasoned business owner, managing finances is a crucial aspect of running a successful business. At the heart of this management are accounting and bookkeeping services—two sides of the same coin that keep your financial house in order.
            </p>

            <h2 className="section-heading">The Backbone of Business Success</h2>
            <p>
              You’ve probably heard the saying, “You can’t manage what you don’t measure.” This is where accounting and bookkeeping come in. These services are the backbone of business success, providing the data you need to make informed decisions, stay compliant with tax laws, and plan for the future. Without accurate bookkeeping and insightful accounting, even the most promising businesses can run into trouble.
            </p>

            <h2 className="section-heading">Core Accounting Services</h2>
            
            <h3 className="sub-heading">Financial Statement Preparation</h3>
            <p>
              One of the most critical accounting services is the preparation of financial statements. These documents, including the balance sheet, income statement, and cash flow statement, provide a snapshot of your business’s financial health. They help you understand your profitability, liquidity, and cash flow, enabling you to make informed decisions about the future of your business. Without these statements, you’re essentially flying blind.
            </p>

            <h3 className="sub-heading">Tax Planning and Compliance</h3>
            <p>
              Tax season can be stressful, but with proper accounting, it doesn’t have to be. Accountants help businesses navigate the complexities of tax laws, ensuring you’re compliant while minimizing your tax liability. This service involves more than just filing your taxes—it’s about planning throughout the year to take advantage of tax deductions and credits, keeping your business in the best possible financial position.
            </p>

            <h3 className="sub-heading">Auditing Services</h3>
            <p>
              Audits aren’t just for big corporations. Small businesses can also benefit from auditing services, which provide an objective examination of your financial statements. Audits can be conducted internally or externally and help identify areas where your business could be more efficient or where risks need to be mitigated. Whether it’s for compliance, investor confidence, or simply ensuring your books are accurate, auditing is a valuable service.
            </p>

            <h2 className="section-heading">Essential Bookkeeping Services</h2>

            <h3 className="sub-heading">Transaction Recording</h3>
            <p>
              At the core of bookkeeping is transaction recording. Every sale, purchase, and payment your business makes needs to be recorded accurately. This might seem like a simple task, but it requires meticulous attention to detail. Accurate transaction recording ensures that your financial statements are correct and that you can track the flow of money through your business.
            </p>

            <h3 className="sub-heading">Payroll Management</h3>
            <p>
              Payroll is another vital aspect of bookkeeping. Ensuring your employees are paid accurately and on time is not just about keeping them happy—it’s also about staying compliant with employment laws. Payroll management includes calculating wages, withholding taxes, and ensuring that all payroll records are accurate and up-to-date.
            </p>

            <h3 className="sub-heading">Bank Reconciliation</h3>
            <p>
              Bank reconciliation is a process that compares your business’s financial records with your bank statements to ensure they match. This service is crucial for identifying discrepancies, such as missing transactions or errors, and correcting them. Regular bank reconciliation helps prevent fraud, catch errors early, and ensure your financial records are accurate.
            </p>

            <h2 className="section-heading">Benefits of Professional Services</h2>
            <ul>
              <li><strong>Accurate Financial Reporting:</strong> When professionals handle your books, you can trust that your financial data is correct, up-to-date, and ready for analysis.</li>
              <li><strong>Time and Cost Efficiency:</strong> Professional bookkeeping and accounting services save you time and reduce the risk of errors, allowing you to focus on growing your business.</li>
            </ul>

            <h2 className="section-heading">Choosing the Right Services</h2>
            <h3 className="sub-heading">In-House vs. Outsourced Services</h3>
            <p>
              In-house services give you more control and immediate access to your financial data, but they require a significant investment in time and resources. Outsourcing, on the other hand, can be more cost-effective, providing you with access to professional expertise without the overhead of hiring full-time staff. The choice depends on your business size, complexity, and specific needs.
            </p>

            <h3 className="sub-heading">Evaluating Your Business Needs</h3>
            <p>
              To choose the right accounting and bookkeeping services, start by evaluating your business’s specific needs. Consider factors like the volume of transactions, the complexity of your financial operations, and your budget. Smaller businesses with straightforward finances might only need basic bookkeeping, while larger or more complex businesses may require a full suite of accounting services.
            </p>

            <div className="cta-box">
              <h3>Conclusion: Building a Strong Financial Foundation</h3>
              <p>
                Accounting and bookkeeping services are more than just a necessary evil—they’re the building blocks of a successful business. By ensuring your financial records are accurate and up-to-date, you can make informed decisions, stay compliant with regulations, and plan for the future with confidence.
              </p>
              <Link href="/#contact"><button>Contact Us Today</button></Link>
            </div>

            <h2 className="section-heading">Frequently Asked Questions</h2>
            <div className="faq-item">
              <h4>What is the average cost of bookkeeping services for a small business?</h4>
              <p>The cost varies widely, but on average, small businesses can expect to pay between $300 and $2,500 per month depending on complexity and service level (in-house vs. outsourced).</p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-widget">
              <h4>Read Next</h4>
              <ul>
                <li><Link href="/blog/diwali-celebration-2024">Diwali Celebration 2024</Link></li>
                <li><Link href="/blog/bookkeeping-services-for-small-business">Small Business Bookkeeping</Link></li>
              </ul>
            </div>
            <div className="sidebar-widget">
              <h4>Categories</h4>
              <div className="categories-list">
                <span>Service</span>
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
  .faq-item { margin-bottom: 20px; }
  .faq-item h4 { color: #002B49; margin-bottom: 8px; font-size: 1.1rem; }
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