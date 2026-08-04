import dynamic from 'next/dynamic';
import Navbar from '@/src/components/navbar';
import Hero from '@/src/components/hero';
import StatsSection from '@/src/components/StatSection';
import Footer from '../components/footer';
import { getHomepageData } from '@/src/lib/cms-server';

const AboutUs = dynamic(() => import('../components/about-us'));
const ServicesSection = dynamic(() => import('../components/services'));
const Testimonials = dynamic(() => import('../components/testimonial'));
const TeamSection = dynamic(() => import('../components/meet-the-team'));
const Products = dynamic(() => import('../components/product'));
const CompanyHighlights = dynamic(() => import('../components/company-highlights'));
const ContactChat = dynamic(() => import('../components/contact'));

export default async function Home() {
  const homepageData = await getHomepageData();

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-gray-50">
      <Navbar />
      <Hero initialData={homepageData} />
      <StatsSection />
      <AboutUs />
      <ServicesSection />
      <Testimonials />
      <TeamSection />
      <Products />
      <CompanyHighlights />
      <ContactChat />
      <Footer />
    </div>
  );
}