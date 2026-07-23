"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

// --- Default Data ---
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
    linkedin: "https://www.linkedin.com/in/deepak-babel-1b576722b/"
  },
  {
    id: 6,
    name: "Sanjay Choudhary",
    role: "Growth Partner",
    description: "Masters, IIM Calcutta. Specialization: Operations & Delivery Quality.",
    experience: "Experience: 30+ years",
    image: "/meet-team/sanjay.png",
    linkedin: "https://www.linkedin.com/in/sanjay-kumar-choudhary-10a5b516/"
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
    name: "CS. Pawan Kumar Laddha",
    role: "Advocate",
    description: "B.E., CS. | Fintech, e-Commerce & Blockchain Lawyer",
    experience: "Experience: 25+ years",
    image: "/meet-team/pawan.png",
    linkedin: "https://www.linkedin.com/in/pawan-l-0b82716/"
  },
  {
    id: 9,
    name: "Nipun Khanna",
    role: "Chartered Accountant",
    description: "Specialization: Income Tax & GST Litigation, Appeal Matters",
    experience: "Experience: 15+ years",
    image: "/meet-team/nipun.png",
    linkedin: "https://www.linkedin.com/in/ca-nipun-khanna-5875ba3a/"
  }
];

const TeamSections = () => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchTeamData() {
      try {
        const res = await fetch('/api/admin/team?status=PUBLISHED');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
            const formatted = json.data.map((m: any) => ({
              id: m.id,
              name: m.name,
              role: m.designation || m.role || "Partner",
              description: m.bio || m.description || "",
              experience: m.experience || "",
              image: m.profileImage || m.image || "/meet-team/default.png",
              linkedin: m.linkedinUrl || m.linkedin || "#"
            }));
            setTeamMembers(formatted);
            setLoading(false);
            return;
          }
        }
        if (isMounted) {
          setTeamMembers(teamData);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load team members:", err);
        if (isMounted) {
          setTeamMembers(teamData);
          setLoading(false);
        }
      }
    }
    fetchTeamData();
    return () => { isMounted = false; };
  }, []);

  const displayList = teamMembers.length > 0 ? teamMembers : teamData;

  return (
    <div id='our-team' className="flex flex-col items-center p-10 bg-slate-50 min-h-screen">
      <div className="w-full text-center mb-12">
        <h3 className="text-sm font-bold tracking-widest text-[#00A79D] uppercase mb-2">Our Leadership</h3>
        <h2 className="text-3xl md:text-4xl font-bold text-[#002B49] mb-4">Meet Our People</h2>
        <p className="text-slate-500">Hover over the cards to see their expertise</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-screen-2xl">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="flex justify-center w-full">
              <div className="w-[260px] h-[340px] bg-slate-200/80 rounded-2xl animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-screen-2xl">
          {displayList.map((member) => (
            <div key={member.id} className="flex justify-center w-full">
              <Card member={member} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Card = ({ member }: { member: any }) => {
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
                  priority
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
                  {member.experience && <p className="exp">{member.experience}</p>}
                </div>
                {/* LinkedIn Button */}
                {member.linkedin && member.linkedin !== '#' && (
                  <a
                    href={
                      member.linkedin.startsWith('http')
                        ? member.linkedin
                        : `https://www.linkedin.com/in/${member.linkedin.replace(/^\/+/, '').replace(/\/+$/, '')}/`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkedin-btn"
                  >
                    LinkedIn &rarr;
                  </a>
                )}
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
  --bg-card: #ffffff;

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
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
  }

  .front,
  .back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 20px;
    overflow: hidden;
  }

  .back {
    width: 100%;
    height: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
    overflow: hidden;
    background-color: #ffffff;
  }

  .back::before {
    position: absolute;
    content: ' ';
    display: block;
    width: 220px;
    height: 160%;

    background: linear-gradient(
      90deg,
      transparent,
      var(--primary),
      var(--primary),
      var(--primary),
      var(--primary),
      transparent
    );
    animation: rotation_481 6000ms infinite linear;
  }

  .back-content {
    position: absolute;
    width: 98.5%;
    height: 98.5%;
    background-color: #ffffff;
    border-radius: 19px;
    color: #002B49;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 20px;
    text-align: center;
  }

  .img-container {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    padding: 3px;
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0, 167, 157, 0.25);
  }

  .profile-img {
    border-radius: 50%;
    object-fit: cover;
    width: 100%;
    height: 100%;
    background-color: #f1f5f9;
  }

  .name-text {
    font-size: 1.05rem;
    font-weight: 800;
    color: #002B49;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .role-text {
    font-size: 0.82rem;
    color: #00A79D;
    font-weight: 600;
  }

  .card:hover .content {
    transform: rotateY(180deg);
  }

  .front {
    transform: rotateY(180deg);
    background-color: #002B49;
    color: white;
  }

  .front .front-content {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 10;
  }

  .front-content .badge {
    background-color: rgba(0, 167, 157, 0.15);
    padding: 5px 12px;
    border-radius: 20px;
    backdrop-filter: blur(4px);
    width: fit-content;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #00A79D;
    border: 1px solid rgba(0, 167, 157, 0.4);
  }

  .description {
    width: 100%;
    padding: 14px;
    background-color: rgba(0, 20, 36, 0.65);
    backdrop-filter: blur(8px);
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .title {
    font-size: 14px;
    max-width: 100%;
    margin-bottom: 6px;
  }

  .title p {
    color: #ffffff;
  }

  .card-footer {
    color: #cccccc;
    margin-top: 4px;
  }

  .desc-text {
    font-size: 11px;
    line-height: 1.4;
    color: #e2e8f0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .exp {
    font-size: 10px;
    font-weight: 700;
    color: #00A79D;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 8px;
  }

  .linkedin-btn {
    display: inline-block;
    margin-top: 10px;
    font-size: 11px;
    font-weight: 700;
    color: #002B49;
    background-color: #ffffff;
    padding: 6px 14px;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .linkedin-btn:hover {
    background-color: #f8fafc;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  .front .img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: var(--primary);
    position: absolute;
    filter: blur(25px);
    opacity: 0.6;
    animation: floating 2600ms infinite linear;
  }

  #bottom {
    background-color: var(--primary-dark);
    left: 60px;
    top: 0px;
    width: 150px;
    height: 150px;
    animation-delay: -800ms;
  }

  #right {
    background-color: var(--primary-light);
    left: 130px;
    top: 130px;
    width: 70px;
    height: 70px;
    animation-delay: -1800ms;
  }

  @keyframes floating {
    0% { transform: translateY(0px); }
    50% { transform: translateY(10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes rotation_481 {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default TeamSections;