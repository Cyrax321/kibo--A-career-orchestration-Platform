import * as React from "react";
import { cn } from "@/lib/utils";

// Import logos
import googleLogo from "@/assets/logos/google.svg";
import metaLogo from "@/assets/logos/meta.svg";
import appleLogo from "@/assets/logos/apple.svg";
import netflixLogo from "@/assets/logos/netflix.svg";
import stripeLogo from "@/assets/logos/stripe.svg";
import airbnbLogo from "@/assets/logos/airbnb.svg";
import uberLogo from "@/assets/logos/uber.svg";
import spotifyLogo from "@/assets/logos/spotify.svg";
import nvidiaLogo from "@/assets/logos/nvidia.svg";
import teslaLogo from "@/assets/logos/tesla.svg";
import githubLogo from "@/assets/logos/github.svg";
import amazonLogo from "@/assets/logos/amazon.svg";
import microsoftLogo from "@/assets/logos/microsoft.svg";

// Row 1: MAANG + major tech
const companiesRow1 = [
  { name: "Google", logo: googleLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "Apple", logo: appleLogo },
  { name: "Meta", logo: metaLogo },
  { name: "Netflix", logo: netflixLogo },
  { name: "Microsoft", logo: microsoftLogo },
  { name: "Nvidia", logo: nvidiaLogo },
];

// Row 2: Startups & Growth companies
const companiesRow2 = [
  { name: "Stripe", logo: stripeLogo },
  { name: "Airbnb", logo: airbnbLogo },
  { name: "Uber", logo: uberLogo },
  { name: "Spotify", logo: spotifyLogo },
  { name: "GitHub", logo: githubLogo },
  { name: "Tesla", logo: teslaLogo },
];

interface CompanyTickerProps {
  className?: string;
}

const CompanyTicker: React.FC<CompanyTickerProps> = ({ className }) => {
  return (
    <section className={cn("relative overflow-hidden py-16", className)}>
      {/* Section header */}
      <div className="container mx-auto px-6 mb-10">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by engineers at world's top companies
        </p>
      </div>

      {/* Gradient masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-40 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-40 bg-gradient-to-l from-background via-background/80 to-transparent" />

      {/* Row 1 - Scrolling left — plain divs with CSS hover, no motion.div or backdrop-blur */}
      <div className="mb-4 flex animate-scroll will-change-transform">
        {[...companiesRow1, ...companiesRow1, ...companiesRow1, ...companiesRow1].map((company, index) => (
          <div
            key={`row1-${company.name}-${index}`}
            className="mx-3 flex min-w-fit items-center gap-3 rounded-xl bg-white border border-border/20 px-6 py-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:-translate-y-1 cursor-pointer"
          >
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="h-6 w-6 object-contain opacity-80"
              loading="lazy"
            />
            <span className="text-sm font-medium text-foreground/80">
              {company.name}
            </span>
          </div>
        ))}
      </div>

      {/* Row 2 - Scrolling right (reverse) */}
      <div className="flex animate-scroll-reverse will-change-transform">
        {[...companiesRow2, ...companiesRow2, ...companiesRow2, ...companiesRow2].map((company, index) => (
          <div
            key={`row2-${company.name}-${index}`}
            className="mx-3 flex min-w-fit items-center gap-3 rounded-xl bg-white border border-border/20 px-6 py-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:-translate-y-1 cursor-pointer"
          >
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="h-6 w-6 object-contain opacity-80"
              loading="lazy"
            />
            <span className="text-sm font-medium text-foreground/80">
              {company.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export { CompanyTicker };
