/* ─── Trusted Companies Section ─── */
/* Row of company logos with "Fortune 100" headline */

export function TrustedCompanies() {
  const logos = [
    "Logoipsum",
    "Logoipsum",
    "Logoipsum",
    "Logoipsum",
    "Logoipsum",
  ];

  return (
    <section className="section-padding border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <p className="text-sm font-medium text-gray-400 mb-10">
          The choice of leading Fortune 100 companies
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((name, i) => (
            <div key={i} className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity duration-300">
              {/* Logo placeholder icon */}
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
              </div>
              <span className="text-base font-semibold text-gray-700 tracking-tight">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
