import {
  Award,
  BarChart3,
  Building2,
  CheckCircle,
  ChevronDown,
  Clock,
  Factory,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Shield,
  Star,
  TrendingUp,
  Users,
  Warehouse,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PropertyCard } from "./components/PropertyCard";
import { PropertyModal } from "./components/PropertyModal";
import { PHONE, PROPERTIES, TEL_HREF, WHATSAPP_HREF } from "./data/properties";
import type { Property } from "./types";

const LOGO_SRC =
  "/assets/shree-real-estate-services-vishwakarma-industrial-area-jaipur-estate-agents-for-commercial-rental-63-019dd387-eb03-768a-8a74-b4c6c196deee.jpg";

const FILTERS = [
  "All",
  "Industrial Plots",
  "Factory Spaces",
  "Warehouse",
  "Lease / Rent",
] as const;
type Filter = (typeof FILTERS)[number];

const filterMap: Record<Filter, Property["category"] | null> = {
  All: null,
  "Industrial Plots": "Industrial Plot",
  "Factory Spaces": "Factory Space",
  Warehouse: "Warehouse",
  "Lease / Rent": null,
};

// ─── SCROLL ANIMATION HOOK ───
function useScrollVisible(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── ANIMATED COUNTER HOOK ───
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── SECTION WRAPPER ───
function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useScrollVisible();
  return (
    <div
      ref={ref}
      className={`section-enter ${visible ? "visible" : ""} ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── STATS STRIP ───
function StatsStrip() {
  const { ref, visible } = useScrollVisible(0.2);
  const deals = useCounter(50, 1600, visible);
  const props = useCounter(100, 1800, visible);
  const years = useCounter(15, 1400, visible);

  const stats = [
    { value: deals, suffix: "+", label: "Deals Closed" },
    {
      value: 0,
      suffix: "",
      label: "VKI Area Specialist",
      isText: true,
      textVal: "Expert",
    },
    { value: props, suffix: "+", label: "Properties Listed" },
    { value: years, suffix: "+", label: "Years Experience" },
    { value: 4.7, suffix: "★", label: "Client Rating", isDecimal: true },
  ];

  return (
    <div
      ref={ref}
      className="relative bg-foreground overflow-hidden scanline-overlay"
      data-ocid="stats.section"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="flex overflow-x-auto scrollbar-none gap-0 divide-x divide-white/10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex-shrink-0 flex flex-col items-center justify-center px-8 py-2 min-w-[140px]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`,
              }}
            >
              <p className="font-mono font-black text-2xl sm:text-3xl text-white tracking-tight">
                {stat.isText
                  ? stat.textVal
                  : stat.isDecimal
                    ? stat.value.toFixed(1) + stat.suffix
                    : stat.value + stat.suffix}
              </p>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mt-1 text-center">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CATEGORY CARDS ───
const CATEGORY_CARDS = [
  {
    id: "Industrial Plots" as Filter,
    icon: Building2,
    label: "Industrial Plots",
    desc: "Freehold & leasehold plots in all VKI sectors",
    count: PROPERTIES.filter((p) => p.category === "Industrial Plot").length,
    color: "group-hover:text-primary group-hover:border-primary",
  },
  {
    id: "Factory Spaces" as Filter,
    icon: Factory,
    label: "Factory Spaces",
    desc: "Ready sheds with power & loading infrastructure",
    count: PROPERTIES.filter((p) => p.category === "Factory Space").length,
    color: "group-hover:text-secondary group-hover:border-secondary",
  },
  {
    id: "Warehouse" as Filter,
    icon: Warehouse,
    label: "Warehouse Leasing",
    desc: "Modern storage from 5,000 to 12,000 sq ft",
    count: PROPERTIES.filter((p) => p.category === "Warehouse").length,
    color: "group-hover:text-accent group-hover:border-accent",
  },
  {
    id: "All" as Filter,
    icon: BarChart3,
    label: "Commercial Investment",
    desc: "High-return commercial plots on main VKI arterials",
    count: PROPERTIES.filter((p) => p.type === "Freehold").length,
    color: "group-hover:text-primary group-hover:border-primary",
  },
];

// ─── TESTIMONIALS DATA ───
const TESTIMONIALS = [
  {
    text: "Shree Real Estate got us a fair deal at VKI Sector B — no pressure, no hidden fees. Pure transparency.",
    author: "Rajesh K.",
    role: "Factory Owner, VKI",
    stars: 5,
  },
  {
    text: "I was looking for a warehouse for 6 months. Shree Real Estate found exactly what I needed in 2 weeks.",
    author: "Pradeep M.",
    role: "Logistics Director",
    stars: 5,
  },
  {
    text: "Professional handling from start to finish. They know VKI better than anyone in the market.",
    author: "Anil S.",
    role: "Industrial Investor",
    stars: 5,
  },
  {
    text: "Transparent process, no middlemen games. Best industrial broker in Jaipur by far.",
    author: "Suresh G.",
    role: "Manufacturing Unit Owner",
    stars: 5,
  },
];

export default function App() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [_priceFilter, setPriceFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto testimonial slider
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  function openProperty(property: Property) {
    setSelectedProperty(property);
    setModalOpen(true);
  }

  function scrollToProperties(filter?: Filter) {
    if (filter) setActiveFilter(filter);
    document
      .getElementById("properties")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  const filteredProperties = PROPERTIES.filter((p) => {
    if (activeFilter === "Lease / Rent" && p.type !== "Lease") return false;
    if (activeFilter !== "All" && activeFilter !== "Lease / Rent") {
      if (p.category !== filterMap[activeFilter]) return false;
    }
    if (typeFilter === "lease" && p.type !== "Lease") return false;
    if (typeFilter === "sale" && p.type !== "Freehold") return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── NAVBAR ─── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-card/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-card border-b border-border"
        }`}
        data-ocid="navbar"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <a
            href="#hero"
            className="flex items-center gap-3 min-w-0"
            data-ocid="navbar.logo_link"
          >
            <img
              src={LOGO_SRC}
              alt="Shree Real Estate Services Logo"
              className="w-12 h-12 object-contain rounded-sm flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="font-display font-bold text-primary text-sm sm:text-base leading-tight truncate">
                Shree Real Estate Services
              </p>
              <p className="text-muted-foreground text-xs truncate hidden sm:block">
                VKI Industrial Specialists · Jaipur
              </p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main">
            {["Properties", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold text-foreground/70 hover:text-primary link-underline transition-fast"
                data-ocid={`navbar.${item.toLowerCase()}_link`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={TEL_HREF}
              className="hidden sm:flex items-center gap-1.5 bg-primary text-primary-foreground text-xs sm:text-sm font-bold px-3 py-2 rounded-sm hover:opacity-90 btn-glow-primary transition-smooth"
              data-ocid="navbar.call_button"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Now
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs sm:text-sm font-bold px-3 py-2 rounded-sm hover:opacity-90 btn-glow-secondary transition-smooth"
              data-ocid="navbar.whatsapp_button"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">Chat</span>
            </a>
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-sm border border-border text-foreground/70 hover:text-primary transition-fast"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              data-ocid="navbar.mobile_menu_toggle"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {[
              { label: "Properties", href: "#properties" },
              { label: "About", href: "#why_us" },
              { label: "Contact", href: "#contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-2.5 text-sm font-semibold text-foreground/80 hover:text-primary transition-fast"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section
        id="hero"
        className="relative min-h-[94vh] flex flex-col justify-center overflow-hidden"
        data-ocid="hero.section"
      >
        {/* Ken Burns background */}
        <div
          className="absolute inset-0 hero-bg-zoom"
          style={{
            backgroundImage:
              "url('/assets/generated/vki-industrial-hero.dim_1200x600.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/65 to-primary/30" />

        {/* Floating data chips */}
        <div className="absolute top-24 right-8 hidden lg:flex flex-col gap-2 opacity-70">
          {["VKI Area", "Industrial Zone", "RIICO Approved"].map((chip, i) => (
            <span
              key={chip}
              className="font-mono text-xs text-white/80 bg-white/10 border border-white/20 px-3 py-1 rounded-sm backdrop-blur-sm"
              style={{
                animation: `fade-slide-up 0.6s ease ${0.8 + i * 0.2}s both`,
              }}
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 sm:py-24">
          <div className="max-w-2xl">
            {/* Badge row */}
            <div
              className="flex items-center gap-2 mb-5"
              style={{ animation: "fade-slide-up 0.6s ease 0.1s both" }}
            >
              <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wide">
                VKI Area Specialist
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-yellow-400/40 text-yellow-400/40"}`}
                  />
                ))}
                <span className="text-white/70 text-xs ml-1">
                  4.7 (25 reviews)
                </span>
              </div>
            </div>

            <h1
              className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-5"
              style={{ animation: "fade-slide-up 0.65s ease 0.25s both" }}
            >
              Industrial Properties That{" "}
              <span className="text-primary/90">Power Your Business</span>
            </h1>

            <p
              className="text-white/75 text-base sm:text-lg leading-relaxed mb-8 max-w-xl"
              style={{ animation: "fade-slide-up 0.65s ease 0.45s both" }}
            >
              Specialists in VKI industrial plots, factory spaces, and lease
              deals. Transparent. Direct. Proven.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 mb-8"
              style={{ animation: "fade-slide-up 0.65s ease 0.6s both" }}
            >
              <a
                href="#properties"
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-base px-7 py-4 rounded-sm hover:scale-[1.02] btn-glow-primary transition-smooth shadow-lg animate-pulse-glow"
                data-ocid="hero.properties_button"
              >
                <Search className="w-5 h-5" />
                Get Available Properties
              </a>
              <a
                href={TEL_HREF}
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/25 font-bold text-base px-7 py-4 rounded-sm hover:bg-white/20 hover:scale-[1.02] transition-smooth"
                data-ocid="hero.call_button"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>

            {/* Trust badges */}
            <div
              className="flex flex-wrap gap-2.5"
              style={{ animation: "fade-slide-up 0.65s ease 0.75s both" }}
            >
              {[
                { icon: "✔", label: "VKI Specialist" },
                { icon: "✔", label: "Transparent Deals" },
                { icon: "✔", label: "Verified Listings" },
              ].map((badge, i) => (
                <span
                  key={badge.label}
                  className="text-white/90 bg-white/10 border border-white/20 text-xs font-semibold px-3 py-1.5 rounded-sm backdrop-blur-sm"
                  style={{ animationDelay: `${0.85 + i * 0.12}s` }}
                >
                  {badge.icon} {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-white/70 text-xs font-mono tracking-widest uppercase">
            Scroll
          </span>
          <ChevronDown className="w-5 h-5 text-white animate-bounce-y" />
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <StatsStrip />

      {/* ─── CATEGORY CARDS ─── */}
      <section
        id="about"
        className="bg-muted/30 py-12 sm:py-16 border-b border-border"
        data-ocid="categories.section"
      >
        <div className="max-w-6xl mx-auto px-4">
          <SectionReveal>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Property Categories
            </p>
            <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl mb-8">
              What Are You Looking For?
            </h2>
          </SectionReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORY_CARDS.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <SectionReveal key={cat.label} delay={i * 80}>
                  <button
                    type="button"
                    onClick={() => scrollToProperties(cat.id)}
                    className={`group w-full text-left bg-card border border-border rounded-sm p-5 card-hover hover:border-primary/40 ${cat.color} flex flex-col gap-3`}
                    data-ocid={`categories.${cat.label.toLowerCase().replace(/\s+/g, "_")}.button`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 bg-primary/8 rounded-sm flex items-center justify-center group-hover:bg-primary/15 transition-smooth">
                        <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-smooth" />
                      </div>
                      <span className="font-mono text-xs bg-muted border border-border px-2 py-0.5 rounded-sm text-muted-foreground">
                        {cat.count} listings
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-smooth">
                        {cat.label}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-primary/70 group-hover:text-primary flex items-center gap-1 transition-smooth">
                      Explore →
                    </span>
                  </button>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── QUICK FILTER BAR ─── */}
      <section
        className="bg-primary py-5 border-b border-primary/60"
        data-ocid="filters.section"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">
              Filter Properties
            </p>
            <span className="text-primary-foreground/50 text-xs font-mono">
              Showing {filteredProperties.length} propert
              {filteredProperties.length !== 1 ? "ies" : "y"}
            </span>
          </div>
          {/* Type tabs */}
          <div className="flex flex-wrap gap-2 mb-3">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setActiveFilter(filter);
                  scrollToProperties();
                }}
                className={`font-bold text-sm px-4 py-2 rounded-sm transition-smooth border relative ${
                  activeFilter === filter
                    ? "bg-secondary text-secondary-foreground border-secondary/60 filter-active"
                    : "bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20"
                }`}
                data-ocid={`filters.${filter.toLowerCase().replace(/\s+/g, "_").replace("/", "")}.tab`}
              >
                {filter}
              </button>
            ))}
          </div>
          {/* Chip filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All Types", val: null, key: "type" },
              { label: "Lease Only", val: "lease", key: "type" },
              { label: "Sale / Freehold", val: "sale", key: "type" },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setTypeFilter(chip.val)}
                className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-smooth ${
                  typeFilter === chip.val
                    ? "bg-white text-primary border-white font-bold"
                    : "bg-white/5 text-primary-foreground/70 border-white/15 hover:bg-white/10"
                }`}
                data-ocid={`filters.${chip.label.toLowerCase().replace(/\s+/g, "_").replace("/", "")}.chip`}
              >
                {chip.label}
                {typeFilter === chip.val && chip.val !== null && (
                  <span className="text-primary ml-1">×</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section
        id="properties"
        className="bg-background py-14 sm:py-16"
        data-ocid="properties.section"
      >
        <div className="max-w-6xl mx-auto px-4">
          <SectionReveal className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              VKI Area Properties
            </p>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl">
                Featured Properties
              </h2>
              <span className="font-mono text-sm text-muted-foreground bg-muted border border-border px-3 py-1 rounded-sm">
                {filteredProperties.length} results
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              Click on any property card to view full details, specifications,
              and contact options.
            </p>
          </SectionReveal>
          {filteredProperties.length === 0 ? (
            <div
              className="text-center py-16 border border-dashed border-border rounded-sm"
              data-ocid="properties.empty_state"
            >
              <p className="text-muted-foreground">
                No properties found for the selected filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("All");
                  setPriceFilter(null);
                  setTypeFilter(null);
                }}
                className="mt-3 text-primary font-semibold text-sm underline hover:no-underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              data-ocid="properties.list"
            >
              {filteredProperties.map((property, i) => (
                <SectionReveal key={property.id} delay={i * 60}>
                  <PropertyCard
                    property={property}
                    index={i}
                    onOpenDetail={openProperty}
                  />
                </SectionReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section
        id="why_us"
        className="bg-muted/40 border-y border-border py-14 sm:py-16"
        data-ocid="why_us.section"
      >
        <div className="max-w-6xl mx-auto px-4">
          <SectionReveal>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Trust & Expertise
            </p>
            <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl mb-8">
              Why Choose Us
            </h2>
          </SectionReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Award,
                title: "Deep VKI Market Knowledge",
                desc: "15+ years focused exclusively on VKI industrial zone. We know every sector, plot, and property deal in the area.",
              },
              {
                icon: Shield,
                title: "Transparent Deal Process",
                desc: "No hidden charges, clear documentation, and fair valuations. What you see is what you get.",
              },
              {
                icon: Users,
                title: "Strong Local Network",
                desc: "Direct connections with factory owners, developers, and investors across VKI and Jaipur.",
              },
              {
                icon: TrendingUp,
                title: "Professional Execution",
                desc: "End-to-end support from site visit to deal closure. We guide you through every step.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <SectionReveal key={title} delay={i * 90}>
                <div
                  className="group bg-card border border-border border-l-4 border-l-primary/40 rounded-sm p-5 card-hover hover:border-l-primary"
                  data-ocid={`why_us.item.${i + 1}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-primary/10 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-smooth">
                      <Icon className="w-5 h-5 text-primary group-hover:text-secondary group-hover:scale-110 transition-smooth" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground text-base mb-2">
                        {title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS TIMELINE ─── */}
      <section
        className="bg-background py-14 sm:py-16"
        data-ocid="process.section"
      >
        <div className="max-w-6xl mx-auto px-4">
          <SectionReveal>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Simple Steps
            </p>
            <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl mb-10">
              How We Work
            </h2>
          </SectionReveal>

          {/* Horizontal timeline desktop */}
          <div className="hidden lg:block relative">
            <ProcessTimeline />
          </div>
          {/* Vertical timeline mobile */}
          <div className="lg:hidden space-y-4">
            {PROCESS_STEPS.map((step, i) => (
              <SectionReveal key={step.step} delay={i * 80}>
                <div
                  className="flex gap-4 relative"
                  data-ocid={`process.item.${i + 1}`}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-mono font-black text-primary-foreground text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    {i < PROCESS_STEPS.length - 1 && (
                      <div className="w-0.5 bg-border flex-1 mt-2 mb-0 min-h-[40px]" />
                    )}
                  </div>
                  <div className="bg-card border border-border rounded-sm p-4 flex-1 mb-2">
                    <h3 className="font-display font-bold text-foreground text-base mb-1">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section
        className="bg-muted/40 border-y border-border py-14 sm:py-16"
        data-ocid="testimonials.section"
      >
        <div className="max-w-6xl mx-auto px-4">
          <SectionReveal>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Client Reviews
            </p>
            <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl mb-8">
              What Our Clients Say
            </h2>
          </SectionReveal>

          <div className="relative overflow-hidden">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.author}
                className={`transition-all duration-500 ${
                  i === testimonialIndex
                    ? "opacity-100"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <div className="max-w-2xl mx-auto bg-card border border-border rounded-sm p-8 shadow-sm relative">
                  {/* Decorative quote mark */}
                  <span className="absolute top-4 left-6 font-display text-6xl text-primary/12 leading-none select-none font-black">
                    "
                  </span>
                  <div className="relative">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= t.stars ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
                        />
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground font-mono">
                        {t.stars}.0
                      </span>
                    </div>
                    <p className="text-foreground/80 text-base sm:text-lg leading-relaxed mb-6 italic">
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-3 border-t border-border pt-4">
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary text-sm">
                          {t.author[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">
                          {t.author}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.author}
                type="button"
                onClick={() => setTestimonialIndex(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === testimonialIndex
                    ? "w-6 h-2 bg-primary"
                    : "w-2 h-2 bg-border hover:bg-muted-foreground"
                }`}
                data-ocid={`testimonials.dot.${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── STRONG CTA ─── */}
      <section
        className="relative bg-primary py-16 sm:py-20 overflow-hidden diagonal-pattern"
        data-ocid="cta.section"
      >
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          {/* Urgency tag */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="flex items-center gap-2 bg-white/10 border border-white/25 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-blink-dot" />
              Available Now
            </span>
          </div>
          <h2 className="font-display font-black text-primary-foreground text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
            Looking for Industrial Property in VKI?
          </h2>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-sm mb-8">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span className="text-white/90 font-semibold text-sm">
              Direct deals. No confusion.
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={TEL_HREF}
              className="flex items-center justify-center gap-2 bg-card text-primary font-bold text-base px-8 py-4 rounded-sm hover:opacity-90 hover:scale-[1.02] transition-smooth shadow-lg"
              data-ocid="cta.call_button"
            >
              <Phone className="w-5 h-5" /> Call Now
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-bold text-base px-8 py-4 rounded-sm hover:opacity-90 hover:scale-[1.02] transition-smooth shadow-lg"
              data-ocid="cta.whatsapp_button"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp Now
            </a>
          </div>
        </div>
      </section>

      {/* ─── CONTACT + MAP ─── */}
      <section
        id="contact"
        className="bg-background py-14 sm:py-16"
        data-ocid="contact.section"
      >
        <div className="max-w-6xl mx-auto px-4">
          <SectionReveal>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Get In Touch
            </p>
            <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl mb-8">
              Contact Us
            </h2>
          </SectionReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <SectionReveal>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-sm p-5 card-hover hover:border-primary/30">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                        Phone / WhatsApp
                      </p>
                      <a
                        href={TEL_HREF}
                        className="font-mono font-bold text-lg text-primary hover:underline"
                        data-ocid="contact.phone_link"
                      >
                        {PHONE}
                      </a>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Call or WhatsApp anytime
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-sm p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                        Address
                      </p>
                      <p className="font-semibold text-foreground text-sm leading-snug">
                        F-89, Road No. 6, VKI Area,
                        <br />
                        Jaipur – 302012, Rajasthan
                      </p>
                      <span className="inline-flex items-center gap-1 mt-2 text-xs font-mono bg-primary/8 text-primary border border-primary/20 px-2 py-0.5 rounded-sm">
                        <MapPin className="w-3 h-3" />
                        VKI Industrial Area, Jaipur
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-sm p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                        Business Hours
                      </p>
                      <p className="font-semibold text-foreground text-sm">
                        Mon – Sat
                      </p>
                      <p className="text-muted-foreground text-sm">
                        9:00 AM – 7:00 PM
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href={TEL_HREF}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-sm hover:opacity-90 btn-glow-primary transition-smooth"
                    data-ocid="contact.call_button"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                  <a
                    href={WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-bold text-sm py-3.5 rounded-sm hover:opacity-90 btn-glow-secondary transition-smooth"
                    data-ocid="contact.whatsapp_button"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </SectionReveal>

            {/* Google Map */}
            <SectionReveal delay={100}>
              <div className="relative bg-card border border-border rounded-sm overflow-hidden h-80 lg:h-auto min-h-[380px] shadow-sm">
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border px-3 py-1.5 rounded-sm shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-xs font-semibold text-foreground">
                    VKI Industrial Area, Jaipur
                  </span>
                </div>
                <iframe
                  title="VKI Area, Jaipur Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3556.0241657!2d75.7747!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5c1a7f2c6e7%3A0x8e1ddc5b5e1d7c5f!2sVishwakarma%20Industrial%20Area%2C%20Jaipur!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  className="w-full h-full min-h-[380px]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="bg-card border-t border-border py-8"
        data-ocid="footer"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={LOGO_SRC}
                alt="Logo"
                className="w-10 h-10 object-contain rounded-sm flex-shrink-0"
              />
              <div>
                <p className="font-display font-bold text-primary text-sm">
                  Shree Real Estate Services
                </p>
                <p className="text-muted-foreground text-xs">
                  Trusted for Transparent & Fair Property Deals
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>F-89, Road No. 6, VKI Area, Jaipur – 302012</p>
              <a
                href={TEL_HREF}
                className="hover:text-primary link-underline transition-smooth block"
              >
                {PHONE}
              </a>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Shree Real Estate Services. All
              rights reserved.
            </p>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary link-underline transition-smooth"
            >
              Built with love using caffeine.ai
            </a>
          </div>
        </div>
      </footer>

      {/* ─── STICKY MOBILE BAR ─── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex border-t border-border shadow-lg h-[60px]"
        data-ocid="mobile_bar"
      >
        <a
          href={TEL_HREF}
          aria-label="Call Now"
          className="flex-1 flex items-center justify-center bg-primary text-primary-foreground hover:opacity-90 transition-smooth"
          data-ocid="mobile_bar.call_button"
        >
          <Phone className="w-6 h-6" aria-hidden="true" />
        </a>
        <div className="w-px bg-primary-foreground/20" />
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Inquiry"
          className="flex-1 flex items-center justify-center bg-secondary text-secondary-foreground hover:opacity-90 transition-smooth"
          data-ocid="mobile_bar.whatsapp_button"
        >
          <MessageCircle className="w-6 h-6" aria-hidden="true" />
        </a>
      </div>

      {/* ─── FLOATING ACTION BUTTONS (Desktop) ─── */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col gap-3">
        <a
          href={TEL_HREF}
          aria-label="Call Now"
          className="group flex items-center justify-end gap-2 overflow-hidden animate-pulse-glow-green"
          data-ocid="fab.call_button"
        >
          <span className="max-w-0 group-hover:max-w-[120px] overflow-hidden transition-all duration-300 whitespace-nowrap text-xs font-bold bg-primary text-primary-foreground px-3 py-2 rounded-sm opacity-0 group-hover:opacity-100">
            Call Now
          </span>
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-smooth">
            <Phone className="w-5 h-5" aria-hidden="true" />
          </div>
        </a>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Inquiry"
          className="group flex items-center justify-end gap-2 overflow-hidden"
          data-ocid="fab.whatsapp_button"
        >
          <span className="max-w-0 group-hover:max-w-[120px] overflow-hidden transition-all duration-300 whitespace-nowrap text-xs font-bold bg-secondary text-secondary-foreground px-3 py-2 rounded-sm opacity-0 group-hover:opacity-100">
            WhatsApp
          </span>
          <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-smooth">
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
          </div>
        </a>
      </div>

      {/* ─── PROPERTY DETAIL MODAL ─── */}
      <PropertyModal
        property={selectedProperty}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

// ─── PROCESS DATA ───
const PROCESS_STEPS = [
  {
    step: "01",
    title: "Requirement Analysis",
    desc: "Tell us your exact need — size, budget, type, and preferred sector.",
    icon: "MessageSquare",
  },
  {
    step: "02",
    title: "Property Matching",
    desc: "We shortlist verified properties matching your requirements.",
    icon: "Search",
  },
  {
    step: "03",
    title: "Site Visit",
    desc: "We schedule and accompany you on site visits at your convenience.",
    icon: "MapPin",
  },
  {
    step: "04",
    title: "Deal Closure",
    desc: "We handle documentation, negotiation, and deal completion end-to-end.",
    icon: "CheckCircle",
  },
];

function ProcessTimeline() {
  const { ref, visible } = useScrollVisible(0.3);

  return (
    <div ref={ref} data-ocid="process.timeline" className="relative">
      {/* Connecting line */}
      <div className="absolute top-5 left-[5%] right-[5%] h-0.5 bg-border z-0">
        <div
          className="h-full bg-primary transition-all duration-[1.2s] ease-out"
          style={{ width: visible ? "100%" : "0%" }}
        />
      </div>
      <div className="grid grid-cols-4 gap-4 relative z-10">
        {PROCESS_STEPS.map((step, i) => (
          <div
            key={step.step}
            className="flex flex-col items-center text-center"
            data-ocid={`process.item.${i + 1}`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.8)",
              transition: `opacity 0.4s ease ${i * 0.2}s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.2}s`,
            }}
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-mono font-black text-primary-foreground text-sm mb-4 shadow-sm">
              {step.step}
            </div>
            <h3 className="font-display font-bold text-foreground text-sm mb-2">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
