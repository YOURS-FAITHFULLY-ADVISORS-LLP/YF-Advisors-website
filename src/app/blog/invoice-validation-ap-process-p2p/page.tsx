"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

export default function InvoiceValidationPage() {
  return (
    <ArticleWrapper>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <Image 
          src="/blog/invoice-validation.jpg" 
          alt="Invoice Validation AP Process (P2P)" 
          fill 
          priority 
          className="hero-img" 
        />
        <div className="hero-content">
          <span className="category-badge">Services</span>
          <h1 className="article-title">Invoice Validation AP Process (P2P)</h1>
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
            
            <h2 className="section-heading">Challenges in Traditional Invoice Processing</h2>
            
            <div className="question-box">
              <p><strong>1) Do you find Vendor Management and Cost tracking a Hassel?</strong></p>
              <p><strong>2) Do you think the traditional way of handling vendors and doing 3-way invoice checking can achieve 100% accuracy?</strong></p>
            </div>

            <p className="intro-text">
              The answer is <strong>No</strong>, and it needs robust technology to bridge the workflow gaps.
            </p>

            <h2 className="section-heading">Bridging the Gap with Technology</h2>
            <p>
              Happy to announce that we at <strong>YOURS FAITHFULLY ADVISORS LLP</strong> have partnered with 100% cloud-based Technology and successfully achieved operating efficiency by <strong>30%</strong>.
            </p>

            <p>
              This technological integration helps finance and operations teams to:
            </p>
            <ul>
              <li>Track costs on a real-time basis.</li>
              <li>Conclude Provisions at the highest accuracy levels.</li>
              <li>Streamline the entire Procure-to-Pay (P2P) lifecycle.</li>
            </ul>
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-widget">
              <h4>Read Next</h4>
              <ul>
                <li><Link href="/blog/rethink-back-office">Rethink Your Back Office</Link></li>
                <li><Link href="/blog/benefits-of-outsourcing">Benefits of Outsourcing</Link></li>
                <li><Link href="/blog/outsourcing-financial-accounting">Outsourcing Financial Accounting</Link></li>
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
  .section-heading:first-child { margin-top: 0; }

  p { margin-bottom: 24px; }
  ul { margin-bottom: 30px; padding-left: 20px; }
  li { margin-bottom: 10px; }
  
  .intro-text { font-size: 1.25rem; color: #475569; border-left: 4px solid #00A79D; padding-left: 24px; font-style: italic; }

  .question-box {
    background: #f1f5f9;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    border: 1px dashed #cbd5e1;
  }
  .question-box p { margin-bottom: 10px; color: #334155; }
  .question-box p:last-child { margin-bottom: 0; }

  .sidebar-widget { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; margin-bottom: 30px; }
  .sidebar-widget h4 { color: #002B49; margin-bottom: 24px; text-transform: uppercase; border-bottom: 2px solid #00A79D; padding-bottom: 12px; display: inline-block; }
  .sidebar-widget ul { list-style: none; padding: 0; }
  .sidebar-widget li { padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
  .sidebar-widget a { color: #64748b; text-decoration: none; transition: color 0.3s; &:hover { color: #00A79D; } }
  .categories-list span { display: block; padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9; }
`;