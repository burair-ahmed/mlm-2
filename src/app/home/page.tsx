// app/landing/page.tsx (or wherever your route is)
"use client";

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
// import { Lightbulb, Target } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold">Al Ashraf Holdings</h1>
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#packages" className="hover:text-primary">Packages</a>
          <a href="#how-it-works" className="hover:text-primary">How It Works</a>
          <a href="#faq" className="hover:text-primary">FAQ</a>
          <a href="/dashboard" className="hover:text-primary">Dashboard</a>
        </nav>
        <Button className="text-sm">Get Started</Button>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-gradient-to-br from-primary to-secondary text-white">
        <motion.h2
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Smart Investments, Real Assets
        </motion.h2>
        <p className="text-lg max-w-xl mx-auto mb-6">
          Explore equity packages with high returns in trading and long-term ventures.
        </p>
        <div className="flex justify-center gap-4">
          <Button>Browse Packages</Button>
          <Button variant="outline" className="text-black border-white">How It Works</Button>
        </div>
      </section>
{/* Why Choose Us */}
<section id="why-choose-us" className="py-16 px-6 bg-white">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    {/* Left Image */}
    <motion.img
      src="/why-choose-us.png" // Replace with your actual image path
      alt="Why Choose Us"
      className="w-full rounded-2xl shadow-md"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    />

    {/* Right Content */}
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Subheading with icon */}
      <div className="flex items-center mb-2 text-primary font-medium">
        <span className="bg-primary/10 p-2 rounded-full mr-2">
          <ArrowRight className="h-4 w-4" />
        </span>
        Why Choose Us
      </div>

      {/* Main heading */}
      <h3 className="text-3xl font-bold mb-4">Invest With Confidence</h3>

      {/* Paragraph */}
      <p className="text-muted-foreground mb-6">
        At Al Ashraf Holdings, we provide safe, profitable, and transparent investment opportunities backed by real assets and daily performance updates.
      </p>

      {/* Bullet Points */}
      <ul className="space-y-4 mb-6">
        {[
          "Real asset-backed equity packages",
          "Transparent profit tracking",
          "Flexible withdrawal anytime",
          "No depreciation on value",
        ].map((point, index) => (
          <li key={index} className="flex items-start">
            <span className="h-3 w-3 mt-1 mr-3 rounded-full bg-primary" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {/* Call to Action */}
      <Button>Explore Investment Options</Button>
    </motion.div>
  </div>
</section>

{/* Our Vision */}
<section id="our-vision" className="py-16 px-6 bg-gray-50">
  <div className="max-w-6xl mx-auto text-center">
    {/* Subheading with icons on both sides */}
    <div className="flex justify-center items-center gap-4 mb-2 text-primary font-medium">
      <Lightbulb className="h-5 w-5" />
      <span>Our Vision</span>
      <Target className="h-5 w-5" />
    </div>

    {/* Main heading */}
    <h3 className="text-3xl font-bold mb-4">Empowering Investments with Real Impact</h3>

    {/* Short paragraph */}
    <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
      We aim to create wealth-building opportunities by combining transparency, sustainability, and growth-focused equity models accessible to everyone.
    </p>

    {/* Icon boxes */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        {
          title: "Sustainable Growth",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m0 0L8.25 15m3.75 4.5l3.75-4.5M3 9h18"
              />
            </svg>
          ),
        },
        {
          title: "Asset Security",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75v10.5M9 12h6"
              />
            </svg>
          ),
        },
        {
          title: "Transparency First",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-yellow-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v18m9-9H3"
              />
            </svg>
          ),
        },
        {
          title: "Daily Insights",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-purple-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12h18M3 6h18M3 18h18"
              />
            </svg>
          ),
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex justify-center mb-4">{item.icon}</div>
          <h4 className="font-semibold">{item.title}</h4>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* Package Categories */}
      <section id="packages" className="py-16 px-6 bg-gray-100">
        <h3 className="text-3xl font-semibold text-center mb-10">Explore Our Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Trading Packages",
              description: "Poultry, dairy, fruits & vegetables, and more.",
            },
            {
              title: "Long-Term Rental",
              description: "Fixed monthly returns from industrial sheds & yards.",
            },
            {
              title: "Long-Term Industry",
              description: "Invest in processing plants and properties for higher growth.",
            },
          ].map((pkg, i) => (
            <Card key={i} className="hover:shadow-xl transition">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-2">{pkg.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                <Button variant="link" className="p-0 text-primary">
                  View Packages <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
  {/* How It Works */}
  <section id="how-it-works" className="py-20 px-6 bg-muted">
      <h3 className="text-3xl font-semibold text-center mb-12">How It Works</h3>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
      >
        {steps.map((step, i) => (
          <motion.div key={i} variants={item}>
            <Card className="hover:scale-[1.03] transition-transform duration-300 shadow-lg rounded-2xl border-none">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center text-white font-bold rounded-full bg-gradient-to-br from-primary to-secondary shadow-md text-lg">
                    {i + 1}
                  </div>
                </div>
                <p className="text-sm font-medium">{step}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>



      {/* FAQ */}
      <section id="faq" className="py-16 px-6 bg-gray-100">
        <h3 className="text-3xl font-semibold text-center mb-10">Frequently Asked Questions</h3>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="q1">
              <AccordionTrigger>What are equity units?</AccordionTrigger>
              <AccordionContent>
                Equity units represent your share of investment in a selected package. Each unit has a defined value and contributes to your returns.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>When can I withdraw profits?</AccordionTrigger>
              <AccordionContent>
                For trading packages, you can withdraw anytime. For others, returns are distributed monthly or on exit.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Is there a minimum investment?</AccordionTrigger>
              <AccordionContent>
                Yes, the minimum is typically 1 equity unit, but it may vary by package.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Al Ashraf Holdings. All rights reserved.
      </footer>
    </div>
  );
}
