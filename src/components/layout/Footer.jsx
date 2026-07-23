import { Link } from 'react-router-dom';
import { Zap, Cpu, Server, Database, Radio } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#03050d] border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Background glowing aura */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-electric-blue/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <Zap className="h-6 w-6 text-electric-blue glow-blue" />
              <span className="font-display text-xl font-bold tracking-tight text-white">
                VoltWise<span className="text-electric-blue">AI</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering households with Non-Intrusive Load Monitoring. Detect energy leaks, monitor appliances, and optimize bills using only a single smart meter.
            </p>
            <div className="flex space-x-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">24h AI Hackathon MVP</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-6">App Navigation</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-electric-blue transition-colors">Landing Page</Link></li>
              <li><Link to="/dashboard" className="hover:text-electric-blue transition-colors">Main Dashboard</Link></li>
              <li><Link to="/upload" className="hover:text-electric-blue transition-colors">Data Uploader</Link></li>
            </ul>
          </div>

          {/* Tech Stack Details */}
          <div>
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-6">Tech Stack</h3>
            <div className="space-y-4 text-xs text-gray-400">
              <div className="flex items-start space-x-2">
                <Cpu className="h-4 w-4 text-electric-blue shrink-0 mt-0.5" />
                <span><strong>Frontend:</strong> React, Vite, TypeScript, TailwindCSS v4, Recharts, Framer Motion</span>
              </div>
              <div className="flex items-start space-x-2">
                <Server className="h-4 w-4 text-emerald-green shrink-0 mt-0.5" />
                <span><strong>Backend:</strong> FastAPI, Python, Pandas, NumPy, Scikit-learn</span>
              </div>
              <div className="flex items-start space-x-2">
                <Database className="h-4 w-4 text-orange-warning shrink-0 mt-0.5" />
                <span><strong>Databases:</strong> MongoDB Atlas, SQLite cache</span>
              </div>
            </div>
          </div>

          {/* Future Integration Channels */}
          <div>
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-6">Integrations</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Radio className="h-4 w-4 text-gray-500 shrink-0" />
                <span>Actian VectorAI Placeholder</span>
              </li>
              <li className="flex items-center space-x-2">
                <Radio className="h-4 w-4 text-gray-500 shrink-0" />
                <span>Solana Blockchain Stubs</span>
              </li>
              <li className="flex items-center space-x-2">
                <Radio className="h-4 w-4 text-gray-500 shrink-0" />
                <span>Gemini API Savings Reports</span>
              </li>
              <li className="flex items-center space-x-2">
                <Radio className="h-4 w-4 text-gray-500 shrink-0" />
                <span>ElevenLabs Speech Narrations</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p className="text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} VoltWise AI. Built for the International AI Hackathon.
          </p>
          <div className="flex space-x-6">
            <span>Model Version: v1.1.0</span>
            <span>Accuracy: 98.7%</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
