import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-cafe-900 text-cafe-100 pt-16 pb-8 border-t border-cafe-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <Coffee className="h-8 w-8 text-cafe-400" />
              <span className="font-serif text-2xl font-bold tracking-tight text-white">Aroma Cafe</span>
            </Link>
            <p className="text-cafe-300 text-sm leading-relaxed mb-6">
              Crafting perfect moments, one cup at a time. Join us for artisanal coffee, fresh pastries, and a warm atmosphere.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-cafe-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="text-cafe-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-cafe-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm text-cafe-300">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/menu" className="hover:text-white transition-colors">Menu</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/reservation" className="hover:text-white transition-colors">Book a Table</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-cafe-300">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-cafe-500 shrink-0" />
                <span>123 Coffee Lane<br />Seattle, WA 98101</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-cafe-500 shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-cafe-500 shrink-0" />
                <span>hello@aromacafe.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-6">Opening Hours</h3>
            <ul className="space-y-3 text-sm text-cafe-300">
              <li className="flex justify-between border-b border-cafe-800 pb-2">
                <span>Mon - Fri</span>
                <span>8:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-cafe-800 pb-2">
                <span>Saturday</span>
                <span>9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between pb-2">
                <span>Sunday</span>
                <span>10:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cafe-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cafe-400 text-sm text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Aroma Cafe. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-cafe-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
