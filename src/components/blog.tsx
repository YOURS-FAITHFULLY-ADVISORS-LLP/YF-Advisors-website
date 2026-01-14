"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";

// --- Blog Data ---
const blogPosts = [
  {
    id: 1,
    title: "Diwali celebration 2024",
    excerpt: "Diwali Celebration 2024 Festive Vibes and Togetherness. Join us as we celebrate Diwali 2024 with vibrant decorations...",
    date: "November 15, 2024",
    category: "News and Events",
    image: "/blog/blog-1.jpg", 
  },
  {
    id: 2,
    title: "Accounting & Bookkeeping Services You Need to Know",
    excerpt: "Whether you’re a startup or a developed business, managing finances is crucial...",
    date: "August 30, 2024",
    category: "Services",
    image: "/blog/blog-2.jpg",
  },
  {
    id: 3,
    title: "Bookkeeping Services for Small Business",
    excerpt: "Managing finances is a cornerstone of running a successful business...",
    date: "August 26, 2024",
    category: "Services",
    image: "/blog/blog-3.jpg",
  },
  {
    id: 4,
    title: "Brochure: Call to Action",
    excerpt: "Start using this style on your WordPress sites and make your site more flexible...",
    date: "August 11, 2024",
    category: "Brochure",
    image: "/blog/blog-4.jpg",
  },
  {
    id: 5,
    title: "2022: Happy New Year!",
    excerpt: "Wish you a Happy New Year! Stay safe and healthy.",
    date: "October 7, 2022",
    category: "News and Events",
    image: "/blog/blog-5.jpg",
  },
  {
    id: 6,
    title: "Outsourcing of financial accounting and payroll",
    excerpt: "Streamline your financial processes with expert outsourcing solutions.",
    date: "October 6, 2022",
    category: "Services",
    image: "/blog/blog-6.jpg",
  },
  {
    id: 7,
    title: "Optimism and self belief",
    excerpt: "We are living in a world of Knightian uncertainty in the absence of determinate knowledge...",
    date: "October 6, 2022",
    category: "News & Events",
    image: "/blog/blog-7.jpg",
  },
  {
    id: 8,
    title: "Benefits of Outsourcing to organization",
    excerpt: "Outsourcing and shared services market to cross the $1 trillion threshold within six years...",
    date: "October 6, 2022",
    category: "Services",
    image: "/blog/blog-8.jpg",
  },
  {
    id: 9,
    title: "Shared Services",
    excerpt: "The success of a business in the modern era depends heavily on providing value beyond cost...",
    date: "October 6, 2022",
    category: "Services",
    image: "/blog/blog-9.jpg",
  },
  {
    id: 10,
    title: "Rethink your back office",
    excerpt: "Globalization and emerging technologies require you to have a more adaptable business model...",
    date: "October 6, 2022",
    category: "Services",
    image: "/blog/blog-10.jpg",
  },
  {
    id: 11,
    title: "Food and Team Bonding",
    excerpt: "Food and team bonding – you can’t go wrong! As an employer, it must be your plan...",
    date: "October 6, 2022",
    category: "Services",
    image: "/blog/blog-11.jpg",
  },
  {
    id: 12,
    title: "Invoice Validation AP Process (P2P)",
    excerpt: "Do you find Vendor Management and Cost tracking a Hassle? Do you think the traditional way...",
    date: "October 6, 2022",
    category: "Services",
    image: "/blog/blog-12.jpg",
  },
  {
    id: 13,
    title: "Spark of Hope",
    excerpt: "A way to live and work that aligned with the new normal. A more balanced and welcoming year...",
    date: "September 6, 2022",
    category: "Services",
    image: "/blog/blog-13.jpg",
  },
];

const Blog = () => {
  return (
    <SectionWrapper>
      <div className="container">
        <div className="header-section">
          <h3 className="subtitle">Our Blog</h3>
          <h2 className="section-title">Latest Insights & News</h2>
        </div>
        
        <div className="grid">
          {blogPosts.map((post) => (
            <CardWrapper key={post.id}>
              <div className="card">
                {/* Image Section */}
                <div className="image-container">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="blog-img"
                  />
                </div>

                <div className="content-padding">
                  <p className="header">{post.category}</p>
                  <div className="main-content">
                    <p className="heading">{post.title}</p>
                    <p className="excerpt">{post.excerpt}</p>
                  </div>
                  <div className="footer">{post.date}</div>
                </div>
              </div>
            </CardWrapper>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

// --- Styles ---

const SectionWrapper = styled.section`
  padding: 80px 20px;
  background-color: #f8fafc; /* Slate-50 equivalent */
  min-height: 100vh;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .header-section {
    text-align: center;
    margin-bottom: 60px;
  }

  .subtitle {
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #00A79D; /* TEAL */
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .section-title {
    font-size: 3rem;
    font-weight: 700;
    color: #002B49; /* Dark Navy */
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 40px;
    justify-items: center;
  }
`;

const CardWrapper = styled.div`
  /* --- CARD STYLING --- */
  .card {
    width: 320px;
    height: 480px; /* Increased height for images */
    background: white;
    
    /* Primary Color Border (Teal) */
    border: 2px solid #00A79D; 
    
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transform-origin: center center;
    border-radius: 12px;
    overflow: hidden;
    position: relative;

    /* The Specific Animation Curve you requested */
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  /* --- Image Section --- */
  .image-container {
    position: relative;
    width: 100%;
    height: 180px; 
    overflow: hidden;
    border-bottom: 1px solid #e2e8f0;
  }

  .blog-img {
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  /* --- Content Section --- */
  .content-padding {
    padding: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
    /* Default Text Color: Dark Navy */
    color: #002B49; 
    transition: color 0.6s;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .header {
    margin-bottom: 16px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
    color: #00A79D; /* TEAL Text */
    transition: color 0.6s;
  }

  .heading {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .excerpt {
    font-size: 14px;
    color: #64748b; /* Slate-500 */
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.6s;
  }

  .footer {
    font-weight: 500;
    font-size: 13px;
    margin-top: auto;
    color: #94a3b8; /* Slate-400 */
    transition: color 0.6s;
    padding-top: 16px;
    border-top: 1px solid #f1f5f9;
  }

  /* --- HOVER EFFECTS (The Animation) --- */
  .card:hover {
    border-radius: 12px;
    /* Background becomes Teal */
    background-color: #00A79D; 
    
    /* The specific rotation and scale you asked for */
    scale: 0.95;
    rotate: 8deg;
    
    /* Shadow using Teal color with opacity */
    box-shadow: 0px 3px 187.5px 7.5px rgba(0, 167, 157, 0.4);
  }

  /* Zoom the image slightly inside the rotating card */
  .card:hover .blog-img {
    transform: scale(1.1);
  }

  /* Change text colors to White on hover for contrast */
  .card:hover .content-padding,
  .card:hover .heading,
  .card:hover .header,
  .card:hover .excerpt,
  .card:hover .footer {
    color: white;
    border-color: rgba(255,255,255,0.2);
  }
  
  .card:hover .header {
    opacity: 0.9;
  }
`;

export default Blog;