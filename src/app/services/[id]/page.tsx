import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle2, Star, Briefcase, BarChart, ArrowRight, LayoutGrid, ArrowRightCircle
} from 'lucide-react';
import { prisma } from '@/src/lib/prisma';
import { servicesData } from '../../../data/services/data'; 

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetail(props: PageProps) {
  const params = await props.params;
  const id = params.id;

  // 1. Query database for live service data (matching ID or slug)
  const dbService = await prisma.service.findFirst({
    where: {
      OR: [
        { id: id },
        { slug: id },
      ],
    },
    include: {
      offerings: { orderBy: { order: 'asc' } },
      capabilities: { orderBy: { order: 'asc' } },
      benefits: { orderBy: { order: 'asc' } },
      whyChooseUs: { orderBy: { order: 'asc' } },
      workSteps: { orderBy: { stepNumber: 'asc' } },
    },
  });

  // 2. Fallback to static servicesData if not found in DB
  const staticService = servicesData.find(
    (s) => s.id === id || s.id === dbService?.slug || s.title.toLowerCase().replace(/\s+/g, '-') === id
  );

  if (!dbService && !staticService) return notFound();

  // Combine DB & static presentation properties
  const service = {
    id: dbService?.id || staticService?.id || id,
    title: dbService?.title || staticService?.title || '',
    color: staticService?.color || '#00A79D',
    icon: staticService?.icon || Briefcase,
    shortDescription: dbService?.cardDescription || staticService?.shortDescription || '',
    introText: dbService?.description 
      ? [dbService.description.replace(/<[^>]*>?/gm, '').trim()]
      : staticService?.introText || [],
    detailedServices: dbService?.offerings && dbService.offerings.length > 0
      ? dbService.offerings.map(o => ({ title: o.title, description: o.description }))
      : staticService?.detailedServices || [],
    coreServices: dbService?.capabilities && dbService.capabilities.length > 0
      ? dbService.capabilities.map(c => ({ title: c.title, description: c.description }))
      : staticService?.coreServices || [],
    benefitsDetail: dbService?.benefits && dbService.benefits.length > 0
      ? dbService.benefits.map(b => ({ title: b.title, description: b.description }))
      : staticService?.benefitsDetail || [],
    whyChooseUs: dbService?.whyChooseUs && dbService.whyChooseUs.length > 0
      ? dbService.whyChooseUs.map(w => ({ title: w.title, description: w.description }))
      : staticService?.whyChooseUs || [],
    workProcess: dbService?.workSteps && dbService.workSteps.length > 0
      ? dbService.workSteps.map(s => ({ title: s.title, description: s.description }))
      : staticService?.workProcess || [],
    otherServices: staticService?.otherServices || [],
  };

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-200">
      
      {/* ================= HERO SECTION ================= */}
      <header className="relative bg-slate-900 text-white pt-32 pb-24 px-6 overflow-hidden">
        <div 
          className="absolute -top-24 -right-24 w-125 h-125 rounded-full blur-3xl opacity-20 pointer-events-none mix-blend-screen"
          style={{ backgroundColor: service.color }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link 
            href="/#services" 
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-10 text-sm font-medium uppercase tracking-wider"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to All Services
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-10 lg:items-center mb-12">
            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl w-fit">
              <Icon size={72} style={{ color: service.color }} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                {service.title}
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl font-light">
                {service.shortDescription}
              </p>
            </div>
          </div>
          
          {/* Intro Text */}
          <div className="max-w-4xl space-y-6 text-lg text-slate-300 leading-relaxed border-l-4 pl-6 border-white/20">
             {service.introText?.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
             ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        
        {/* ================= 1. DETAILED SERVICES GRID ================= */}
        {service.detailedServices && service.detailedServices.length > 0 && (
            <section>
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-3 rounded-xl bg-slate-100">
                      <LayoutGrid className="text-slate-700" size={28} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                      Our {service.title} Services
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {service.detailedServices.map((item, i) => (
                        <div 
                          key={i} 
                          className="group flex flex-col h-full p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="mb-4 relative z-10">
                              <div className="w-12 h-1.5 rounded-full group-hover:w-24 transition-all duration-500" style={{ backgroundColor: service.color }} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-slate-700 transition-colors relative z-10">
                              {item.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed grow text-sm md:text-base relative z-10">
                              {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* ================= 2. CORE SERVICES ================= */}
        {service.coreServices && service.coreServices.length > 0 && (
            <section className="bg-slate-900 text-white rounded-4xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-14">
                        <div className="p-3 rounded-xl bg-white/10 backdrop-blur">
                          <Star style={{ color: service.color }} size={28} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold">Core Capabilities</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
                        {service.coreServices.map((item, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="mt-2 shrink-0">
                                  <ArrowRightCircle style={{ color: service.color }} size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-4 text-white">
                                      {item.title}
                                    </h3>
                                    <p className="text-slate-400 text-lg leading-relaxed font-light">
                                      {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )}

        {/* ================= 3. BENEFITS & WHY CHOOSE US ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Left: Benefits */}
            {service.benefitsDetail && service.benefitsDetail.length > 0 && (
                <section>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 rounded-xl bg-slate-100">
                          <BarChart className="text-slate-700" size={28} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Key Benefits</h2>
                    </div>
                    <div className="space-y-6">
                        {service.benefitsDetail.map((item, i) => (
                            <div key={i} className="flex gap-5 p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                                <div className="mt-1 shrink-0">
                                    <CheckCircle2 size={28} style={{ color: service.color }} className="group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl text-slate-900 mb-2">{item.title}</h4>
                                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Right: Why Choose Us */}
            {service.whyChooseUs && service.whyChooseUs.length > 0 && (
                <section className="bg-slate-50 p-10 rounded-3xl h-fit border border-slate-100 relative">
                     <div className="absolute top-0 right-0 p-10 opacity-10">
                        <Briefcase size={120} style={{ color: service.color }} />
                     </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-10 relative z-10">Why Choose Our Firm?</h2>
                    <div className="grid grid-cols-1 gap-8 relative z-10">
                        {service.whyChooseUs.map((item, i) => (
                            <div key={i} className="relative pl-8 border-l-4" style={{ borderColor: service.color }}>
                                <h4 className="font-bold text-xl text-slate-900 mb-2">{item.title}</h4>
                                <p className="text-slate-600 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>

        {/* ================= 4. WORK PROCESS ================= */}
        {service.workProcess && service.workProcess.length > 0 && (
            <section className="border-t border-slate-200 pt-20">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-20 text-center">How We Work</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {service.workProcess.map((item, i) => (
                        <div key={i} className="relative text-center group">
                            {i !== service.workProcess!.length - 1 && (
                                <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-slate-100 -z-10" />
                            )}
                            
                            <div 
                                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold text-white mb-8 shadow-xl relative z-10 border-[6px] border-white transition-transform group-hover:scale-110"
                                style={{ backgroundColor: service.color }}
                            >
                                {i + 1}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                            <p className="text-slate-600 px-2 leading-relaxed text-sm">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* ================= 5. FOOTER / OTHER SERVICES ================= */}
        {service.otherServices && service.otherServices.length > 0 && (
            <section className="bg-slate-50 rounded-4xl p-10 md:p-16 mt-12 text-center md:text-left border border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-8">
                  Explore Related Services
                </h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    {service.otherServices.map((link, i) => (
                        <div 
                            key={i} 
                            className="group flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-600 font-medium shadow-sm hover:border-slate-400 hover:text-slate-900 hover:shadow-md cursor-pointer transition-all"
                        >
                            {link}
                            <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </div>
                    ))}
                </div>
            </section>
        )}

      </main>
    </div>
  );
}