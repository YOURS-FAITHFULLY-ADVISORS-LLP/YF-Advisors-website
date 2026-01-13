"use client";

import React from 'react';
import Image from "next/image";

const teamData = [
    {
        name: "Vishal Aggarwal",
        role: "Founder and Partner",
        description: "Chartered Accountant",
        experience: "Experience: 14+ years",
        image: "/meet-team/vishal.png",
        linkedin: "https://www.linkedin.com/in/vishal777/"
    },
    {
        name: "Kirti Aggarwal",
        role: "Co-Founder and Partner",
        description: "Chartered Accountant",
        experience: "Experience: 12+ years",
        image: "/meet-team/kirti.png",
        linkedin: "#"
    },
    {
        name: "Saket Drona",
        role: "Co-Founder and Partner",
        description: "Post Graduate IIM",
        experience: "Experience: 26+ years",
        image: "/meet-team/saket.png",
        linkedin: "https://www.linkedin.com/in/saket-drona-30b0571/"
    }
];

const LinkedInIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
);

export default function TeamSection() {
    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                
                <h3 className="text-sm font-bold tracking-widest text-[#00A79D] uppercase mb-2">Our Leadership</h3>
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#002B49]">Meet Our People</h1>
                <p className="w-full md:w-3/5 mb-14 text-slate-500 text-sm md:text-base leading-relaxed">
                    Guided by experienced professionals dedicated to transforming your business operations with efficiency and expertise.
                </p>

                <div className="flex flex-wrap gap-8 items-center justify-center">
                    {teamData.map((member, index) => (
                        <div 
                            key={index} 
                            className="group flex flex-col items-center py-8 px-6 bg-white border border-gray-200 w-80 rounded-xl shadow-sm cursor-pointer hover:border-[#00A79D] hover:bg-[#00A79D] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="relative w-32 h-32 mb-6">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="rounded-full object-cover border-4 border-slate-50 group-hover:border-white/20 transition-colors"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            <h2 className="text-[#002B49] group-hover:text-white text-xl font-bold uppercase tracking-wide">
                                {member.name}
                            </h2>
                            <p className="text-[#00A79D] group-hover:text-white/90 font-semibold text-sm mt-1">
                                {member.role}
                            </p>

                            <div className="mt-4 mb-6 flex flex-col gap-1 items-center">
                                <p className="text-slate-500 group-hover:text-white/80 text-sm font-medium">
                                    {member.description}
                                </p>
                                <p className="text-slate-800 group-hover:text-white text-sm font-bold">
                                    {member.experience}
                                </p>
                            </div>

                            <div className="mt-auto">
                                <a 
                                    href={member.linkedin} 
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-[#0077b5] group-hover:bg-white/20 group-hover:text-white transition-colors"
                                    aria-label={`LinkedIn profile of ${member.name}`}
                                >
                                    <LinkedInIcon />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}