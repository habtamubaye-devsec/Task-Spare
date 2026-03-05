/* ─── CTA Section ─── */
/* Large centered call-to-action:
   "Revolutionize Your Business With Our Cutting-Edge SaaS Solution"
   Two buttons: Request Free Demo + Get Started Now */

import Link from "next/link";

export function CTA() {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-light mb-8">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
          Revolutionize Your Business with{" "}
          <span className="block">Our Cutting-Edge SaaS Solution</span>
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#"
            className="btn-teal px-8 py-3.5 text-sm font-semibold rounded-lg"
          >
            Request Free Demo
          </Link>
          <Link
            href="/register"
            className="btn-outline px-8 py-3.5 text-sm font-semibold rounded-lg"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </section>
  );
}
