import Navbar from '@/src/components/navbar';
import Hero from '@/src/components/hero';
import StatsSection from '@/src/components/StatSection';
import ServicesSection from '../components/services';
import Testimonials from '../components/testimonial';
import TeamSection from '../components/meet-the-team';
import AboutUs from '../components/about-us'; 
import Products from '../components/product';
import CompanyHighlights from '../components/company-highlights';
import ContactChat from '../components/contact';
import Footer from '../components/footer';
import { getHomepageData } from '@/src/lib/cms-server';

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