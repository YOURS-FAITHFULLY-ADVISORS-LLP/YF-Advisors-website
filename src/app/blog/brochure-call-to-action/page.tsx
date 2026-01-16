"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

export default function BrochurePage() {
  return (
    <ArticleWrapper>
      {/* Hero Header */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        {/* Using your specific brochure image path */}
        <Image 
          src="/blog/brochure.png" 
          alt="Yours Faithfully Advisors Brochure" 
          fill 
          priority 
          className="hero-img" 
        />
        <div className="hero-content">
          <span className="category-badge">Resources</span>
          <h1 className="article-title">Grow Your Business, Not Your Back-Office</h1>
          <div className="meta-data">Download Our Exclusive Brochure</div>
        </div>
      </div>

      <div className="container">
        {/* Navigation */}
        <div className="nav-bar">
          <Link href="/blog" className="back-link">&larr; Back to Insights</Link>
        </div>

        <div className="content-grid">
          
          {/* Main Content Area */}
          <div className="article-body">
            
            {/* Intro Text */}
            <div className="intro-section">
              <h2 className="main-heading">Yours Faithfully Advisors</h2>
              <h3 className="sub-heading">Your Trusted Outsourcing Partners</h3>
              <p className="description">
                In today&apos;s fast-paced business environment, efficiency is key. Our comprehensive brochure outlines how YF Advisors can streamline your operations, reduce overhead costs, and allow you to focus on what matters most—growing your core business.
              </p>
            </div>

            {/* Visual Preview Section */}
            <div className="preview-container">
              <div className="image-wrapper">
                <Image
                    src="/blog/brochure.png"
                    alt="Brochure Preview"
                    width={800}
                    height={600}
                    className="content-image"
                />
              </div>
              <div className="download-action">
                {/* Simulated Download Button */}
                <a href="/brochure/YF-Advsiors-Brochure.pdf" download className="download-btn">
                  Download Brochure (PDF)
                </a>
                <p className="file-info">File Size: 2.4 MB</p>
              </div>
            </div>

            <h2 className="section-title">Why Choose YF Advisors?</h2>
            <div className="services-grid">
              <ServiceCard>
                <h4>Accounting & Bookkeeping</h4>
                <p>Precise financial tracking to keep you compliant and informed.</p>
              </ServiceCard>
              <ServiceCard>
                <h4>Payroll Management</h4>
                <p>Timely and accurate payroll processing for your entire team.</p>
              </ServiceCard>
              <ServiceCard>
                <h4>Tax Planning</h4>
                <p>Strategic tax compliance to maximize your savings.</p>
              </ServiceCard>
              <ServiceCard>
                <h4>Financial Consulting</h4>
                <p>Expert advice to guide your business expansion.</p>
              </ServiceCard>
            </div>

            {/* Contact Section */}
            <div className="contact-section">
              <h3>Ready to Get Started?</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="label">Email:</span>
                  <a href="mailto:info@yfadvisors.in">info@yfadvisors.in</a>
                </div>
                <div className="contact-item">
                  <span className="label">Phone:</span>
                  <span>+91 22 46054371</span>
                </div>
                <div className="contact-item">
                  <span className="label">Visit Us:</span>
                  <span>Millennium Business Park, Mahape, Mumbai</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-widget">
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/services">Our Services</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact Page</Link></li>
              </ul>
            </div>
             <div className="sidebar-widget">
              <h4>Read Next</h4>
              <ul>
                <li><Link href="/blog/accounting-bookkeeping-services-you-need-to-know">Accounting Services</Link></li>
                <li><Link href="/blog/shared-services">Shared Services</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </ArticleWrapper>
  );
}

// --- Styles ---

const ArticleWrapper = styled.article`
  background-color: #f8fafc;
  min-height: 100vh;
  padding-bottom: 80px;
  font-family: 'Inter', sans-serif;

  /* Hero Section */
  .hero-section {
    position: relative;
    height: 45vh;
    min-height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    margin-bottom: -60px; /* Overlap effect */
  }

  .hero-img {
    object-fit: cover;
    z-index: 1;
    filter: brightness(0.7);
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0, 43, 73, 0.85) 0%, rgba(0, 167, 157, 0.8) 100%);
    z-index: 2;
  }

  .hero-content {
    position: relative;
    z-index: 3;
    max-width: 900px;
    padding: 0 20px;
  }

  .category-badge {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 6px 16px;
    border-radius: 30px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
    display: inline-block;
  }

  .article-title {
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 15px;
    text-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }

  .meta-data {
    font-size: 1.1rem;
    font-weight: 500;
    opacity: 0.95;
  }

  /* Container & Grid */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 5;
    padding: 0 20px;
  }

  .nav-bar { margin-bottom: 30px; }
  
  .back-link { 
    color: white; 
    text-decoration: none; 
    font-weight: 600; 
    background: rgba(0,43,73,0.6); 
    padding: 8px 16px; 
    border-radius: 20px; 
    backdrop-filter: blur(4px); 
    transition: all 0.3s;
    
    &:hover { background: #00A79D; }
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 50px;

    @media (max-width: 968px) {
      grid-template-columns: 1fr;
    }
  }

  /* Article Body */
  .article-body {
    background: white;
    padding: 50px;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.06);
    color: #334155;
  }

  .intro-section {
    text-align: center;
    margin-bottom: 40px;
  }

  .main-heading {
    color: #002B49;
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: -0.5px;
  }

  .sub-heading {
    color: #00A79D;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .description {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #475569;
    max-width: 700px;
    margin: 0 auto;
  }

  /* Preview Section */
  .preview-container {
    background: #f1f5f9;
    padding: 30px;
    border-radius: 12px;
    margin-bottom: 50px;
    text-align: center;
    border: 1px solid #e2e8f0;
  }

  .image-wrapper {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    margin-bottom: 25px;
    border: 4px solid white;
    display: inline-block;
  }

  .content-image {
    display: block;
    max-width: 100%;
    height: auto;
  }

  .download-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #002B49;
    color: white;
    padding: 14px 32px;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 50px;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 43, 73, 0.3);

    &:hover {
      background: #00A79D;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 167, 157, 0.3);
    }
  }

  .file-info {
    font-size: 0.85rem;
    color: #94A3B8;
    margin-top: 10px;
    font-weight: 500;
  }

  .section-title {
    color: #002B49;
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 25px;
    border-left: 5px solid #00A79D;
    padding-left: 15px;
  }

  /* Services Grid */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 50px;
  }

  /* Contact Section */
  .contact-section {
    background: #002B49;
    color: white;
    padding: 35px;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
  }

  .contact-section::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200px;
    height: 200px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }

  .contact-section h3 {
    margin-top: 0;
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .contact-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1rem;
  }

  .label {
    font-weight: 700;
    color: #00A79D;
  }

  .contact-item a {
    color: white;
    text-decoration: none;
    border-bottom: 1px dashed rgba(255,255,255,0.5);
    transition: all 0.2s;
    
    &:hover { color: #00A79D; border-bottom-color: #00A79D; }
  }

  /* Sidebar */
  .sidebar { display: flex; flex-direction: column; gap: 30px; }
  
  .sidebar-widget {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    border: 1px solid #f1f5f9;
  }

  .sidebar-widget h4 {
    color: #002B49;
    margin-bottom: 20px;
    text-transform: uppercase;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 1px;
    border-bottom: 2px solid #00A79D;
    padding-bottom: 10px;
    display: inline-block;
  }

  .sidebar-widget ul { list-style: none; padding: 0; }
  
  .sidebar-widget li { 
    margin-bottom: 12px;
    border-bottom: 1px solid #f8fafc;
    padding-bottom: 12px;
  }
  
  .sidebar-widget a { 
    color: #64748b; 
    text-decoration: none; 
    font-weight: 500;
    transition: color 0.3s;
    
    &:hover { color: #00A79D; }
  }
`;

const ServiceCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;

  h4 {
    color: #002B49;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  p {
    font-size: 0.85rem;
    color: #64748b;
    line-height: 1.4;
    margin: 0;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
    border-color: #00A79D;
  }
`;