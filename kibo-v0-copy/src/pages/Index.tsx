import * as React from "react";
import { Suspense, lazy } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";

// Lazy load below-the-fold sections
const CompanyTicker = lazy(() => import("@/components/landing/CompanyTicker").then(module => ({ default: module.CompanyTicker })));
const FeaturesSection = lazy(() => import("@/components/landing/FeaturesSection").then(module => ({ default: module.FeaturesSection })));
const HowItWorksSection = lazy(() => import("@/components/landing/HowItWorksSection").then(module => ({ default: module.HowItWorksSection })));
const TestimonialsSection = lazy(() => import("@/components/landing/TestimonialsSection").then(module => ({ default: module.TestimonialsSection })));
const FAQSection = lazy(() => import("@/components/landing/FAQSection").then(module => ({ default: module.FAQSection })));
const CTASection = lazy(() => import("@/components/landing/CTASection").then(module => ({ default: module.CTASection })));
const Footer = lazy(() => import("@/components/landing/Footer").then(module => ({ default: module.Footer })));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* 1. Hero Section - Immediately visible */}
      <HeroSection />

      {/* Lazy load the rest of the page */}
      <Suspense fallback={<div className="h-20" />}>
        {/* 2. Trust Bar - Company Logos */}
        <CompanyTicker className="border-y border-border bg-muted/30" />

        {/* 3. How It Works - The 4 Steps */}
        <HowItWorksSection />

        {/* 4. Features - Toolkit Grid */}
        <FeaturesSection id="features" />

        {/* 5. Testimonials - Real Stories */}
        <TestimonialsSection />

        {/* 6. FAQ - Questions? */}
        <FAQSection />

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
