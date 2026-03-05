/* ─── Blog Section ─── */
/* "Latest From Blog" — 3 blog preview cards with images, titles, dates */

const posts = [
  {
    title: "Transforming Your Business Through Innovation",
    date: "Feb Jun 25, 2025",
    category: "Company Culture",
    image: "bg-gradient-to-br from-teal to-emerald-accent",
  },
  {
    title: "The art of compelling storytelling in marketing",
    date: "Jul Jun 8, 2025",
    category: "Industry Insights",
    image: "bg-gradient-to-br from-teal-dark to-teal",
  },
  {
    title: "7 packaging inspiration ideas for Consumer",
    date: "November 11, 2025",
    category: "E-Commerce",
    image: "bg-gradient-to-br from-emerald-accent to-teal-light",
  },
];

export function Blog() {
  return (
    <section id="blog" className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-12">
          Latest From Blog
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.title}
              className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover"
            >
              {/* Image placeholder */}
              <div className={`h-48 ${post.image} relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-teal transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{post.date}</span>
                  <span className="font-medium text-teal/70">
                    {post.category}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
