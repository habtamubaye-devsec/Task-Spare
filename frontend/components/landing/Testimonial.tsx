/* ─── Testimonial Section ─── */
/* Photo + blockquote + name/role, teal accent, left-right layout */

export function Testimonial() {
  return (
    <section className="section-padding bg-gray-50/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-64 h-72 sm:w-72 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-teal to-teal-dark shadow-xl">
                {/* Placeholder avatar illustration */}
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="42" r="24" fill="white" fillOpacity="0.3" />
                    <path
                      d="M20 110c0-22 18-40 40-40s40 18 40 40"
                      fill="white"
                      fillOpacity="0.2"
                    />
                  </svg>
                </div>
              </div>

              {/* Floating quote icon */}
              <div className="absolute -bottom-4 -left-4 bg-white w-12 h-12 rounded-xl shadow-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#0d6e6e">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right — Quote */}
          <div>
            <div className="border-l-4 border-teal pl-6">
              <blockquote className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium italic">
                &ldquo;The SaaS Webflow template has been a game-changer for our
                marketing efforts. As someone responsible for creating engaging
                landing pages, this template&apos;s design flexibility and ease of
                customization have saved me countless hours. It strikes the perfect
                balance between aesthetics and functionality.&rdquo;
              </blockquote>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center text-teal font-bold text-lg">
                J
              </div>
              <div>
                <p className="font-bold text-gray-900">Jhone Doe</p>
                <p className="text-sm text-gray-500">CEO Spark71</p>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="mt-6 flex gap-3">
              <button className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-teal hover:text-teal transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-teal hover:text-teal transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
