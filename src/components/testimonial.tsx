"use client";

import React from 'react';

interface Testimonial {
    name: string;
    role: string;
    initials: string;
    color: string;
    text: string;
}

const reviewsRow1: Testimonial[] = [
    {
        name: 'Manj Musik',
        role: 'Canada',
        initials: 'MM',
        color: 'bg-blue-600',
        text: 'Prompt, helpful, knowledgeable and informative! Vishal and the team were great. We appreciated all of their efforts, they went above and beyond to ensure we were happy with everything.'
    },
    {
        name: 'Jaz Dhami',
        role: 'UK',
        initials: 'JD',
        color: 'bg-emerald-600',
        text: 'Vishal is professional, thorough and enthusiastic about helping his clients meet their financial goals. Thorough knowledge with a coat of soft skills that makes you want them in your inner circle.'
    },
    {
        name: 'Rajeev Das',
        role: 'Bloomberg US',
        initials: 'RD',
        color: 'bg-purple-600',
        text: 'I have been using these guys for years and WILL never go anywhere else. YF Advisors service is always with a smile and caring attitude. I highly recommend 🙂'
    },
    {
        name: 'Varun Chawla',
        role: 'Salesforce Consultant, Wipro',
        initials: 'VC',
        color: 'bg-amber-500',
        text: 'Besides providing accounting services, the team is very accommodating. I never have to worry about them getting work done on time, which gives me peace of mind. A pleasure to work with.'
    },
    {
        name: 'Neeraj Nagpal',
        role: 'Sr PM, Infogain US',
        initials: 'NN',
        color: 'bg-rose-500',
        text: 'One of the best, authentic and hardworking consultants I know. They will bend over backwards to fulfill your requirements. Unique perspective and broad knowledge base is the essence of the organization.'
    },
    {
        name: 'Avdhesh Agarwal',
        role: 'Director, Fareportal Inc US',
        initials: 'AA',
        color: 'bg-cyan-600',
        text: 'YF Advisors have been preparing our accounts and tax returns and their service is always good and timely. We value them as our consultants, and highly recommend YF Advisors.'
    }
];

const reviewsRow2: Testimonial[] = [
    {
        name: 'Satyabir Singh',
        role: 'Sr Director, Xpertisehub',
        initials: 'SS',
        color: 'bg-indigo-600',
        text: 'Vishal is a highly skilled CA who is very quick in resolving any issues and queries of his clients. A thorough gentleman and outstanding professional.'
    },
    {
        name: 'Ruchi Rajasekhar',
        role: 'Program Manager, MISO US',
        initials: 'RR',
        color: 'bg-teal-600',
        text: 'They deal with all of our payroll needs for 50+ staff on a weekly basis. We get a better level of service, faster response times AND save money compared to using our old accounting firm.'
    },
    {
        name: 'Nitish Mittal',
        role: 'Audit & Assurance Leader',
        initials: 'NM',
        color: 'bg-orange-500',
        text: 'Vishal is an enthusiastic professional who has always taken initiative. He is dedicated to his work and an excellent team player. His association will prove to be an asset for any organization.'
    },
    {
        name: 'Kanchi A-Dokania',
        role: 'Founder, Farmhouse Inc',
        initials: 'KD',
        color: 'bg-pink-600',
        text: 'Vishal is focused, professional and has the ability to come up with perfect solutions that can be easily integrated. He listens and does his very best without compromise.'
    },
    {
        name: 'Ankit Gulati',
        role: 'Audit Manager, KPMG Ireland',
        initials: 'AG',
        color: 'bg-slate-600',
        text: 'Vishal and his team are such a huge help. All the advice and encouragement given by him are valuable. They are very organized and efficient in their professional services.'
    }
];

const VerifiedIcon = () => (
    <svg className="mt-0.5 shrink-0 text-blue-500" width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" fill="currentColor" />
    </svg>
);

const StarRating = () => (
    <div className="flex gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
        ))}
    </div>
);

const TestimonialCard = ({ card }: { card: Testimonial }) => (
    <div className="p-6 rounded-2xl mx-4 shadow-sm bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 w-96 shrink-0 select-none flex flex-col justify-between h-full">
        <div>
            <div className="flex gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${card.color}`}>
                    {card.initials}
                </div>
                
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm text-gray-900">{card.name}</p>
                        <VerifiedIcon />
                    </div>
                    <span className="text-xs text-slate-500 font-medium truncate max-w-50" title={card.role}>
                        {card.role}
                    </span>
                </div>
            </div>
            
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                &quot;{card.text}&quot;
            </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
            <StarRating />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Verified Client</span>
        </div>
    </div>
);

const Testimonials = () => {
    return (
        <section className="py-20 bg-slate-50 overflow-hidden">
            <style>{`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                .marquee-inner {
                    width: max-content;
                    animation: marqueeScroll 80s linear infinite;
                }

                .marquee-reverse {
                    animation-direction: reverse;
                }

                .marquee-container:hover .marquee-inner {
                    animation-play-state: paused;
                }
            `}</style>
            
            <div className="text-center mb-16 px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Loved by Businesses Worldwide</h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                    See what our partners are saying about the efficiency we bring to their back office.
                </p>
            </div>

            <div className="flex flex-col gap-10">
                <div className="marquee-container w-full relative group">
                    <div className="absolute left-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-r from-slate-50 to-transparent"></div>
                    
                    <div className="marquee-inner flex transform-gpu will-change-transform">
                        {reviewsRow1.map((card, index) => (
                            <TestimonialCard key={`row1-original-${index}`} card={card} />
                        ))}
                        {reviewsRow1.map((card, index) => (
                            <TestimonialCard key={`row1-clone-${index}`} card={card} />
                        ))}
                         {reviewsRow1.map((card, index) => (
                            <TestimonialCard key={`row1-tri-clone-${index}`} card={card} />
                        ))}
                    </div>

                    <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-slate-50 to-transparent"></div>
                </div>

                <div className="marquee-container w-full relative group">
                    <div className="absolute left-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-r from-slate-50 to-transparent"></div>
                    
                    <div className="marquee-inner marquee-reverse flex transform-gpu will-change-transform">
                        {reviewsRow2.map((card, index) => (
                            <TestimonialCard key={`row2-original-${index}`} card={card} />
                        ))}
                        {reviewsRow2.map((card, index) => (
                            <TestimonialCard key={`row2-clone-${index}`} card={card} />
                        ))}
                        {reviewsRow2.map((card, index) => (
                            <TestimonialCard key={`row2-tri-clone-${index}`} card={card} />
                        ))}
                    </div>

                    <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-slate-50 to-transparent"></div>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;