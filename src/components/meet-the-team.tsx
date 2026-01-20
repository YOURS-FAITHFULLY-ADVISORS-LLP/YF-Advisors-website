"use client";

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

// --- Data ---
const teamData = [
  {
    id: 1,
    name: "Vishal Aggarwal",
    role: "Founder and Partner",
    description: "Chartered Accountant. Specialization: Business Process Re-engineering & Advisory.",
    experience: "Experience: 14+ years",
    image: "/meet-team/vishal.png",
    linkedin: "https://www.linkedin.com/in/vishal777/"
  },
  {
    id: 2,
    name: "Kirti Aggarwal",
    role: "Co-Founder and Partner",
    description: "Chartered Accountant. Specialization: Finance and legal operations in MNCs.",
    experience: "Experience: 12+ years",
    image: "/meet-team/kirti.png",
    linkedin: "https://www.linkedin.com/in/kkirti-aggarwal-a14a20125/"
  },
  {
    id: 3,
    name: "Saket Drona",
    role: "Partner",
    description: "Post Graduate IIM. Specialization: International offshoring & Op Excellence.",
    experience: "Experience: 26+ years",
    image: "/meet-team/saket.png",
    linkedin: "https://www.linkedin.com/in/saket-drona-30b0571/"
  },
  {
    id: 4,
    name: "Shiv Mittal",
    role: "Partner",
    description: "Specializes in Strategic Financial Management, Cash Flow & Systems.",
    experience: "Experience: 21+ years",
    image: "/meet-team/shiv.png", 
    linkedin: "https://www.linkedin.com/in/shiv-mittal-02227344/"
  },
  {
    id: 5,
    name: "Deepak Babel",
    role: "Partner",
    description: "Specializes in Internal Audits, Data Analytics & Outsourcing Ops.",
    experience: "Experience: 15+ years",
    image: "/meet-team/deepak.png", 
    linkedin: "#"
  },
  {
    id: 6,
    name: "Sanjay Choudhary",
    role: "Growth Partner",
    description: "Masters, IIM Calcutta. Specialization: Operations & Delivery Quality.",
    experience: "Experience: 30+ years",
    image: "/meet-team/sanjay.png", 
    linkedin: "#"
  },
  {
    id: 7,
    name: "Jyoti Mittal",
    role: "Growth Partner",
    description: "Masters in Marketing & HR. Specialization: Talent Mgmt & Acquisition.",
    experience: "Experience: 27+ years",
    image: "/meet-team/jyoti.png", 
    linkedin: "https://www.linkedin.com/in/jyoti-mittal-99a2794/"
  },
  {
    id: 8,
    name: "Ritesh Verma",
    role: "Growth Partner",
    description: "B.E. (CS). Specialization: IT Projects, Banking & Capital Markets.",
    experience: "Experience: 25+ years",
    image: "/meet-team/ritesh.png", 
    linkedin: "https://www.linkedin.com/in/dr-ritesh-verma-81ab5018/"
  }
];

