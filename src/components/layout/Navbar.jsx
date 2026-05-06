import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Coffee, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Menu', path: '/menu' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Reservation', path: '/reservation' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    localStorage.setItem('darkMode', newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-cafe-600 dark:text-cafe-400" />
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">Aroma Cafe</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-cafe-600 dark:hover:text-cafe-400 ${
                    isActive ? 'text-cafe-600 dark:text-cafe-400 border-b-2 border-cafe-600 dark:border-cafe-400' : 'text-foreground/80'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-muted transition-colors">
              {darkMode ? <Sun className="h-5 w-5 text-cafe-400" /> : <Moon className="h-5 w-5 text-cafe-600" />}
            </button>
            <Link
              to="/reservation"
              className="bg-cafe-800 hover:bg-cafe-900 text-white dark:bg-cafe-200 dark:hover:bg-cafe-300 dark:text-cafe-900 px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm"
            >
              Book Table
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-muted transition-colors">
              {darkMode ? <Sun className="h-5 w-5 text-cafe-400" /> : <Moon className="h-5 w-5 text-cafe-600" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-foreground p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-3 text-base font-medium rounded-md ${
                      isActive ? 'bg-muted text-cafe-700 dark:text-cafe-300' : 'text-foreground hover:bg-muted'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <Link
                to="/reservation"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center mt-4 bg-cafe-800 text-white dark:bg-cafe-200 dark:text-cafe-900 px-5 py-3 rounded-md text-base font-medium"
              >
                Book Table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
