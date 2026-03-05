/* ─── Landing Page ─── */
/* Composes all landing sections in the correct order.
   Wrapped in .landing class to scope the light SaaS theme. */

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustedCompanies } from "@/components/landing/TrustedCompanies";
import { Features } from "@/components/landing/Features";
import { AdvancedFeatures } from "@/components/landing/AdvancedFeatures";
import { PowerfulPlatform } from "@/components/landing/PowerfulPlatform";
import { Testimonial } from "@/components/landing/Testimonial";
import { Blog } from "@/components/landing/Blog";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="landing min-h-screen">
      <Navbar />
      <Hero />
      <TrustedCompanies />
      <Features />
      <AdvancedFeatures />
      <PowerfulPlatform />
      <Testimonial />
      <Blog />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
