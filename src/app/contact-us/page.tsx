"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

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
      y: 50,
      duration: 1.2,
      ease: "power4.out",
      delay: 0.2,
    });

    gsap.from(contactItemsRef.current, {
      scrollTrigger: {
        trigger: infoRef.current,
        start: "top 80%",
      },
      opacity: 0,
      x: -50,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });

    gsap.from(formRef.current, {
      scrollTrigger: {
        trigger: formRef.current,
        start: "top 80%",
      },
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "back.out(1.7)",
    });

    const ctx = gsap.context(() => {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.4,
        ease: "power1.inOut",
        paused: true,
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f3f1] text-[#3e362e]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#3e362e] text-[#a69080] shadow-md sticky top-0 z-50">
        <h1 className="text-xl font-bold">Al Ashraf Holdings</h1>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/" className="hover:text-[#ac8968]">Home</Link>
          <Link href="/#packages" className="hover:text-[#ac8968]">Packages</Link>
          <Link href="/#how-it-works" className="hover:text-[#ac8968]">How It Works</Link>
          <Link href="/dashboard" className="hover:text-[#ac8968]">Dashboard</Link>
        </nav>
        <Button className="text-sm bg-[#865d36] hover:bg-[#93785b]">Get Started</Button>
      </header>

      {/* Hero Banner */}
      <section className="relative py-24 px-6 md:px-16 text-white text-center overflow-hidden bg-[#3e362e]">
        <h2
          ref={headingRef}
          className="text-5xl md:text-6xl font-extrabold mb-4 text-[#ac8968]"
        >
          Get In Touch
        </h2>
        <p className="text-[#a69080] text-xl">
          We&apos;d love to hear from you — whether it&apos;s a question, partnership or opportunity.
        </p>
      </section>

      {/* Main Section */}
      <section className="py-20 px-6 md:px-16 bg-[#f5f3f1]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div ref={infoRef} className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-[#3e362e] mb-4">Contact Information</h3>
              <p className="text-[#3e362e]/80">
                Reach out to our team via any of the options below.
              </p>
            </div>
            <div className="space-y-4">
              <div
                className="flex items-center gap-4"
                ref={el => { contactItemsRef.current[0] = el; }}
              >
                <Phone className="text-[#865d36]" />
                <span className="text-[#3e362e]">+92 300 1234567</span>
              </div>
              <div
                className="flex items-center gap-4"
                ref={el => { contactItemsRef.current[1] = el; }}
              >
                <Mail className="text-[#865d36]" />
                <span className="text-[#3e362e]">support@alashrafholdings.com</span>
              </div>
              <div
                className="flex items-center gap-4"
                ref={el => { contactItemsRef.current[2] = el; }}
              >
                <MapPin className="text-[#865d36]" />
                <span className="text-[#3e362e]">Karachi, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form ref={formRef} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h3 className="text-2xl font-semibold text-[#3e362e]">Send Us a Message</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Your Name" className="bg-[#f5f3f1] focus:ring-[#ac8968]" required />
              <Input placeholder="Your Email" type="email" className="bg-[#f5f3f1] focus:ring-[#ac8968]" required />
            </div>
            <Input placeholder="Subject" className="bg-[#f5f3f1] focus:ring-[#ac8968]" required />
            <Textarea placeholder="Your Message..." className="bg-[#f5f3f1] focus:ring-[#ac8968]" rows={6} required />
            <Button
              type="submit"
              ref={buttonRef}
              className="bg-[#865d36] hover:bg-[#93785b]"
              onMouseEnter={() => gsap.to(buttonRef.current, { scale: 1.1, duration: 0.3 })}
              onMouseLeave={() => gsap.to(buttonRef.current, { scale: 1, duration: 0.3 })}
            >
              Submit Message
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center bg-[#3e362e] text-[#a69080] text-sm">
        © {new Date().getFullYear()} Al Ashraf Holdings. All rights reserved.
      </footer>
    </div>
  );
}
