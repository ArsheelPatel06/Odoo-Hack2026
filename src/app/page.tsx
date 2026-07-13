"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, MapPin, Truck, BarChart3, Box, ShieldCheck, Zap, Ghost, Sparkles } from "lucide-react";

export default function LandingPage() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "circOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans selection:bg-[#FF3366] selection:text-white overflow-x-hidden">
      
      {/* Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-xl border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded bg-[#FF3366] text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Truck className="size-4" />
            </div>
            <span className="text-2xl font-black text-black tracking-tighter uppercase">TransitOps</span>
          </div>
          <Link 
            href="/dashboard"
            className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Enter App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Decorative Shapes */}
        <div className="absolute top-20 right-10 md:right-32 size-64 bg-[#4D90FE] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-40 left-10 md:left-32 size-64 bg-[#FF3366] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 size-64 bg-[#FFDF00] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
        
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none -z-10" />

        <motion.div 
          className="max-w-5xl mx-auto px-6 text-center z-10"
          initial="hidden" animate="visible" variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFDF00] border-2 border-black text-black text-xs font-bold mb-8 uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
            <Sparkles className="size-4" />
            Logistics, Rewired.
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl lg:text-[8rem] font-black text-black tracking-tighter mb-8 leading-[0.9] uppercase">
            Perfect <br/>
            <span className="text-[#FF3366] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">Delhivery.</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-700 font-medium mb-12 max-w-2xl mx-auto leading-relaxed border-2 border-black p-4 rounded-xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
            Stop guessing where your fleet is. TransitOps is the unified, high-performance command center for modern logistics.
          </motion.p>
          
          <motion.div variants={fadeInUp}>
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#4D90FE] text-white text-xl font-black border-4 border-black hover:bg-[#3b7bed] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase rounded-xl"
            >
              START DISPATCHING <ArrowRight className="size-6" strokeWidth={3} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className="py-8 border-y-4 border-black bg-[#FFDF00] overflow-hidden flex items-center relative">
        <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-[#FFDF00] to-transparent z-10" />
        <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-[#FFDF00] to-transparent z-10" />
        <div className="flex w-full">
          <motion.div 
            className="flex whitespace-nowrap gap-16 items-center pr-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 15, repeat: Infinity }}
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 items-center">
                <span className="text-3xl font-black text-black font-mono tracking-tighter uppercase">ACME CORP</span>
                <span className="text-3xl font-black text-black font-serif italic">Globex</span>
                <span className="text-3xl font-black text-black font-sans tracking-widest uppercase">Soylent</span>
                <span className="text-3xl font-black text-black font-mono uppercase">INITECH</span>
                <span className="text-3xl font-black text-black font-sans tracking-tighter uppercase">Umbrella</span>
                <span className="text-3xl font-black text-black font-serif uppercase">Stark Ind.</span>
                <span className="text-3xl font-black text-black font-mono tracking-tight uppercase">Wayne Ent.</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bento Box Story Section */}
      <section className="py-32 px-6 bg-white border-b-4 border-black relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="mb-20 text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-black tracking-tighter leading-none mb-6 uppercase">
              The old way is <br/> <span className="bg-black text-white px-4 py-1 inline-block -rotate-2 mt-2">DEAD.</span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* The Old Way Box */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-white border-4 border-black rounded-3xl p-4 flex flex-col group shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-80 w-full rounded-2xl bg-zinc-200 overflow-hidden relative mb-6 border-2 border-black">
                <Image src="/images/scooters.png" alt="Scooters" layout="fill" objectFit="cover" className="opacity-90 group-hover:scale-105 transition-transform duration-700 grayscale-[0.5]" />
                <div className="absolute top-4 left-4 bg-black text-white text-sm font-black px-4 py-2 rounded-xl uppercase tracking-wider shadow-[4px_4px_0px_0px_#FF3366]">
                  Chaotic
                </div>
              </div>
              <div className="px-4 pb-4">
                <h3 className="text-3xl font-black text-black mb-3 tracking-tight uppercase">Scattered Ops</h3>
                <p className="text-slate-700 font-medium leading-relaxed text-lg">
                  No real-time visibility. Drivers juggling heavy loads with zero optimization. This leads to missed ETAs, burnt-out fleets, and furious customers.
                </p>
              </div>
            </motion.div>

            {/* The New Way Box */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#E8F1FF] border-4 border-black rounded-3xl p-4 flex flex-col group shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-80 w-full rounded-2xl bg-[#4D90FE] overflow-hidden relative mb-6 border-2 border-black">
                <Image src="/images/truck.png" alt="Truck" layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-700 mix-blend-luminosity opacity-90" />
                <div className="absolute inset-0 bg-[#4D90FE] mix-blend-overlay opacity-40"></div>
                <div className="absolute top-4 left-4 bg-[#FFDF00] text-black text-sm font-black px-4 py-2 rounded-xl uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  Optimized
                </div>
              </div>
              <div className="px-4 pb-4">
                <h3 className="text-3xl font-black text-black mb-3 tracking-tight uppercase">Automated Precision</h3>
                <p className="text-slate-800 font-medium leading-relaxed text-lg">
                  Intelligent dispatching, live GPS tracking, and perfect load balancing. TransitOps turns your fleet into a well-oiled, highly profitable machine.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-[#FFDF00] border-b-4 border-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform">
              <div className="size-16 rounded-xl border-2 border-black bg-[#FF3366] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                <MapPin className="size-8 text-white" strokeWidth={2.5} />
              </div>
              <h4 className="text-2xl font-black text-black mb-4 uppercase">Live Tracking</h4>
              <p className="text-slate-800 font-medium leading-relaxed">Monitor every vehicle on a live map. Know instantly when a trip is dispatched, in transit, or delivered.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform">
              <div className="size-16 rounded-xl border-2 border-black bg-[#4D90FE] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">
                <Ghost className="size-8 text-white" strokeWidth={2.5} />
              </div>
              <h4 className="text-2xl font-black text-black mb-4 uppercase">Drag & Drop</h4>
              <p className="text-slate-800 font-medium leading-relaxed">Assign trips to statuses seamlessly. Our Kanban-style board makes logistics feel like a simple game.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform">
              <div className="size-16 rounded-xl border-2 border-black bg-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
                <BarChart3 className="size-8 text-[#FFDF00]" strokeWidth={2.5} />
              </div>
              <h4 className="text-2xl font-black text-black mb-4 uppercase">Instant Analytics</h4>
              <p className="text-slate-800 font-medium leading-relaxed">Track revenue and fleet efficiency in real-time. Data-driven decisions, zero manual math.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Massive CTA */}
      <section className="py-40 bg-black text-[#FDFBF7] text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-4xl mx-auto px-6">
          <motion.h2 variants={fadeInUp} className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] uppercase">
            STOP WAITING. <br/> <span className="text-[#FF3366]">START MOVING.</span>
          </motion.h2>
          <motion.div variants={fadeInUp}>
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center px-10 py-5 bg-[#FFDF00] text-black text-2xl font-black border-4 border-black hover:bg-white transition-all shadow-[12px_12px_0px_0px_rgba(255,51,102,1)] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[8px_8px_0px_0px_rgba(255,51,102,1)] uppercase rounded-xl group"
            >
              Launch Platform
              <ArrowRight className="ml-4 size-8 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex size-10 items-center justify-center rounded bg-[#FF3366] text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                  <Truck className="size-6" />
                </div>
                <span className="text-3xl font-black text-black tracking-tighter uppercase">TransitOps</span>
              </div>
              <p className="text-slate-800 font-medium mb-8 max-w-sm text-lg">
                The ultimate command center for modern delivery fleets. Built for speed, precision, and zero compromises.
              </p>
              <div className="flex items-center gap-4">
                {/* Social placeholders */}
                <div className="size-12 rounded-xl border-2 border-black bg-[#FDFBF7] flex items-center justify-center hover:bg-[#FFDF00] cursor-pointer transition-colors text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">𝕏</div>
                <div className="size-12 rounded-xl border-2 border-black bg-[#FDFBF7] flex items-center justify-center hover:bg-[#4D90FE] cursor-pointer transition-colors text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">in</div>
                <div className="size-12 rounded-xl border-2 border-black bg-[#FDFBF7] flex items-center justify-center hover:bg-[#FF3366] cursor-pointer transition-colors text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">gh</div>
              </div>
            </div>

            <div>
              <h4 className="text-black font-black text-xl mb-6 tracking-tight uppercase">Product</h4>
              <ul className="space-y-4 text-slate-700 font-bold">
                <li><a href="#" className="hover:text-[#FF3366] hover:underline underline-offset-4 decoration-2 transition-all">Features</a></li>
                <li><a href="#" className="hover:text-[#FF3366] hover:underline underline-offset-4 decoration-2 transition-all">Pricing</a></li>
                <li><a href="#" className="hover:text-[#FF3366] hover:underline underline-offset-4 decoration-2 transition-all">Changelog</a></li>
                <li><Link href="/docs" className="hover:text-[#FF3366] hover:underline underline-offset-4 decoration-2 transition-all">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-black font-black text-xl mb-6 tracking-tight uppercase">Company</h4>
              <ul className="space-y-4 text-slate-700 font-bold">
                <li><a href="#" className="hover:text-[#4D90FE] hover:underline underline-offset-4 decoration-2 transition-all">About</a></li>
                <li><a href="#" className="hover:text-[#4D90FE] hover:underline underline-offset-4 decoration-2 transition-all">Blog</a></li>
                <li><a href="#" className="hover:text-[#4D90FE] hover:underline underline-offset-4 decoration-2 transition-all">Careers</a></li>
                <li><a href="#" className="hover:text-[#4D90FE] hover:underline underline-offset-4 decoration-2 transition-all">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-black font-black text-xl mb-6 tracking-tight uppercase">Subscribe</h4>
              <p className="text-slate-800 font-medium mb-4">Get the latest logistics insights.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email..." className="bg-[#FDFBF7] border-2 border-black rounded-xl px-4 py-3 w-full text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_#4D90FE] transition-shadow placeholder:text-slate-400" />
                <button className="bg-[#FF3366] text-white px-5 py-3 rounded-xl font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">→</button>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t-4 border-black flex flex-col md:flex-row items-center justify-between gap-4 font-bold text-slate-800 uppercase text-sm">
            <p>© 2026 TransitOps Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-black hover:underline underline-offset-4">Privacy Policy</a>
              <a href="#" className="hover:text-black hover:underline underline-offset-4">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
