"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

export default function BenefitsOfOutsourcingPage() {
  return (
    <ArticleWrapper>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        {/* Hero Image - General Business Growth Theme */}
        <Image 
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop" 
          alt="Benefits of Outsourcing" 
          fill 
          priority 
          className="hero-img" 
        />
        <div className="hero-content">
          <span className="category-badge">Services</span>
          <h1 className="article-title">Benefits of Outsourcing to Organization</h1>
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
              The outsourcing and shared services market is expected to cross the <strong>$1 trillion threshold</strong> within six years. This projection highlights a massive shift in global business strategies, moving beyond simple cost-saving measures to comprehensive value creation.
            </p>

            <h2 className="section-heading">Drivers of Rapid Market Growth</h2>
            <p>
              The reasons for this rapid market growth are two-fold but closely aligned:
            </p>
            <ul>
              <li>
                <strong>Digital Disruption:</strong> Recent innovations have given rise to new exponential technologies. These are leading to digital disruption and transformation not only of organizations but also of entire industries and even nations.
              </li>
              <li>
                <strong>Technological Advancements:</strong> Technologies such as Cloud Computing, Artificial Intelligence (AI), and Robotic Process Automation (RPA) are being actively adopted within the Outsourcing and Shared Services (OSS) industry itself.
              </li>
            </ul>

            <h2 className="section-heading">Key Benefits Breakdown</h2>
            <p>
              Why are organizations rushing to outsource? The data paints a clear picture. As shown in the chart below, the primary driver is the ability to focus on core business functions, followed closely by cost reduction.
            </p>

            {/* CHART IMAGE SECTION */}
            <div className="chart-container">
               <Image 
                src="/blog/benefits-of-outsourcing.jpg" 
                alt="Chart showing benefits of outsourcing: 70% focus on core functions, 65% cost cutting"
                width={800}
                height={450}
                className="content-image"
              />
              <p className="caption">Figure 1: Survey results on the primary benefits of outsourcing to organizations.</p>
            </div>

            <h2 className="section-heading">From Cost-Efficiency to Value-Creation</h2>
            <p>
              By adopting new technologies, the industry is evolving from a pure cost-efficiency model to new innovative <strong>value-creation models</strong>.
            </p>
            <p>
              This tech-enabled transformation presents significant opportunities for the industry’s potential impact and growth. Organizations can now leverage outsourcing not just to save money, but to access intellectual capital, solve capability issues, and enhance overall service quality.
            </p>

            <div className="cta-box">
              <h3>Optimize Your Operations</h3>
              <p>Leverage our expertise to focus on your core business functions today.</p>
              <Link href="/contact"><button>Contact Us</button></Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-widget">
              <h4>Read Next</h4>
              <ul>
                <li><Link href="/blog/outsourcing-financial-accounting">Outsourcing Financial Accounting</Link></li>
                <li><Link href="/blog/shared-services">Shared Services</Link></li>
                <li><Link href="/blog/rethink-back-office">Rethink Your Back Office</Link></li>
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
  
  /* Chart Image Styles */
  .chart-container {
    background: #f1f5f9;
    padding: 30px;
    border-radius: 12px;
    margin: 40px 0;
    text-align: center;
    border: 1px solid #e2e8f0;
  }
  .content-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
  .caption {
    font-size: 0.9rem;
    color: #64748b;
    margin-top: 15px;
    font-style: italic;
    margin-bottom: 0;
  }

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