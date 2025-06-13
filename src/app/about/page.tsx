'use client';

import { motion} from 'framer-motion';
// import { useRef } from 'react';
import { Target, Users, LineChart, Building2 } from 'lucide-react';
import Footer from '../components/footer/component';
import Header from '../components/header/component';

export default function AboutPage() {
  // const stickyRef = useRef(null);
  // const { scrollYProgress } = useScroll({
  //   target: stickyRef,
  //   offset: ['start end', 'end start'],
  // });

  // const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  // const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <>
      <Header />
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

        {/* Mission and Vision Combined Section */}
        <section className="py-20 px-6 bg-[#ac8968] text-white text-center">
          <div className="max-w-4xl mx-auto grid grid-cols-1 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-[#3e362e] text-white rounded-2xl p-8 shadow-2xl"
            >
              <Target className="w-10 h-10 mx-auto text-[#ac8968] mb-4" />
              <h2 className="text-3xl font-bold mb-2">Our Mission</h2>
              <p>
                We’re committed to ethical investment avenues that deliver real value to individuals, communities, and the world.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-[#3e362e] text-white rounded-2xl p-8 shadow-2xl"
            >
              <LineChart className="w-10 h-10 mx-auto text-[#ac8968] mb-4" />
              <h2 className="text-3xl font-bold mb-2">Our Vision</h2>
              <p>
                To be a leading name in halal investment innovation, growing wealth and empowering communities globally.
              </p>
            </motion.div>
          </div>
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
              src="/team-discussion.webp"
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

        {/* Core Values */}
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
        {/* <section className="py-16 bg-[#93785b] text-white overflow-x-auto">
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
        </section> */}
{/* Horizontal Timeline – Enhanced & Centered */}
<section className="py-20 bg-[#93785b] text-white">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
    
    {/* Timeline line */}
    <div className="relative flex items-center justify-center">
      <div className="absolute -top-1/4 left-0 w-full h-1 bg-[#f9f5f0] rounded-full transform -translate-y-1/2 z-0" />
      
      {/* Timeline items */}
      <div className="flex flex-wrap justify-center gap-10 z-10 relative">
        {[
          { title: 'Foundation', delay: 0 },
          { title: 'First 100 Clients', delay: 0.1 },
          { title: 'New Projects', delay: 0.2 },
          { title: 'Future Goals', delay: 0.3 },
        ].map(({ title, delay }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            viewport={{ once: true }}
            className="relative bg-[#3e362e] px-6 py-4 rounded-xl shadow-lg text-center min-w-[180px] hover:scale-105 transition-transform duration-300"
          >
            {/* Connector Dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-5 w-4 h-4 bg-[#ac8968] border-2 border-white rounded-full z-10" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</section>

        {/* Meet the Team */}
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
      <Footer />
    </>
  );
}
