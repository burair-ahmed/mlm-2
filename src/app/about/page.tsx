'use client';


import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Target, Users, LineChart, Building2 } from 'lucide-react';
import Footer from '../components/footer/component';
import Header from '../components/header/component';

export default function AboutPage() {
  const stickyRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <>
    <Header/>
    <div className="bg-[#f9f5f0] text-[#3e362e]">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 bg-[#3e362e] text-white text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold"
        >
          About Al Ashraf Holdings
        </motion.h1>
        <p className="mt-6 text-lg max-w-2xl text-[#ac8968]">
          Building your future with ethical, transparent, and profitable investments.
        </p>
      </section>

      {/* Sticky Mission Statement */}
      <section className="relative h-[200vh] bg-[#ac8968]">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <motion.div
            ref={stickyRef}
            style={{ scale, opacity }}
            className="bg-[#3e362e] text-white rounded-2xl p-8 shadow-2xl max-w-xl text-center"
          >
            <Target className="w-10 h-10 mx-auto text-[#ac8968] mb-4" />
            <h2 className="text-3xl font-bold mb-2">Our Mission</h2>
            <p>
              We’re committed to ethical investment avenues that deliver real value to individuals, communities, and the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-20 px-6 bg-[#f9f5f0] text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <LineChart className="w-10 h-10 mx-auto text-[#865d36] mb-4" />
          <h2 className="text-4xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg">
            To be a leading name in halal investment innovation, growing wealth and empowering communities globally.
          </p>
        </motion.div>
      </section>

      {/* Trusted by Thousands */}
      <section className="py-20 px-6 bg-[#3e362e] text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Users className="w-10 h-10 text-[#ac8968] mb-4" />
            <motion.h2
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Trusted by Thousands
            </motion.h2>
            <p>
              Thousands rely on Al Ashraf Holdings for transparent investment and long-term financial growth rooted in values.
            </p>
          </div>
          <motion.img
            src="/team-discussion.jpg"
            alt="Team"
            className="rounded-xl shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* Investment Solutions */}
      <section className="py-20 px-6 bg-[#ac8968] text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            src="/investment-planning.jpg"
            alt="Investment"
            className="rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          />
          <div>
            <Building2 className="w-10 h-10 text-[#f9f5f0] mb-4" />
            <motion.h2
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Tailored Solutions
            </motion.h2>
            <p>
              Choose from diverse halal investment options to match your risk, timeline, and growth goals.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values (condensed and iconized) */}
      <section className="py-20 bg-[#f9f5f0]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { title: 'Integrity', icon: <Target className="mx-auto text-[#865d36]" /> },
            { title: 'Transparency', icon: <LineChart className="mx-auto text-[#865d36]" /> },
            { title: 'Ethical Growth', icon: <Users className="mx-auto text-[#865d36]" /> },
          ].map(({ title, icon }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="mb-4">{icon}</div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-[#93785b]">
                We uphold {title.toLowerCase()} in all our dealings.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Horizontal Timeline */}
      <section className="py-16 bg-[#93785b] text-white overflow-x-auto">
        <div className="whitespace-nowrap flex gap-8 px-6 scroll-smooth">
          {['Foundation', 'First 100 Clients', 'New Projects', 'Future Goals'].map((item) => (
            <motion.div
              key={item}
              whileInView={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="min-w-[200px] bg-[#3e362e] py-6 px-4 rounded-xl shadow-md text-center"
            >
              <h3 className="text-lg font-semibold">{item}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Meet the Team (simplified) */}
      <section className="bg-[#a69080] text-[#3e362e] py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Meet the Team</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white text-[#3e362e] p-6 rounded-xl shadow-md text-center"
            >
              <h3 className="text-xl font-semibold">Team Member {i}</h3>
              <p className="text-[#865d36] mt-2">Specialist in ethical finance & community growth.</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
<Footer/>
    </>
  );
}
