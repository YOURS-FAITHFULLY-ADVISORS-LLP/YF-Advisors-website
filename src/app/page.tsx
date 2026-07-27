import dynamic from 'next/dynamic';
import { prisma } from '@/src/lib/prisma';
import Navbar from '@/src/components/navbar';
import Hero from '@/src/components/hero';
import StatsSection from '@/src/components/StatSection';

const AboutUs = dynamic(() => import('../components/about-us'));
const ServicesSection = dynamic(() => import('../components/services'));
const Testimonials = dynamic(() => import('../components/testimonial'));
const TeamSection = dynamic(() => import('../components/meet-the-team'));
const Products = dynamic(() => import('../components/product'));
const ContactChat = dynamic(() => import('../components/contact'));
const Footer = dynamic(() => import('../components/footer'));

export default async function Home() {
  let heroData = null;
  try {
    heroData = await prisma.homepage.findFirst();
  } catch (err) {
    // Fallback gracefully if database fetch fails
  }

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-gray-50">
      <Navbar />
      <Hero initialData={heroData} />
      <StatsSection />
      <AboutUs />
      <ServicesSection />
      <Testimonials />
      <TeamSection />
      <Products />
      <ContactChat />
      <Footer />
    </div>
  );
}