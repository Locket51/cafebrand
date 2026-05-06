import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Coffee, Clock } from 'lucide-react';

const featuredDrinks = [
  {
    id: 1,
    name: 'Caramel Macchiato',
    price: '$5.50',
    description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and caramel drizzle.',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Artisan Pour Over',
    price: '$4.50',
    description: 'Single-origin beans expertly brewed to highlight their unique flavor profiles and bright acidity.',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Matcha Latte',
    price: '$5.00',
    description: 'Smooth and creamy matcha lightly sweetened and served with steamed milk.',
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?q=80&w=600&auto=format&fit=crop'
  }
];

const testimonials = [
  {
    id: 1,
    text: "The best coffee I've had in the city. The atmosphere is perfect for working or catching up with friends.",
    author: "Sarah Jenkins",
    role: "Local Writer"
  },
  {
    id: 2,
    text: "Their pour-over is out of this world. You can tell they really care about the quality of their beans.",
    author: "Michael Chen",
    role: "Coffee Enthusiast"
  },
  {
    id: 3,
    text: "A beautiful space with incredibly friendly staff. The pastries are always fresh and delicious.",
    author: "Emma Thompson",
    role: "Regular Customer"
  }
];

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop" 
            alt="Cafe Interior" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg">
              Awaken Your Senses
            </h1>
            <p className="text-lg md:text-2xl text-cafe-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
              Experience artisanal coffee and freshly baked pastries in a warm, inviting atmosphere.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/menu" 
                className="w-full sm:w-auto px-8 py-4 bg-cafe-600 hover:bg-cafe-700 text-white rounded-full font-medium transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                View Menu
              </Link>
              <Link 
                to="/reservation" 
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/50 text-white rounded-full font-medium transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                Book a Table
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Our Signature Drinks</h2>
            <div className="h-1 w-20 bg-cafe-600 mx-auto rounded-full mb-4"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Carefully crafted beverages made with premium, ethically sourced ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredDrinks.map((drink, index) => (
              <motion.div 
                key={drink.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-2xl overflow-hidden bg-muted/30 border border-border hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={drink.image} 
                    alt={drink.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-foreground">
                    {drink.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-foreground mb-2">{drink.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{drink.description}</p>
                  <Link to="/menu" className="inline-flex items-center text-cafe-600 dark:text-cafe-400 font-medium hover:text-cafe-700 dark:hover:text-cafe-300 transition-colors">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Info Banner */}
      <section className="py-20 bg-cafe-900 text-cafe-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-cafe-800 rounded-full flex items-center justify-center mb-6">
                <Coffee className="h-8 w-8 text-cafe-400" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-3">Premium Beans</h3>
              <p className="text-cafe-300">We source only the top 1% of Arabica beans globally.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-cafe-800 rounded-full flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-cafe-400" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-3">Expert Baristas</h3>
              <p className="text-cafe-300">Our team is rigorously trained in the art of coffee extraction.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-cafe-800 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-cafe-400" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-3">Fresh Daily</h3>
              <p className="text-cafe-300">Pastries and breads baked fresh in-house every morning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">What Our Guests Say</h2>
            <div className="h-1 w-20 bg-cafe-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-muted p-8 rounded-2xl relative"
              >
                <div className="flex text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-foreground italic mb-6">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
