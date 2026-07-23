import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Cpu, AlertTriangle, Eye, ShieldCheck, Leaf, Wallet, ArrowRight, Activity, Sparkles, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: "Appliance Detection",
    desc: "Disaggregate your house's electricity signature into appliance-level consumption patterns using only the main smart meter feed.",
    color: "text-electric-blue",
    bg: "bg-electric-blue/10",
    border: "border-electric-blue/20"
  },
  {
    icon: Cpu,
    title: "NILM AI Engine",
    desc: "Advanced Non-Intrusive Load Monitoring algorithms parse line transients and harmonics without requiring smart plugs.",
    color: "text-emerald-green",
    bg: "bg-emerald-green/10",
    border: "border-emerald-green/20"
  },
  {
    icon: AlertTriangle,
    title: "Energy Leak Detection",
    desc: "Instantly isolate stuck thermostats, vampire standby loads, and cycling motor inefficiencies drawing excess current.",
    color: "text-orange-warning",
    bg: "bg-orange-warning/10",
    border: "border-orange-warning/20"
  },
  {
    icon: Wallet,
    title: "Cost Prediction",
    desc: "Calculate cumulative costs and project future utility statements using historical metrics and local tariff scales.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  },
  {
    icon: Leaf,
    title: "Carbon Tracking",
    desc: "Track daily grid greenhouse footprints in real-time, matching offsets against average carbon absorption tree models.",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20"
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    desc: "Contextual advice compiled by Google Gemini based on your real-time appliance switch logs and anomaly registers.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20"
  }
];

const steps = [
  {
    num: "Step 01",
    title: "Upload aggregate power data",
    desc: "Ingest your smart-meter CSV telemetry or use our built-in load simulator."
  },
  {
    num: "Step 02",
    title: "AI detects appliances",
    desc: "NILM algorithms classify power step transients to isolate individual appliances."
  },
  {
    num: "Step 03",
    title: "Find energy leaks",
    desc: "The rule engine identifies vampire draws and abnormally long heating cycles."
  },
  {
    num: "Step 04",
    title: "Predict electricity bill",
    desc: "Linear statistical models project your monthly cost trend dynamically."
  },
  {
    num: "Step 05",
    title: "Receive Gemini recommendations",
    desc: "Get personalized, LLM-generated guidelines to slash your utility costs."
  }
];

export default function Landing() {
  return (
    <div className="relative pt-12 pb-24 overflow-hidden grid-bg">
      {/* Background glow templates */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-electric-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-emerald-green/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 bg-electric-blue/10 border border-electric-blue/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="h-4 w-4 text-electric-blue glow-blue" />
            <span className="text-xs font-semibold text-electric-blue tracking-wide uppercase">24h AI Hackathon MVP</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.1]">
            Understand Your Electricity Bill with <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-emerald-green glow-blue">AI</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Detect appliances, identify hidden energy leaks, estimate electricity costs, and receive AI-powered recommendations using only a single smart meter.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-electric-blue hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-electric-blue/20 hover:shadow-electric-blue/35 transition-all duration-300 transform hover:-translate-y-0.5 group"
            >
              <span>Start Monitoring</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/upload"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 px-8 py-4 rounded-2xl hover:border-white/20 transition-all duration-300"
            >
              <span>Upload Smart Meter Logs</span>
            </Link>
          </div>
        </motion.div>

        {/* Hero visual card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative max-w-5xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border border-white/5 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-electric-blue to-transparent opacity-40"></div>
          
          <h3 className="font-display text-xs font-semibold text-electric-blue uppercase tracking-widest mb-8">NILM Telemetry Pipeline</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            
            <div className="bg-black/35 p-5 rounded-2xl border border-white/5 flex flex-col items-center">
              <Activity className="h-10 w-10 text-electric-blue mb-3 animate-pulse" />
              <span className="text-sm font-bold text-white">Smart Meter</span>
              <span className="text-[10px] text-gray-500 mt-1">Aggregated Waveform</span>
            </div>

            <div className="hidden md:flex justify-center text-electric-blue">
              <motion.div animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ArrowRight className="h-6 w-6" />
              </motion.div>
            </div>

            <div className="bg-electric-blue/5 p-6 rounded-2xl border border-electric-blue/15 flex flex-col items-center relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue to-emerald-green rounded-2xl blur-md opacity-20"></div>
              <Zap className="h-10 w-10 text-electric-blue glow-blue mb-3 relative z-10 animate-bounce" />
              <span className="text-sm font-bold text-white relative z-10">VoltWise Engine</span>
              <span className="text-[10px] text-electric-blue font-semibold mt-1 relative z-10">AI Disaggregation</span>
            </div>

            <div className="hidden md:flex justify-center text-emerald-green">
              <motion.div animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}>
                <ArrowRight className="h-6 w-6" />
              </motion.div>
            </div>

            <div className="bg-black/35 p-5 rounded-2xl border border-white/5 flex flex-col items-center">
              <ShieldCheck className="h-10 w-10 text-emerald-green mb-3" />
              <span className="text-sm font-bold text-white">Appliance Signals</span>
              <span className="text-[10px] text-gray-500 mt-1">Individual Runtimes</span>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Core Platform Features</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Harnessing advanced NILM signal disaggregation and LLM recommenders to optimize home utility loads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/5 flex flex-col text-left group"
            >
              <div className={`${feat.bg} ${feat.color} p-4 rounded-xl border ${feat.border} w-fit mb-5 transition-transform duration-300 group-hover:scale-110`}>
                <feat.icon className="h-6 w-6 shrink-0" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works Steps Flow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Deconstruct your home energy footprints in 5 straightforward operational milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-left">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className="relative p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-electric-blue uppercase tracking-widest">{step.num}</span>
                <h4 className="font-display text-sm font-bold text-white mt-2 mb-2">{step.title}</h4>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
