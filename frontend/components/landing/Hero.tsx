/* ─── Hero Section ─── */
/* Matches the TaskIQ design: teal gradient background, headline, description,
   two CTA buttons, and a CSS-only analytics dashboard mockup on the right. */

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden hero-gradient">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-50 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div>
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wide uppercase text-teal bg-teal-light rounded-full mb-6">
              Best Webflow Template
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-gray-900">
              The Smart Way to Get{" "}
              <span className="block">Things Done</span>
            </h1>

            <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-lg">
              Grow with confidence as you refine your skills. A balanced approach to progress,
              supported by structured learning and steady growth.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="btn-teal px-7 py-3.5 text-sm font-semibold rounded-lg"
              >
                Try Free Trial
              </Link>
              <Link
                href="#features"
                className="btn-outline px-7 py-3.5 text-sm font-semibold rounded-lg"
              >
                Request a Demo
              </Link>
            </div>
          </div>

          {/* Right — Analytics dashboard mockup */}
          <div className="relative hidden lg:block">
            {/* Main dashboard card */}
            <div className="glass-panel rounded-2xl p-6 shadow-xl">
              {/* Top row of mini cards */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                {/* Customer Satisfaction card */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">
                    Customer Satisfaction
                  </p>
                  <div className="flex items-end gap-1 h-16">
                    {[65, 45, 80, 55, 70, 90, 60, 85, 50, 75, 95, 68].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{
                            height: `${h}%`,
                            background:
                              i % 2 === 0
                                ? "#0d6e6e"
                                : "#e6f5f5",
                          }}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Target vs Reality card */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">
                    Target vs Reality
                  </p>
                  <div className="flex items-end gap-2 h-16">
                    {[
                      [70, 55],
                      [85, 60],
                      [60, 75],
                      [90, 70],
                      [75, 85],
                    ].map(([a, b], i) => (
                      <div key={i} className="flex-1 flex gap-0.5 items-end">
                        <div
                          className="flex-1 bg-teal rounded-t-sm"
                          style={{ height: `${a}%` }}
                        />
                        <div
                          className="flex-1 bg-emerald-accent/30 rounded-t-sm"
                          style={{ height: `${b}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom large card — Total Revenue */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                    Total Revenue
                  </p>
                  <span className="text-xs font-semibold text-emerald-accent">
                    +12.5%
                  </span>
                </div>
                {/* SVG line chart */}
                <svg
                  viewBox="0 0 300 80"
                  className="w-full h-20"
                  fill="none"
                >
                  <defs>
                    <linearGradient
                      id="revenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#0d6e6e" stopOpacity="0.2" />
                      <stop
                        offset="100%"
                        stopColor="#0d6e6e"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 60 Q30 50, 60 45 T120 30 T180 35 T240 20 T300 15"
                    stroke="#0d6e6e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 60 Q30 50, 60 45 T120 30 T180 35 T240 20 T300 15 V80 H0 Z"
                    fill="url(#revenueGrad)"
                  />
                </svg>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl px-4 py-2.5 shadow-lg border border-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-accent/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium">Growth</p>
                <p className="text-sm font-bold text-gray-900">+24.5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
