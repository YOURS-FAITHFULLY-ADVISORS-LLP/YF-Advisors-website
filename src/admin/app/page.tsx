import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { LogOut, FileText, LayoutDashboard, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard | YF Advisors',
  description: 'Admin Portal Dashboard',
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 flex flex-col font-sans">
      {/* Header / Navbar with YFA Styling */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-12 shrink-0">
              <Image
                src="/logo.png"
                alt="YF Advisors"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center leading-none select-none text-[#002B49]">
              <span className="font-serif text-[11px] font-bold tracking-[0.2em] uppercase mb-0.5">
                Yours Faithfully
              </span>
              <div className="w-full h-[1.5px] bg-[#FDB913] rounded-full" />
              <span className="font-serif text-[11px] font-bold tracking-[0.2em] uppercase mt-0.5 text-center">
                Advisors
              </span>
            </div>
            <span className="ml-3 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#002B49]/10 text-[#002B49] border border-[#002B49]/20 uppercase">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 hidden sm:inline font-medium">
              Logged in as: <strong className="text-[#002B49] font-semibold">{session.id}</strong>
            </span>
            <form action="/api/admin/auth/logout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 px-3.5 py-2 rounded-full border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 transition-all cursor-pointer shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-serif text-[#002B49]">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Welcome to the YF Advisors Administrator Management Portal.</p>
        </div>

        {/* Quick Stats / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 hover:shadow-lg transition-all shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#002B49] uppercase tracking-wider">Blog Articles</span>
              <FileText className="w-5 h-5 text-[#FDB913]" />
            </div>
            <div className="text-2xl font-bold font-serif text-[#002B49]">Manage Content</div>
            <p className="text-xs text-slate-500">Create, edit, or publish blog articles.</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 hover:shadow-lg transition-all shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#002B49] uppercase tracking-wider">Services</span>
              <LayoutDashboard className="w-5 h-5 text-[#00A79D]" />
            </div>
            <div className="text-2xl font-bold font-serif text-[#002B49]">Services Catalog</div>
            <p className="text-xs text-slate-500">Manage offered financial advisory services.</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 hover:shadow-lg transition-all shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#002B49] uppercase tracking-wider">Settings</span>
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
            <div className="text-[#002B49] text-2xl font-bold font-serif">System Settings</div>
            <p className="text-xs text-slate-500">Configure global website parameters.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
