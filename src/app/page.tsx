import Navbar from '@/src/components/navbar';
import Hero from '@/src/components/hero';


export default function Home() {
  return (
    <div className="min-h-screen font-sans text-slate-900 bg-gray-50">
      <Navbar />
      <Hero />
    </div>
  );
}