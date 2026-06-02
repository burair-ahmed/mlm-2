"use client";

import React, { useState } from "react";
import Footer from "../components/footer/component";
import Header from "../components/header/component";
import IndustryPackage from "../components/packages/IndustryPackage";
import RentalPackage from "../components/packages/RentalPackage";
import TradingPackage from "../components/packages/TradingPackage";
import { 
  CustomTabs, 
  CustomTabsList, 
  CustomTabsTrigger, 
  CustomTabsContent 
} from "@/components/custom/CustomTabs";
import { Sparkles } from "lucide-react";

export default function OurPackages() {
  const [activeTab, setActiveTab] = useState("trading");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 text-slate-100 pt-16 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-20 left-1/3 w-96 h-96 rounded-full bg-glow-emerald pointer-events-none opacity-20" />
        <div className="absolute bottom-20 right-1/3 w-96 h-96 rounded-full bg-glow-gold pointer-events-none opacity-10" />

        {/* Hero Section */}
        <section className="relative py-24 flex flex-col items-center justify-center text-center px-6 border-b border-white/5">
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10" />
          <div className="relative z-10 space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-accent text-glow-gold">
              <Sparkles className="h-3.5 w-3.5" /> High-Performance Yields
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Our Investment Packages
            </h1>
            <p className="max-w-xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
              Explore asset-backed portfolios designed to grow your capital following strict ethical guidelines and halal principles.
            </p>
          </div>
        </section>

        {/* Dynamic Tabs Container */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <CustomTabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
            <div className="flex justify-center">
              <CustomTabsList>
                <CustomTabsTrigger value="trading">Trading Packages</CustomTabsTrigger>
                <CustomTabsTrigger value="rental">Long-Term Rental</CustomTabsTrigger>
                <CustomTabsTrigger value="industry">Long-Term Industry</CustomTabsTrigger>
              </CustomTabsList>
            </div>

            <CustomTabsContent value="trading">
              <div className="space-y-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground">Trading Yields</h2>
                  <p className="text-sm text-muted-foreground mt-1">Short-term assets in poultry, dairy, fruits, and vegetables yielding immediate returns.</p>
                </div>
                <TradingPackage />
              </div>
            </CustomTabsContent>

            <CustomTabsContent value="rental">
              <div className="space-y-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground">Rental Dividends</h2>
                  <p className="text-sm text-muted-foreground mt-1">Fixed monthly returns backed by industrial sheds, yards, and lease contracts.</p>
                </div>
                <RentalPackage />
              </div>
            </CustomTabsContent>

            <CustomTabsContent value="industry">
              <div className="space-y-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground">Industrial Equity</h2>
                  <p className="text-sm text-muted-foreground mt-1">Invest directly in manufacturing plants and processing facilities for compound growth.</p>
                </div>
                <IndustryPackage />
              </div>
            </CustomTabsContent>
          </CustomTabs>
        </section>
      </main>
      <Footer />
    </>
  );
}