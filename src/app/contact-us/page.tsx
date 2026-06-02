"use client";

import { useEffect, useRef } from "react";
import { Mail, Phone, MapPin, Sparkles, Send } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Header from "../components/header/component";
import Footer from "../components/footer/component";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const contactItemsRef = useRef<Array<HTMLDivElement | null>>([]);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    gsap.from(headingRef.current, {
      opacity: 0,
      y: 40,
      duration: 1.0,
      ease: "power4.out",
      delay: 0.2,
    });

    gsap.from(contactItemsRef.current, {
      scrollTrigger: {
        trigger: infoRef.current,
        start: "top 80%",
      },
      opacity: 0,
      x: -40,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });

    gsap.from(formRef.current, {
      scrollTrigger: {
        trigger: formRef.current,
        start: "top 80%",
      },
      opacity: 0,
      y: 40,
      duration: 1.0,
      ease: "power3.out",
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Action details
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-950 text-slate-100 pt-16 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-40 left-10 w-96 h-96 rounded-full bg-glow-emerald pointer-events-none opacity-30" />
        <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full bg-glow-gold pointer-events-none opacity-20" />

        {/* Hero Banner */}
        <section className="relative py-24 px-6 md:px-16 text-center overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10" />
          <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-accent text-glow-gold">
              <Sparkles className="h-3.5 w-3.5" /> Support Center
            </div>
            <h2
              ref={headingRef}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
            >
              Get In Touch
            </h2>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
              We would love to hear from you — whether it is a question about packages, partnerships, or operational features.
            </p>
          </div>
        </section>

        {/* Main Section */}
        <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div ref={infoRef} className="space-y-8 flex flex-col justify-center">
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-foreground">Contact Information</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Reach out directly to Al Ashraf Holdings client relations via the channels below. We aim to reply to all inquiries within 24 hours.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { icon: Phone, text: "+92 21 111-123-456", refIdx: 0 },
                  { icon: Mail, text: "support@alashrafholdings.com", refIdx: 1 },
                  { icon: MapPin, text: "Karachi, Pakistan", refIdx: 2 },
                ].map(({ icon: Icon, text, refIdx }) => (
                  <div
                    key={text}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur-xl"
                    ref={(el) => {
                      contactItemsRef.current[refIdx] = el;
                    }}
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-glow-emerald">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm text-foreground font-semibold">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-slate-900/35 border border-white/5 p-8 rounded-3xl backdrop-blur-xl space-y-6 shadow-2xl"
            >
              <div>
                <h3 className="text-2xl font-bold text-foreground">Send Us a Message</h3>
                <p className="text-xs text-muted-foreground mt-1">Fill out the form below to email our helpdesk.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Your Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Your Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Subject</label>
                <input
                  type="text"
                  placeholder="Inquiry about Trading Packages"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all duration-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Message</label>
                <textarea
                  placeholder="Tell us details of your request..."
                  required
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                ref={buttonRef}
                className="w-full py-3 bg-gradient-to-r from-primary to-emerald-600 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Submit Message
              </button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
