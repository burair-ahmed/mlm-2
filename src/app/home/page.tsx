"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Target } from "lucide-react";
import Link from "next/link";
import IndustryPackage from "../components/packages/IndustryPackage";
import RentalPackage from "../components/packages/RentalPackage";
import TradingPackage from "../components/packages/TradingPackage";
import Header from "../components/header/component";
import Footer from "../components/footer/component";

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
    transition: {
      staggerChildren: 0.2,
    },
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

  useEffect(() => {
    let inv = 0;
    let ass = 0;
    let sat = 0;

    const interval = setInterval(() => {
      if (inv < 10000) setInvestors((prev) => prev + 250);
      if (ass < 5000000) setAssets((prev) => prev + 150000);
      if (sat < 99) setSatisfaction((prev) => prev + 1);

      inv += 250;
      ass += 150000;
      sat += 1;

      if (inv >= 10000 && ass >= 5000000 && sat >= 99) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-[#f5f3f1] text-[#3e362e]">
      {/* Header */}
      {/* <header className="flex items-center justify-between px-6 py-4 bg-[#3e362e] text-[#a69080] shadow-md">
        <h1 className="text-xl font-bold">Al Ashraf Holdings</h1>
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#packages" className="hover:text-[#ac8968]">Packages</a>
          <a href="#how-it-works" className="hover:text-[#ac8968]">How It Works</a>
          <a href="#faq" className="hover:text-[#ac8968]">FAQ</a>
          <a href="/user" className="hover:text-[#ac8968]">Dashboard</a>
        </nav>
        <Button className="text-sm bg-[#865d36] hover:bg-[#93785b]">Get Started</Button>
      </header> */}

      {/* Hero Section */}
      <section className="relative py-24 px-6 md:px-16 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')", zIndex: 0 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(62,54,46,0.95) 30%, rgba(62,54,46,0.3))",
            zIndex: 1,
          }}
        />

        <div className="flex justify-center">
          <div className="grid grid-cols-12 w-[80%]">
            <div className="col-span-6 relative z-10 text-left">
              <motion.h2
                className="text-[72px] leading-tight font-extrabold mb-6"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[#ac8968]">Smart Investments</span>, <br />
                <span className="text-[#a69080]">Real Assets</span>
              </motion.h2>

              <p className="text-2xl max-w-2xl mb-8 text-[#93785b]">
                Discover <span className="font-semibold text-[#ac8968]">high-return equity packages</span> in{" "}
                <span className="font-semibold text-[#ac8968]">trading</span> and{" "}
                <span className="font-semibold text-[#ac8968]">long-term ventures</span>.
              </p>

              <div className="flex gap-4 mb-12">
                <Button size="lg" className="text-lg px-8 py-6 bg-[#865d36] hover:bg-[#93785b]">
                  Browse Packages
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 border-[#a69080] text-[#a69080] hover:bg-[#a69080] hover:text-[#3e362e]"
                >
                  How It Works
                </Button>
              </div>

              <div className="flex items-center gap-10 text-[#a69080] text-xl font-semibold">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-[#ac8968]">{investors.toLocaleString()}+</span>
                  <span>Trusted Investors</span>
                </div>
                <div className="h-10 w-px bg-[#93785b]" />
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-[#ac8968]">${(assets / 1000000).toFixed(1)}M+</span>
                  <span>Total Assets Managed</span>
                </div>
                <div className="h-10 w-px bg-[#93785b]" />
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-[#ac8968]">{satisfaction}%</span>
                  <span>User Satisfaction Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-choose-us" className="py-16 px-6 bg-[#a69080]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.img
            src="/why-choose-us.png"
            alt="Why Choose Us"
            className="w-full rounded-2xl shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          />

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-2 text-[#3e362e] font-medium">
              <span className="bg-[#3e362e]/10 p-2 rounded-full mr-2">
                <ArrowRight className="h-4 w-4 text-[#3e362e]" />
              </span>
              Why Choose Us
            </div>

            <h3 className="text-3xl font-bold mb-4 text-[#3e362e]">Invest With Confidence</h3>

            <p className="text-[#3e362e]/90 mb-6">
              At Al Ashraf Holdings, we provide safe, profitable, and transparent investment opportunities backed by real assets and daily performance updates.
            </p>

            <ul className="space-y-4 mb-6">
              {[
                "Real asset-backed equity packages",
                "Transparent profit tracking",
                "Flexible withdrawal anytime",
                "No depreciation on value",
              ].map((point, index) => (
                <li key={index} className="flex items-start text-[#3e362e]">
                  <span className="h-3 w-3 mt-1 mr-3 rounded-full bg-[#865d36]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <Button className="bg-[#865d36] hover:bg-[#93785b]">Explore Investment Options</Button>
          </motion.div>
        </div>
      </section>

      {/* Our Vision */}
      <section id="our-vision" className="py-16 px-6 bg-[#93785b]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center gap-4 mb-2 text-[#3e362e] font-medium">
            <Lightbulb className="h-5 w-5" />
            <span>Our Vision</span>
            <Target className="h-5 w-5" />
          </div>

          <h3 className="text-3xl font-bold mb-4 text-[#3e362e]">Empowering Investments with Real Impact</h3>

          <p className="text-[#3e362e]/90 max-w-2xl mx-auto mb-12">
            We aim to create wealth-building opportunities by combining transparency, sustainability, and growth-focused equity models accessible to everyone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Sustainable Growth",
                icon: <Lightbulb className="w-8 h-8 text-[#3e362e]" />,
              },
              {
                title: "Asset Security",
                icon: <Target className="w-8 h-8 text-[#3e362e]" />,
              },
              {
                title: "Transparency First",
                icon: <ArrowRight className="w-8 h-8 text-[#3e362e]" />,
              },
              {
                title: "Daily Insights",
                icon: <Lightbulb className="w-8 h-8 text-[#3e362e]" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-[#a69080] rounded-xl shadow p-6 text-center hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h4 className="font-semibold text-[#3e362e]">{item.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Categories */}
      <section id="packages" className="py-16 px-6 bg-[#ac8968]">
        <h3 className="text-3xl font-semibold text-center mb-10 text-[#3e362e]">Explore Our Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Trading Packages",
              description: "Poultry, dairy, fruits & vegetables, and more.",
              url: "/trading-packages"
            },
            {
              title: "Long-Term Rental",
              description: "Fixed monthly returns from industrial sheds & yards.",
              url: "/trading-packages"
            },
            {
              title: "Long-Term Industry",
              description: "Invest in processing plants and properties for higher growth.",
              url: "/trading-packages"
            },
          ].map((pkg, i) => (
            <Card key={i} className="hover:shadow-xl transition bg-[#a69080] border-[#93785b]">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-2 text-[#3e362e]">{pkg.title}</h4>
                <p className="text-sm text-[#3e362e]/90 mb-4">{pkg.description}</p>
                <Button variant="link" className="p-0 text-[#865d36] hover:text-[#3e362e]">
                  <Link href={pkg.url}>
                    View Packages <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <IndustryPackage/>
      <RentalPackage/>
      <TradingPackage/>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-[#3e362e]">
        <h3 className="text-3xl font-semibold text-center mb-12 text-[#a69080]">How It Works</h3>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={item}>
              <Card className="hover:scale-[1.03] transition-transform duration-300 shadow-lg rounded-2xl border-[#93785b] bg-[#a69080]">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 flex items-center justify-center text-white font-bold rounded-full bg-gradient-to-br from-[#865d36] to-[#3e362e] shadow-md text-lg">
                      {i + 1}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-[#3e362e]">{step}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-6 bg-[#93785b]">
        <h3 className="text-3xl font-semibold text-center mb-10 text-[#3e362e]">Frequently Asked Questions</h3>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="text-[#3e362e]">
            <AccordionItem value="q1">
              <AccordionTrigger className="hover:text-[#865d36]">What are equity units?</AccordionTrigger>
              <AccordionContent className="text-[#3e362e]/90">
                Equity units represent your share of investment in a selected package. Each unit has a defined value and contributes to your returns.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="hover:text-[#865d36]">When can I withdraw profits?</AccordionTrigger>
              <AccordionContent className="text-[#3e362e]/90">
                For trading packages, you can withdraw anytime. For others, returns are distributed monthly or on exit.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="hover:text-[#865d36]">Is there a minimum investment?</AccordionTrigger>
              <AccordionContent className="text-[#3e362e]/90">
                Yes, the minimum is typically 1 equity unit, but it may vary by package.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="py-6 px-6 bg-[#3e362e] text-center text-sm text-[#a69080]">
        &copy; {new Date().getFullYear()} Al Ashraf Holdings. All rights reserved.
      </footer> */}
    </div>
    <Footer/>

    </>
  );
}