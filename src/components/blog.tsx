"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "../data/blogs";

const Blog = () => {
  // Explicitly type state for TypeScript (number or null)
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <SectionWrapper>
      <div className="container">
        <div className="header-section">
          <h3 className="subtitle">OUR BLOG</h3>
          <h2 className="section-title">Latest Insights & News</h2>
          <div className="title-bar"></div>
          <p className="section-description">
            Stay updated with industry trends, company news, and expert perspectives from YF Advisors.
          </p>
        </div>
        
        <div className="grid">
          {blogPosts.map((post, index) => (
            <CardWrapper 
              key={post.id}
              $delay={index * 0.1} // Staggered delay based on index
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={hoveredId === post.id ? 'card-hovered' : ''}
            >
              {/* Dynamic Link using the slug from your data */}
              {/* ADDED: target="_blank" to open in new tab */}
              <Link 
                href={`/blog/${post.slug}`} 
                className="card-link"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="card">
                  {/* Image Area */}
                  <div className="image-container">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="blog-img"
                    />
                    <div className="gradient-overlay"></div>
                    <div className="category-tag">
                      <span className="category-dot"></span>
                      {post.category}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="content-padding">
                    <div className="meta-info">
                      <span className="date-text">{post.date}</span>
                    </div>

                    <div className="title-wrapper">
                       <h3 className="heading">{post.title}</h3>
                    </div>
                    
                    <p className="excerpt">{post.excerpt}</p>
                    
                    <div className="footer">
                      <span className="read-more-btn">
                        Read Article
                        <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </CardWrapper>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

// --- Animations ---

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// --- Styles ---

const SectionWrapper = styled.section`
  padding: 100px 20px;
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;

  .container {
    max-width: 1280px;
    margin: 0 auto;
  }

  .header-section {
    text-align: center;
    margin-bottom: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .subtitle {
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: #00A79D; /* YF Teal */
    text-transform: uppercase;
    margin-bottom: 1rem;
    background: rgba(0, 167, 157, 0.1);
    padding: 6px 14px;
    border-radius: 50px;
  }

  .section-title {
    font-size: 3rem;
    font-weight: 800;
    color: #002B49; /* YF Navy */
    margin: 0 0 1rem 0;
    line-height: 1.1;
    
    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }

  .title-bar {
    width: 60px;
    height: 4px;
    background: #00A79D;
    border-radius: 2px;
    margin-bottom: 1.5rem;
  }

  .section-description {
    font-size: 1.1rem;
    color: #64748B;
    max-width: 600px;
    line-height: 1.6;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 40px;
    justify-items: center;
  }
`;

const CardWrapper = styled.div<{ $delay: number }>`
  width: 100%;
  max-width: 380px;
  /* Entrance Animation */
  opacity: 0;
  animation: ${fadeInUp} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: ${props => props.$delay}s;

  .card-link {
    text-decoration: none;
    color: inherit;
    display: block;
    height: 100%;
  }

  /* --- CARD STYLING --- */
  .card {
    height: 100%;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 43, 73, 0.05);
    border: 1px solid rgba(0, 43, 73, 0.05);
    display: flex;
    flex-direction: column;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  /* --- Image Section --- */
  .image-container {
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;
  }

  .blog-img {
    object-fit: cover;
    transition: transform 0.8s ease;
  }

  .gradient-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 43, 73, 0.4), transparent);
    opacity: 0.6;
    transition: opacity 0.4s ease;
  }

  .category-tag {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    color: #002B49;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 6px 12px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    z-index: 2;
  }

  .category-dot {
    width: 6px;
    height: 6px;
    background: #00A79D;
    border-radius: 50%;
  }

  /* --- Content Section --- */
  .content-padding {
    padding: 30px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .meta-info {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }

  .date-text {
    font-size: 0.8rem;
    color: #94A3B8;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .heading {
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.3;
    color: #002B49;
    margin: 0 0 16px 0;
    /* Limit lines */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.3s ease;
  }

  .excerpt {
    font-size: 0.95rem;
    color: #64748B;
    line-height: 1.6;
    margin-bottom: 24px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1; /* Pushes footer down */
  }

  .footer {
    padding-top: 20px;
    border-top: 1px solid #F1F5F9;
    display: flex;
    align-items: center;
  }

  .read-more-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #00A79D;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
  }

  .arrow-icon {
    transition: transform 0.3s ease;
  }

  /* --- HOVER STATES --- */
  
  /* Hover the wrapper to affect children */
  &:hover .card {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 167, 157, 0.15); /* Teal glow */
    border-color: rgba(0, 167, 157, 0.3);
  }

  &:hover .blog-img {
    transform: scale(1.08); /* Gentle zoom */
  }

  &:hover .heading {
    color: #00A79D; /* Title turns Teal */
  }

  &:hover .arrow-icon {
    transform: translateX(6px); /* Arrow moves right */
  }
  
  &:hover .read-more-btn {
    color: #002B49; /* Button turns Navy */
  }
`;

export default Blog;