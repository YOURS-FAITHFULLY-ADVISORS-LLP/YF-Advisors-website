import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { blogPosts } from "@/src/data/blogs";
import BlogHeroSlider from "@/src/components/BlogHeroSlider";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function parseImageUrls(imageStr: string | null | undefined): string[] {
  if (!imageStr || !imageStr.trim()) return [];
  const trimmed = imageStr.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter((url) => typeof url === "string" && url.trim().length > 0);
    } catch (e) {
      // fallback
    }
  }
  if (trimmed.includes(",")) {
    return trimmed.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
  }
  return [trimmed];
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

  // 2. Static fallback if not yet present in DB
  const staticBlog = blogPosts.find((b) => b.slug === slug || String(b.id) === slug);
  const blog = dbBlog || staticBlog;

  if (!blog) {
    return notFound();
  }

  const title = blog.title;
  const category = ("category" in blog && blog.category) ? blog.category : "Services";
  const author = ("author" in blog && blog.author) ? blog.author : "YF Advisors";
  const images = parseImageUrls(blog.image);
  const rawDate = "publishedAt" in blog ? (blog.publishedAt || blog.createdAt) : (blog as any).date;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Recent";

  const introText = "excerpt" in blog ? (blog.excerpt || (blog as any).cardDescription) : "";
  const contentHtml = "content" in blog ? (blog.content || "") : "";
  const sections = "sections" in blog ? (blog.sections || []) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Rotating Hero Section Slider */}
      <BlogHeroSlider
        images={images}
        title={title}
        category={category}
        formattedDate={formattedDate}
        author={author}
      />

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
          <aside className="lg:col-span-4 space-y-6 sticky top-28 h-fit">
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
