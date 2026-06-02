"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  CustomAccordion, 
  CustomAccordionItem, 
  CustomAccordionTrigger, 
  CustomAccordionContent 
} from "@/components/custom/CustomAccordion";
import { ArrowRight, Lightbulb, Target, Shield, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import IndustryPackage from "@/app/components/packages/IndustryPackage";
import RentalPackage from "@/app/components/packages/RentalPackage";
import TradingPackage from "@/app/components/packages/TradingPackage";
import Header from "@/app/components/header/component";
import Footer from "@/app/components/footer/component";

const steps = [
  "Browse & Choose a Package",
  "Invest Using Equity Units",
  "Track Returns via Dashboard",
  "Withdraw Profits or Reinvest",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const [investors, setInvestors] = useState(0);
  const [assets, setAssets] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [activePackageTab, setActivePackageTab] = useState<"trading" | "rental" | "industry">("trading");

  /* animated counters */
  useEffect(() => {
    let inv = 0,
      ass = 0,
      sat = 0;
    const interval = setInterval(() => {
      if (inv < 10000) setInvestors((p) => Math.min(10000, p + 250));
      if (ass < 5_000_000) setAssets((p) => Math.min(5000000, p + 150000));
      if (sat < 99) setSatisfaction((p) => Math.min(99, p + 2));
      inv += 250;
      ass += 150000;
      sat += 2;
      if (inv >= 10000 && ass >= 5000000 && sat >= 99) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden pt-16">
        {/* Ambient glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-glow-emerald pointer-events-none opacity-30" />
        <div className="absolute top-80 right-1/4 w-96 h-96 rounded-full bg-glow-gold pointer-events-none opacity-20" />

        {/* ─────────────────────  HERO  ───────────────────── */}
        <section className="relative min-h-[90vh] flex items-center py-20 px-6 md:px-16 text-white">
          {/* BG image & overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-bg.jpg')" }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"
          />

          {/* content */}
          <div className="relative z-10 mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-y-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-accent text-glow-gold"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ethical & Halal Certified Investments
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-extrabold leading-tight text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight"
              >
                <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">Smart Investments</span>,<br />
                <span className="bg-gradient-to-r from-accent to-amber-300 bg-clip-text text-transparent">Real Tangible Assets</span>
              </motion.h2>

              <p className="max-w-xl text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed">
                Discover high-return, sharia-compliant equity packages backed by real assets in trading, rentals, and long-term ventures.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-4">
                <Link
                  href="/our-packages"
                  className="flex-1 text-center bg-gradient-to-r from-primary to-emerald-600 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
                >
                  Browse Packages
                </Link>
                <a
                  href="#how-it-works"
                  className="flex-1 text-center bg-white/5 hover:bg-white/10 text-foreground font-bold px-6 py-4 rounded-2xl border border-white/10 transition-all duration-300 hover:scale-[1.02]"
                >
                  How It Works
                </a>
              </div>

              {/* metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-8 text-slate-400 pt-10">
                <Metric value={`${investors.toLocaleString()}+`} label="Trusted Investors" />
                <div className="hidden sm:block h-8 w-px bg-white/10" />
                <Metric value={`$${(assets / 1000000).toFixed(1)}M+`} label="Total Assets Managed" />
                <div className="hidden sm:block h-8 w-px bg-white/10" />
                <Metric value={`${satisfaction}%`} label="User Satisfaction" />
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────  WHY CHOOSE US  ───────────────────── */}
        <section id="why-choose-us" className="py-24 px-6 md:px-12 bg-slate-900/40 relative border-y border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/5 h-96 lg:h-[450px]"
            >
              <img
                src="/why-choose-us.png"
                alt="Why Choose Us"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary text-glow-emerald">
                Why Choose Us
              </div>

              <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                Invest With Asset-Backed Confidence
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                At Al Ashraf Holdings, we build wealth-building pathways designed with safety, transparency, and sharia compatibility. All packages are supported by physical property, livestock, and real asset ownership.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Real asset-backed equity packages",
                  "Transparent profit tracking",
                  "Flexible withdrawal structure",
                  "No depreciation on core equity",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 text-glow-emerald" />
                    <span className="text-sm text-foreground">{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/our-packages"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-emerald-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-primary/10 hover:opacity-90 transition-all duration-300"
                >
                  Explore Investment Options <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─────────────────────  OUR VISION  ───────────────────── */}
        <section id="our-vision" className="py-24 px-6 md:px-12 relative">
          <div className="max-w-6xl mx-auto text-center space-y-4 mb-16">
            <div className="flex items-center justify-center gap-2 text-accent font-semibold text-sm text-glow-gold">
              <Lightbulb className="h-5 w-5" />
              <span>Our Vision</span>
              <Target className="h-5 w-5" />
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
              Empowering Investments with Real Impact
            </h3>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We aim to create halal, wealth-building opportunities by combining technology, complete operational transparency, and physical assets globally accessible to everyone.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Sustainable Growth", desc: "Eco-friendly, long-term yield packages.", Icon: Lightbulb },
              { title: "Asset Security", desc: "Backed by deeds, leases, and contracts.", Icon: Target },
              { title: "Halal Transparency", desc: "No interest, speculative margins, or hidden fees.", Icon: Shield },
              { title: "Daily Analytics", desc: "Track returns real-time via user console.", Icon: TrendingUp },
            ].map(({ title, desc, Icon }, i) => (
              <motion.div
                key={title}
                className="rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-xl p-6 text-center space-y-3 hover:border-primary/20 hover:bg-slate-900/60 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="mx-auto h-12 w-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-lg text-foreground">{title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─────────────────────  PACKAGE CATEGORIES  ───────────────────── */}
        <section id="packages" className="py-24 px-6 md:px-12 bg-slate-900/40 relative border-t border-white/5">
          <div className="max-w-6xl mx-auto text-center space-y-4 mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
              Explore Our Investment Portfolios
            </h3>
            <p className="mx-auto max-w-2xl text-muted-foreground text-sm sm:text-base">
              Choose an asset category tailored to your timeline, return expectations, and investment scope.
            </p>

            {/* Custom Tab Switcher for Packages */}
            <div className="flex justify-center pt-6">
              <div className="inline-flex p-1.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                {[
                  { id: "trading", label: "Trading Packages" },
                  { id: "rental", label: "Long-Term Rental" },
                  { id: "industry", label: "Long-Term Industry" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePackageTab(tab.id as "trading" | "rental" | "industry")}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      activePackageTab === tab.id
                        ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary border border-primary/25 border-glow-emerald"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Render Active Packages with dynamic tabs */}
          <div className="max-w-7xl mx-auto">
            {activePackageTab === "trading" && <TradingPackage />}
            {activePackageTab === "rental" && <RentalPackage />}
            {activePackageTab === "industry" && <IndustryPackage />}
          </div>
        </section>

        {/* ─────────────────────  HOW IT WORKS  ───────────────────── */}
        <section id="how-it-works" className="py-24 px-6 md:px-12 border-t border-white/5 relative">
          <div className="max-w-6xl mx-auto text-center space-y-4 mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
              Simple Stepped Process
            </h3>
            <p className="text-muted-foreground">Four steps to initialize your ethical investment journey.</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((step, i) => (
              <motion.div key={step} variants={item}>
                <div className="relative rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-xl p-8 text-center space-y-4 hover:border-primary/20 hover:bg-slate-900/60 transition-all duration-300">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-emerald-600 text-lg font-bold text-white shadow-lg shadow-primary/20">
                    {i + 1}
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {step}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─────────────────────  FAQ  ───────────────────── */}
        <section id="faq" className="py-24 px-6 md:px-12 bg-slate-900/40 border-t border-white/5 relative">
          <div className="max-w-6xl mx-auto text-center space-y-4 mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </h3>
            <p className="text-muted-foreground">Clear insights to help you make informed decisions.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <CustomAccordion>
              {[
                {
                  q: "What are equity units?",
                  a: "Equity units represent your shared investment stake in a selected package. Each unit corresponds to a physical asset valuation and earns returns relative to that asset's trading yields or lease dividends.",
                },
                {
                  q: "When can I withdraw my profits?",
                  a: "For trading packages, yields are updated frequently and can be withdrawn at any time. For rental or industrial packages, dividends are distributed monthly, or on maturity/exit terms.",
                },
                {
                  q: "Is there a minimum investment limit?",
                  a: "Yes, the entry threshold is typically 1 equity unit. The unit cost varies depending on the specific asset class and package details.",
                },
              ].map(({ q, a }, idx) => (
                <CustomAccordionItem key={idx} value={`faq-${idx}`}>
                  <CustomAccordionTrigger value={`faq-${idx}`}>
                    {q}
                  </CustomAccordionTrigger>
                  <CustomAccordionContent value={`faq-${idx}`}>
                    {a}
                  </CustomAccordionContent>
                </CustomAccordionItem>
              ))}
            </CustomAccordion>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ───────────────────────── helpers ───────────────────────── */
const Metric = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-start">
    <span className="text-4xl font-extrabold text-primary text-glow-emerald">
      {value}
    </span>
    <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 mt-1">{label}</span>
  </div>
);
