"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

export default function OutsourcingPage() {
  return (
    <ArticleWrapper>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <Image 
          src="/blog/Outsourcing-of-financial-accounting-payroll.jpg" 
          alt="Outsourcing of Financial Accounting and Payroll" 
          fill 
          priority 
          className="hero-img" 
        />
        <div className="hero-content">
          <span className="category-badge">Services</span>
          <h1 className="article-title">Outsourcing of Financial Accounting and Payroll</h1>
          <div className="meta-data">October 6, 2022 • By YF Advisors</div>
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
              Streamline your financial processes with expert outsourcing solutions. Outsourcing accounting allows you to focus on your core business goals while ensuring your financial data is accurate, compliant, and always up-to-date.
            </p>

            <h2 className="section-heading">The Strategic Value of Outsourcing</h2>
            <p>
              In today&apos;s competitive landscape, businesses are constantly seeking ways to improve efficiency and reduce operational costs. Managing financial accounting and payroll in-house can be resource-intensive, requiring specialized software, continuous training, and dedicated staff. Outsourcing these critical functions transforms them from a burden into a strategic advantage.
            </p>

            <h2 className="section-heading">Financial Accounting Services</h2>
            <p>
              Outsourcing your financial accounting ensures that your books are maintained according to the latest accounting standards without the overhead of an in-house team. Key services often include:
            </p>
            <ul>
              <li><strong>General Ledger Maintenance:</strong> Keeping your financial records organized and accurate.</li>
              <li><strong>Accounts Payable & Receivable:</strong> Managing cash flow efficiently to maintain healthy vendor and client relationships.</li>
              <li><strong>Bank Reconciliation:</strong> ensuring all transactions match your bank statements to prevent errors and fraud.</li>
              <li><strong>Financial Reporting:</strong> Generating timely balance sheets and income statements for better decision-making.</li>
            </ul>

            <h2 className="section-heading">Simplifying Payroll Management</h2>
            <p>
              Payroll is one of the most complex administrative tasks for any business. It involves more than just writing checks; it requires adherence to strict tax laws and employment regulations. Outsourcing payroll offers:
            </p>
            <ul>
              <li><strong>Accuracy and Compliance:</strong> calculating the correct tax deductions and filings to avoid penalties.</li>
              <li><strong>Timely Payments:</strong> Ensuring employees are paid on time, every time, boosting morale.</li>
              <li><strong>Data Security:</strong> Protecting sensitive employee information with advanced security measures used by professional firms.</li>
            </ul>

            <h2 className="section-heading">Why Choose YF Advisors?</h2>
            <p>
              At YF Advisors, we combine technology with expertise to deliver seamless accounting and payroll services. We act as an extension of your team, providing the financial clarity you need to grow your business with confidence.
            </p>

            <div className="cta-box">
              <h3>Ready to Streamline Your Finances?</h3>
              <p>Let us handle the numbers so you can handle the growth.</p>
              <Link href="/#contact"><button>Get a Quote</button></Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-widget">
              <h4>Read Next</h4>
              <ul>
                <li><Link href="/blog/benefits-of-outsourcing">Benefits of Outsourcing to Organization</Link></li>
                <li><Link href="/blog/accounting-bookkeeping-services-you-need-to-know">Accounting Services</Link></li>
                <li><Link href="/blog/shared-services">Shared Services</Link></li>
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
  p { margin-bottom: 24px; }
  ul { margin-bottom: 30px; padding-left: 20px; }
  li { margin-bottom: 10px; }
  .intro-text { font-size: 1.25rem; color: #475569; border-left: 4px solid #00A79D; padding-left: 24px; font-style: italic; }

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