const TeamSections = () => {
  return (
    <div id='team' className="flex flex-col items-center p-10 bg-slate-50 min-h-screen">
      <div className="w-full text-center mb-12">
        <h3 className="text-sm font-bold tracking-widest text-[#00A79D] uppercase mb-2">Our Leadership</h3>
        <h2 className="text-3xl md:text-4xl font-bold text-[#002B49] mb-4">Meet Our People</h2>
        <p className="text-slate-500">Hover over the cards to see their expertise</p>
      </div>
      
      {/* Fixed: Replaced max-w-[1400px] with standard Tailwind class max-w-screen-2xl 
         to fix the linter warning while maintaining width for 4 columns.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-screen-2xl">
        {teamData.map((member) => (
          <div key={member.id} className="flex justify-center w-full">
            <Card member={member} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Card = ({ member }: { member: typeof teamData[0] }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="content">
          
          {/* --- SIDE 1: INITIAL VIEW (Photo & Name) --- */}
          <div className="back">
            <div className="back-content">
              <div className="img-container">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  width={100} 
                  height={100} 
                  className="profile-img"
                  priority // Boolean prop shorthand
                  unoptimized 
                />
              </div>
              <strong className="name-text">{member.name}</strong>
              <span className="role-text">{member.role}</span>
            </div>
          </div>

          {/* --- SIDE 2: HOVER VIEW (Details) --- */}
          <div className="front">
            {/* Animated Background Circles */}
            <div className="img">
              <div className="circle"></div>
              <div className="circle" id="right"></div>
              <div className="circle" id="bottom"></div>
            </div>
            
            <div className="front-content">
              <small className="badge">{member.role}</small>
              <div className="description">
                <div className="title">
                  <p className="title">
                    <strong>{member.name}</strong>
                  </p>
                </div>
                <div className="card-footer">
                  <p className="desc-text">{member.description}</p>
                  <p className="exp">{member.experience}</p>
                </div>
                {/* LinkedIn Button */}
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-btn">
                   LinkedIn &rarr;
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* --- COLOR VARIABLES --- */
  --primary: #00A79D; 
  --primary-dark: #008f85;
  --primary-light: #4fd1c9; 
  --bg-card: #151515;

  /* Ensures wrapper takes full width of grid cell */
  width: 100%;
  display: flex;
  justify-content: center;

  .card {
    overflow: visible;
    width: 260px; 
    height: 340px; 
    cursor: pointer;
    position: relative;
  }

  .content {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.1);
    border-radius: 15px;
  }

  .front, .back {
    background-color: var(--bg-card);
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 15px;
    overflow: hidden;
  }

  /* --- BACK SIDE (Initial View) --- */
  .back {
    background-color: #fff;
    border: 1px solid #e2e8f0;
    justify-content: center;
    display: flex;
    align-items: center;
    z-index: 2;
  }

  /* The Spinning Border Effect */
  .back::before {
    position: absolute;
    content: ' ';
    display: block;
    width: 180px; 
    height: 180%;
    background: linear-gradient(90deg, transparent, var(--primary), var(--primary), var(--primary), var(--primary), transparent);
    animation: rotation_481 4000ms infinite linear;
  }

  .back-content {
    position: absolute;
    width: 98%;
    height: 98%;
    background-color: #ffffff;
    border-radius: 14px;
    color: #002B49;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    z-index: 5;
  }

  .img-container {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--primary);
    padding: 2px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-img {
    border-radius: 50%;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .name-text {
    font-size: 1.25rem;
    font-weight: 800;
    color: #002B49;
    text-transform: uppercase;
    text-align: center;
    padding: 0 10px;
    line-height: 1.2;
  }

  .role-text {
    font-size: 0.9rem;
    color: var(--primary);
    font-weight: 600;
    text-align: center;
  }

  /* --- ANIMATION TRIGGERS --- */
  .card:hover .content {
    transform: rotateY(180deg);
  }

  @keyframes rotation_481 {
    0% { transform: rotateZ(0deg); }
    100% { transform: rotateZ(360deg); }
  }

  /* --- FRONT SIDE (Hover View) --- */
  .front {
    transform: rotateY(180deg);
    color: white;
    background-color: #002B49;
    z-index: 1;
  }

  .front .front-content {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 10;
  }

  .front-content .badge {
    background-color: rgba(0, 167, 157, 0.2);
    color: var(--primary-light);
    padding: 6px 14px;
    border-radius: 20px;
    backdrop-filter: blur(4px);
    width: fit-content;
    font-weight: 600;
    font-size: 0.75rem;
    border: 1px solid var(--primary);
  }

  .description {
    box-shadow: 0px 4px 15px rgba(0,0,0,0.3);
    width: 100%;
    padding: 16px;
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .title {
    font-size: 15px;
    max-width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: #fff;
  }

  .card-footer {
    color: #e2e8f0;
    margin-top: 5px;
    font-size: 13px;
    line-height: 1.6;
  }

  .desc-text {
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 4; 
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .exp {
    margin-top: 8px;
    font-weight: bold;
    color: var(--primary-light);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .linkedin-btn {
    display: inline-block;
    margin-top: 15px;
    font-size: 12px;
    font-weight: 600;
    color: #002B49;
    text-decoration: none;
    background: white;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.3s ease;
  }
  
  .linkedin-btn:hover {
    background: var(--primary);
    color: white;
  }

  /* --- DECORATIVE ANIMATED CIRCLES --- */
  .front .img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 1;
    opacity: 0.5;
  }

  .circle {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: var(--primary);
    position: relative;
    filter: blur(30px);
    animation: floating 2600ms infinite linear;
    opacity: 0.5;
  }

  #bottom {
    background-color: #008f85;
    left: 50px;
    top: 0px;
    width: 150px;
    height: 150px;
    animation-delay: -800ms;
  }

  #right {
    background-color: #4fd1c9;
    left: 160px;
    top: -80px;
    width: 30px;
    height: 30px;
    animation-delay: -1800ms;
  }

  @keyframes floating {
    0% { transform: translateY(0px); }
    50% { transform: translateY(10px); }
    100% { transform: translateY(0px); }
  }
`;

export default TeamSections;