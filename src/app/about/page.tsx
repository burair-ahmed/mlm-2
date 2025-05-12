'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function AboutPage() {
  const stickyRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  return (
    <div className="bg-[#f9f5f0] text-[#3e362e] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 bg-[#3e362e] text-white">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold text-center"
        >
          Welcome to Al Ashraf Holdings
        </motion.h1>
        <p className="mt-6 text-center max-w-xl text-[#ac8968]">
          Pioneering ethical investment opportunities tailored to your goals.
        </p>
      </section>

      {/* Sticky Parallax Section */}
      <section className="relative h-[300vh] bg-[#ac8968]">
        <div className="sticky top-0 h-screen flex items-center justify-center z-10">
          <motion.div
            ref={stickyRef}
            style={{ scale, opacity }}
            className="bg-[#3e362e] p-10 rounded-xl shadow-xl max-w-xl text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p>
              At Al Ashraf Holdings, we’re committed to transparent and halal investment avenues that grow your wealth ethically and sustainably.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="h-screen bg-[#93785b] flex items-center justify-center text-white text-center px-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-semibold mb-4">Our Vision</h2>
          <p>
            To become a trusted household name in investment innovation by fostering community growth and financial independence.
          </p>
        </div>
      </section>

      {/* Trusted by Thousands */}
      <section className="py-24 px-6 bg-[#f9f5f0]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Trusted by Thousands
            </motion.h2>
            <p className="text-[#3e362e]">
              We’ve built our reputation on honesty, long-term vision, and genuine care for our clients’ success. Today, thousands trust Al Ashraf Holdings to manage and grow their investments the right way.
            </p>
          </div>
          <motion.img
            src="/team-discussion.jpg"
            alt="Team Strategy"
            className="rounded-xl shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* Tailored Investment Solutions */}
      <section className="py-24 px-6 bg-[#ac8968] text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            src="/investment-planning.jpg"
            alt="Investment Planning"
            className="rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
          <div>
            <motion.h2
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Tailored Investment Solutions
            </motion.h2>
            <p>
              Every investor is unique. That’s why we offer a diverse range of halal investment packages—from real estate to trading—to suit different needs, goals, and timelines.
            </p>
          </div>
        </div>
      </section>

      {/* Impact-Driven Projects */}
      <section className="py-24 px-6 bg-[#f9f5f0]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Impact-Driven Projects
            </motion.h2>
            <p>
              From infrastructure to community housing, our investment projects are designed to make a real difference—economically and socially. You invest, we build futures.
            </p>
          </div>
          <motion.img
            src="/community-project.jpg"
            alt="Community Impact"
            className="rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative min-h-screen flex flex-col justify-center items-center bg-[#865d36] text-white px-6 py-20">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-[#a69080]">
            With a commitment to transparency, real-world returns, and community-focused projects, Al Ashraf Holdings is more than just an investment firm—it's your financial partner.
          </p>
        </motion.div>
      </section>

      {/* Core Values Section */}
      <section className="relative min-h-screen bg-[#f9f5f0] flex flex-col items-center justify-center py-20">
        <div className="space-y-16 max-w-xl">
          {['Integrity', 'Transparency', 'Ethical Growth'].map((val, i) => (
            <motion.div
              key={val}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-[#3e362e] text-white p-6 rounded-xl shadow-md text-center"
            >
              <h3 className="text-2xl font-semibold">{val}</h3>
              <p className="text-[#ac8968] mt-2">We uphold {val.toLowerCase()} in all our actions and decisions.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-[#93785b] text-white py-20 overflow-x-hidden">
        <div className="whitespace-nowrap overflow-x-auto flex gap-12 px-6 scroll-smooth">
          {['Foundation', 'First 100 Clients', 'New Projects', 'Future Goals'].map((item, index) => (
            <motion.div
              key={item}
              whileInView={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="min-w-[250px] bg-[#3e362e] px-6 py-10 rounded-xl shadow-md text-center"
            >
              <h3 className="text-xl font-semibold">{item}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Meet the Team */}
      <section className="bg-[#a69080] text-[#3e362e] py-16 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white text-[#3e362e] p-6 rounded-xl shadow-md text-center"
            >
              <h3 className="text-xl font-semibold">Team Member {i}</h3>
              <p className="text-[#865d36] mt-2">Role or bio snippet goes here.</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
