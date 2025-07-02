// app/landing/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Lightbulb, Target } from "lucide-react";
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

  /* animated counters */
  useEffect(() => {
    let inv = 0,
      ass = 0,
      sat = 0;
    const interval = setInterval(() => {
      if (inv < 10000) setInvestors((p) => p + 250);
      if (ass < 5_000_000) setAssets((p) => p + 150_000);
      if (sat < 99) setSatisfaction((p) => p + 1);
      inv += 250;
      ass += 150_000;
      sat += 1;
      if (inv >= 10000 && ass >= 5_000_000 && sat >= 99) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f5f3f1] text-[#3e362e]">
        {/* ─────────────────────  HERO  ───────────────────── */}
        <section className="relative overflow-hidden py-20 sm:py-24 px-4 sm:px-8 md:px-16 text-white">
          {/* BG image & overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-bg.jpg')" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(62,54,46,0.95) 30%, rgba(62,54,46,0.3))",
            }}
          />

          {/* content */}
          <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-y-10">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.h2
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-extrabold mb-6 leading-tight text-[40px] xs:text-[48px] sm:text-[56px] md:text-[64px] lg:text-[72px]"
              >
                <span className="text-[#ac8968]">Smart Investments</span>,<br />
                <span className="text-[#a69080]">Real Assets</span>
              </motion.h2>

              <p className="mb-8 max-w-xl text-lg sm:text-xl text-[#93785b]">
                Discover{" "}
                <span className="font-semibold text-[#ac8968]">
                  high‑return equity packages
                </span>{" "}
                in <span className="font-semibold text-[#ac8968]">trading</span>{" "}
                and <span className="font-semibold text-[#ac8968]">long‑term ventures</span>.
              </p>

              <div className="mb-12 flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Button
                  size="lg"
                  className="flex-1 bg-[#865d36] hover:bg-[#93785b] text-lg py-6"
                >
                  Browse Packages
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-[#a69080] text-[#a69080] hover:bg-[#a69080] hover:text-[#3e362e] text-lg py-6"
                >
                  How It Works
                </Button>
              </div>

              {/* metrics */}
              <div className="flex flex-col xs:flex-row xs:justify-between sm:gap-8 text-[#a69080] text-lg font-semibold">
                <Metric
                  value={`${investors.toLocaleString()}+`}
                  label="Trusted Investors"
                />
                <Divider />
                <Metric
                  value={`$${(assets / 1_000_000).toFixed(1)}M+`}
                  label="Total Assets Managed"
                />
                <Divider />
                <Metric value={`${satisfaction}%`} label="User Satisfaction" />
              </div>
            </div>
            {/* column spacer for potential hero illustration (optional) */}
          </div>
        </section>

        {/* ─────────────────────  WHY CHOOSE US  ───────────────────── */}
        <section id="why-choose-us" className="bg-[#a69080] py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.img
              src="/why-choose-us.png"
              alt="Why Choose Us"
              className="w-full rounded-2xl shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            />

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <HeaderChip>Why Choose Us</HeaderChip>

              <h3 className="mb-4 text-2xl sm:text-3xl font-bold">
                Invest With Confidence
              </h3>
              <p className="mb-6 text-[#3e362e]/90 leading-relaxed">
                At Al Ashraf Holdings, we provide safe, profitable, and
                transparent investment opportunities backed by real assets and
                daily performance updates.
              </p>

              <ul className="mb-6 space-y-3">
                {[
                  "Real asset‑backed equity packages",
                  "Transparent profit tracking",
                  "Flexible withdrawal anytime",
                  "No depreciation on value",
                ].map((point) => (
                  <li key={point} className="flex items-start text-[#3e362e]">
                    <span className="mt-1 mr-3 h-3 w-3 rounded-full bg-[#865d36]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <Button className="bg-[#865d36] hover:bg-[#93785b]">
                Explore Investment Options
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ─────────────────────  OUR VISION  ───────────────────── */}
        <section id="our-vision" className="bg-[#93785b] py-16 px-4 sm:px-6">
          <div className="mx-auto max-w-6xl text-center">
            <div className="mb-2 flex items-center justify-center gap-4 text-[#3e362e] font-medium">
              <Lightbulb className="h-5 w-5" />
              <span>Our Vision</span>
              <Target className="h-5 w-5" />
            </div>

            <h3 className="mb-4 text-2xl sm:text-3xl font-bold">
              Empowering Investments with Real Impact
            </h3>
            <p className="mx-auto mb-12 max-w-2xl text-[#3e362e]/90 leading-relaxed">
              We aim to create wealth‑building opportunities by combining
              transparency, sustainability, and growth‑focused equity models
              accessible to everyone.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Sustainable Growth", Icon: Lightbulb },
                { title: "Asset Security", Icon: Target },
                { title: "Transparency First", Icon: ArrowRight },
                { title: "Daily Insights", Icon: Lightbulb },
              ].map(({ title, Icon }, i) => (
                <motion.div
                  key={title}
                  className="rounded-xl bg-[#a69080] p-6 text-center shadow hover:shadow-lg transition"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Icon className="mx-auto mb-4 h-8 w-8 text-[#3e362e]" />
                  <h4 className="font-semibold text-[#3e362e]">{title}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────  PACKAGE CATEGORIES  ───────────────────── */}
        <section id="packages" className="bg-[#ac8968] py-16 px-4 sm:px-6">
          <h3 className="text-center text-2xl sm:text-3xl font-semibold mb-10">
            Explore Our Packages
          </h3>

          <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Trading Packages",
                description: "Poultry, dairy, fruits & vegetables, and more.",
                url: "/trading-packages",
              },
              {
                title: "Long‑Term Rental",
                description:
                  "Fixed monthly returns from industrial sheds & yards.",
                url: "/trading-packages",
              },
              {
                title: "Long‑Term Industry",
                description:
                  "Invest in processing plants and properties for higher growth.",
                url: "/trading-packages",
              },
            ].map((pkg) => (
              <Card
                key={pkg.title}
                className="border-[#93785b] bg-[#a69080] hover:shadow-xl transition"
              >
                <CardContent className="p-6">
                  <h4 className="mb-2 text-xl font-bold">{pkg.title}</h4>
                  <p className="mb-4 text-sm text-[#3e362e]/90">
                    {pkg.description}
                  </p>
                  <Button variant="link" className="p-0 text-[#865d36]">
                    <Link href={pkg.url} scroll>
                      View Packages <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Actual package components */}
        <IndustryPackage />
        <RentalPackage />
        <TradingPackage />

        {/* ─────────────────────  HOW IT WORKS  ───────────────────── */}
        <section id="how-it-works" className="bg-[#3e362e] py-20 px-4 sm:px-6">
          <h3 className="mb-12 text-center text-2xl sm:text-3xl font-semibold text-[#a69080]">
            How It Works
          </h3>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((step, i) => (
              <motion.div key={step} variants={item}>
                <Card className="rounded-2xl border-[#93785b] bg-[#a69080] shadow-lg transition-transform hover:scale-[1.03] duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#865d36] to-[#3e362e] text-lg font-bold text-white shadow-md">
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium text-[#3e362e]">
                      {step}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─────────────────────  FAQ  ───────────────────── */}
        <section id="faq" className="bg-[#93785b] py-16 px-4 sm:px-6">
          <h3 className="mb-10 text-center text-2xl sm:text-3xl font-semibold">
            Frequently Asked Questions
          </h3>

          <Accordion
            type="single"
            collapsible
            className="mx-auto max-w-3xl text-[#3e362e]"
          >
            {[
              {
                q: "What are equity units?",
                a: "Equity units represent your share of investment in a selected package. Each unit has a defined value and contributes to your returns.",
              },
              {
                q: "When can I withdraw profits?",
                a: "For trading packages, you can withdraw anytime. For others, returns are distributed monthly or on exit.",
              },
              {
                q: "Is there a minimum investment?",
                a: "Yes, the minimum is typically 1 equity unit, but it may vary by package.",
              },
            ].map(({ q, a }) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="hover:text-[#865d36]">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-[#3e362e]/90">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ───────────────────────── helpers ───────────────────────── */
const Metric = ({ value, label }: { value: string; label: string }) => (
  <div className="mb-4 xs:mb-0 flex flex-col items-start xs:items-center">
    <span className="text-3xl xs:text-4xl font-bold text-[#ac8968]">
      {value}
    </span>
    <span className="text-xs xs:text-sm sm:text-base">{label}</span>
  </div>
);

const Divider = () => (
  <div className="hidden xs:block h-8 w-px bg-[#93785b]" />
);

const HeaderChip = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#3e362e]/10 px-3 py-1 text-sm font-medium text-[#3e362e]">
    <ArrowRight className="h-4 w-4 text-[#3e362e]" />
    {children}
  </div>
);
