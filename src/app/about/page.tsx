"use client";

import { motion } from "framer-motion";
import { Target, Users, LineChart, CheckCircle, Sparkles } from "lucide-react";
import Footer from "../components/footer/component";
import Header from "../components/header/component";

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="bg-slate-950 text-slate-100 min-h-screen pt-16 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-40 left-10 w-96 h-96 rounded-full bg-glow-emerald pointer-events-none opacity-30" />
        <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full bg-glow-gold pointer-events-none opacity-20" />

        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex flex-col justify-center items-center px-6 text-center py-24">
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10" />
          <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-accent text-glow-gold">
              <Sparkles className="h-3.5 w-3.5" /> About Our Venture
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
            >
              Who We Are
            </motion.h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
              Al Ashraf Holdings is established to construct ethical, transparent, and sharia-compliant investment models that connect global investors directly to physical, high-yield assets.
            </p>
          </div>
        </section>

        {/* Mission and Vision Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/5 bg-slate-900/30 backdrop-blur-xl p-8 md:p-10 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-2xl relative"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-glow-emerald">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We are committed to building sharia-compliant investment avenues that deliver actual physical asset ownership, verifiable operational yields, and long-term values to our global partners.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/5 bg-slate-900/30 backdrop-blur-xl p-8 md:p-10 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-2xl relative"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-glow-emerald">
                <LineChart className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                To be the leading global platform for ethical asset investments, democratizing access to safe yields and real estate ownership through modern technological transparency.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trusted by Thousands */}
        <section className="py-20 bg-slate-900/20 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary text-glow-emerald">
                <Users className="w-4 h-4" /> Global Trust
              </div>
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-foreground"
              >
                Trusted by Thousands of Global Partners
              </motion.h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Thousands of partners rely on Al Ashraf Holdings to manage their investments. Our dedication to complete auditing, regular reports, and real-asset security ensures your portfolio is in safe hands.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/5 h-80 lg:h-96"
            >
              <img
                src="/team-discussion.webp"
                alt="Team Discussion"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold text-foreground">Our Core Principles</h2>
            <p className="text-muted-foreground">The pillars that define Al Ashraf Holdings operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Uncompromising Integrity", desc: "Honesty and directness in all dealings, audits, and agreements." },
              { title: "Complete Transparency", desc: "Daily dashboard insights, operations logs, and reports accessible 24/7." },
              { title: "Ethical Yields", desc: "100% sharia-compliant assets free from interest-based compounding." },
            ].map(({ title, desc }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="bg-slate-900/30 border border-white/5 p-8 rounded-2xl hover:border-primary/20 hover:bg-slate-900/60 transition-all duration-300 space-y-4"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-glow-emerald">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Journey Timeline pathway */}
        <section className="py-24 bg-slate-900/35 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-foreground mb-16">Our Journey</h2>

            {/* Stepper pathway */}
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-10 md:gap-4 max-w-5xl mx-auto">
              {/* Horizontal line for desktop, vertical line for mobile */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 rounded-full transform -translate-y-1/2 hidden md:block z-0" />
              <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white/10 rounded-full transform -translate-x-1/2 md:hidden z-0" />

              {[
                { title: "Foundation", year: "2024", desc: "Established with core sharia vision." },
                { title: "Growth Milestones", year: "2025", desc: "Exceeded 5,000+ active investors." },
                { title: "Expanded Portfolios", year: "2026", desc: "Introduced industrial and rental packages." },
                { title: "Future Expansion", year: "2027+", desc: "Targeting international asset classes." },
              ].map(({ title, year, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="relative z-10 w-64 rounded-2xl border border-white/5 bg-slate-950 p-5 text-center shadow-xl hover:scale-102 hover:border-primary/30 transition-all duration-300"
                >
                  {/* Stepper Dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[150px] md:-translate-y-[45px] h-4 w-4 bg-primary border-2 border-slate-950 rounded-full shadow-lg shadow-primary/40 z-20" />
                  
                  <span className="text-xs font-bold text-primary tracking-widest uppercase">{year}</span>
                  <h3 className="text-lg font-bold text-foreground mt-1">{title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-foreground mb-16">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Suleman Al Ashraf", role: "Chief Executive Officer", desc: "Expert in sharia-compliant finance structures and property acquisitions." },
              { name: "Farhan Ahmed", role: "Head of Operations", desc: "Manages asset tracking systems and operations team." },
              { name: "Zainab Ali", role: "Investor Relations", desc: "Assists global partners with onboarding, KYC, and withdrawals." },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="bg-slate-900/30 border border-white/5 p-6 rounded-2xl hover:border-primary/20 hover:bg-slate-900/60 transition-all duration-300 text-center space-y-3"
              >
                <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto text-primary text-glow-emerald font-bold text-xl">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                  <p className="text-xs font-semibold text-accent text-glow-gold">{member.role}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
