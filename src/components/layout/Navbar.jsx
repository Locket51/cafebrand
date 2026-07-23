import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Zap, LayoutDashboard, Upload, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Data Upload', path: '/upload', icon: Upload }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { aggregatePower, isBackendConnected } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-dark/80 backdrop-blur-md border-b border-white/5 shadow-lg py-3' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-electric-blue/10 p-2 rounded-xl border border-electric-blue/30 group-hover:border-electric-blue/70 transition-all duration-300 relative overflow-hidden">
              <Zap className="h-6 w-6 text-electric-blue glow-blue relative z-10 animate-pulse" />
              <div className="absolute inset-0 bg-electric-blue/20 blur-md opacity-50"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-extrabold tracking-tight text-white flex items-center">
                VoltWise<span className="text-electric-blue">AI</span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-wider uppercase font-semibold leading-none">NILM DETECTOR</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/5 ${
                    isActive 
                      ? 'text-electric-blue bg-electric-blue/10 border border-electric-blue/25' 
                      : 'text-gray-300 hover:text-white border border-transparent'
                  }`
                }
              >
                <link.icon className="h-4 w-4 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Real-time Meter & Connection Status */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Live Meter Power Draw Pill */}
            <div className="flex items-center space-x-2 bg-black/40 border border-white/5 rounded-full px-4 py-1.5">
              <Activity className="h-4 w-4 text-electric-blue animate-pulse" />
              <span className="text-xs font-semibold text-gray-400">Meter:</span>
              <span className="text-sm font-bold text-white glow-blue">
                {aggregatePower.toLocaleString()} W
              </span>
            </div>

            {/* Connection Status Indicator */}
            {isBackendConnected ? (
              <div className="flex items-center space-x-1.5 bg-emerald-green/10 border border-emerald-green/20 rounded-full px-3 py-1 text-xs font-semibold text-emerald-green">
                <span className="h-2 w-2 rounded-full bg-emerald-green animate-ping"></span>
                <span>FastAPI Live</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 bg-orange-warning/10 border border-orange-warning/20 rounded-full px-3 py-1 text-xs font-semibold text-orange-warning">
                <span className="h-2 w-2 rounded-full bg-orange-warning"></span>
                <span>Simulated</span>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <div className="bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-white border border-white/5">
              {aggregatePower} W
            </div>
            
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-300 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-bg-dark/95 border-b border-white/10 backdrop-blur-xl absolute top-full left-0 w-full"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive 
                        ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/25' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <link.icon className="h-5 w-5 text-gray-400" />
                  <span>{link.name}</span>
                </NavLink>
              ))}

              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between px-4 py-2 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-sm text-gray-400">Current Power Draw:</span>
                  <span className="text-sm font-bold text-white glow-blue">{aggregatePower} W</span>
                </div>
                
                <div className="flex items-center justify-between px-4 py-2 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-sm text-gray-400">Connection Mode:</span>
                  {isBackendConnected ? (
                    <span className="text-xs font-bold text-emerald-green">FastAPI Live</span>
                  ) : (
                    <span className="text-xs font-bold text-orange-warning">Simulated</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
