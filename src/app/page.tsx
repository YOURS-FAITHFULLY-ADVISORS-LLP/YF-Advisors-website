import Navbar from '@/src/components/navbar';
import Hero from '@/src/components/hero';
import StatsSection from '@/src/components/StatSection';
import ServicesSection from '../components/services';
import Testimonials from '../components/testimonial';
import TeamSection from '../components/meet-the-team';
import AboutUs from '../components/about-us'; 
import Products from '../components/product';
import ContactChat from '../components/contact';
import Footer from '../components/footer';

export default function Home() {
  return (
    <div className="min-h-screen font-sans text-slate-900 bg-gray-50">
      <Navbar />
      <Hero />
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