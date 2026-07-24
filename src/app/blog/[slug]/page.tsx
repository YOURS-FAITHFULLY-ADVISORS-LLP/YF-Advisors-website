import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { blogPosts } from "@/src/data/blogs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicBlogPage(props: PageProps) {
  const params = await props.params;
  const slug = params.slug;

  // 1. Query Prisma database for published blog
  const dbBlog = await prisma.blog.findFirst({
    where: {
      OR: [
        { slug: slug },
        { id: slug },
      ],
    },
    include: {
      sections: { orderBy: { displayOrder: "asc" } },
    },
  });

  // 2. Static fallback if not in DB
  const staticBlog = blogPosts.find((b) => b.slug === slug || String(b.id) === slug);

  if (!dbBlog && !staticBlog) {
    return notFound();
  }

  const title = dbBlog?.title || staticBlog?.title || "";
  const category = dbBlog?.category || staticBlog?.category || "Services";
  const author = dbBlog?.author || "YF Advisors";
  const image = dbBlog?.image || staticBlog?.image || "/blog/spark.jpg";
  const formattedDate = new Date(
    dbBlog?.publishedAt || dbBlog?.createdAt || staticBlog?.date || Date.now()
  ).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const introText = dbBlog?.excerpt || dbBlog?.cardDescription || staticBlog?.excerpt || "";
  const contentHtml = dbBlog?.content || "";
  const sections = dbBlog?.sections || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <Image
          src={image}
          alt={title}
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        <div className="relative z-20 max-w-5xl mx-auto h-full flex flex-col justify-end p-6 md:p-12 pb-16">
          <span className="bg-[#00A79D] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full w-fit mb-4">
            {category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-white mb-4 max-w-4xl">
            {title}
          </h1>
          <div className="text-xs md:text-sm text-slate-300 font-medium flex items-center gap-3">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>By {author}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00A79D] hover:text-[#002B49] transition-colors mb-10"
        >
          &larr; Back to Insights
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Content */}
          <main className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
            {introText && (
              <p className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed border-l-4 border-[#00A79D] pl-5 italic">
                {introText}
              </p>
            )}

            {/* Main Content HTML (from rich text editor) */}
            {contentHtml && (
              <div
                className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#002B49] prose-a:text-[#00A79D] prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            )}

            {/* Additional Sections */}
            {sections.map((section: any, idx: number) => (
              <div key={section.id || idx} className="space-y-3 pt-4 border-t border-slate-100">
                {section.heading && (
                  <h2 className="text-2xl font-bold font-serif text-[#002B49]">
                    {section.heading}
                  </h2>
                )}
                {section.content && (
                  <div
                    className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                )}
              </div>
            ))}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold font-serif text-[#002B49] uppercase tracking-wider border-b border-slate-100 pb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                  Services
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                  News and Events
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                  Brochure
                </span>
              </div>
            </div>

            <div className="bg-[#002B49] text-white rounded-3xl p-6 shadow-md space-y-4">
              <h3 className="text-base font-bold font-serif text-white">
                Transform Your Back Office
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with YF Advisors to streamline your accounting, payroll, and business process outsourcing.
              </p>
              <Link
                href="/#contact"
                className="inline-block px-5 py-2.5 bg-[#00A79D] hover:bg-[#008f85] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
              >
                Contact Us
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
