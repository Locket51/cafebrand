import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  // Coffee
  { id: 1, category: 'coffee', name: 'Espresso', price: '$3.00', description: 'Rich, full-bodied shot of our signature blend.', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=300&auto=format&fit=crop' },
  { id: 2, category: 'coffee', name: 'Cappuccino', price: '$4.50', description: 'Equal parts espresso, steamed milk, and milk foam.', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=300&auto=format&fit=crop' },
  { id: 3, category: 'coffee', name: 'Latte', price: '$4.50', description: 'Espresso with steamed milk and a light layer of foam.', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=300&auto=format&fit=crop' },
  { id: 4, category: 'coffee', name: 'Cold Brew', price: '$4.00', description: 'Slow-steeped for 18 hours for a smooth, sweet finish.', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=300&auto=format&fit=crop' },
  // Desserts
  { id: 5, category: 'desserts', name: 'Tiramisu', price: '$7.00', description: 'Coffee-soaked ladyfingers with mascarpone cream.', image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=300&auto=format&fit=crop' },
  { id: 6, category: 'desserts', name: 'Cheesecake', price: '$6.50', description: 'Classic New York style with a graham cracker crust.', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=300&auto=format&fit=crop' },
  { id: 7, category: 'desserts', name: 'Macarons', price: '$3.50', description: 'Assorted seasonal flavors. Light and airy.', image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=300&auto=format&fit=crop' },
  // Snacks
  { id: 8, category: 'snacks', name: 'Avocado Toast', price: '$8.50', description: 'Sourdough with smashed avocado, radish, and microgreens.', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=300&auto=format&fit=crop' },
  { id: 9, category: 'snacks', name: 'Croissant', price: '$3.75', description: 'Flaky, buttery, baked fresh every morning.', image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=300&auto=format&fit=crop' },
  { id: 10, category: 'snacks', name: 'Bagel & Cream Cheese', price: '$4.50', description: 'Toasted everything bagel with whipped cream cheese.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300&auto=format&fit=crop' },
];

const categories = [
  { id: 'all', label: 'All Items' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'snacks', label: 'Snacks' },
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredMenu = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="pt-24 pb-16 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Our Menu</h1>
          <div className="h-1 w-20 bg-cafe-600 mx-auto rounded-full mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated selection of beverages and treats.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-cafe-600 text-white shadow-md'
                  : 'bg-muted text-foreground hover:bg-cafe-200 dark:hover:bg-cafe-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-muted/30 rounded-xl overflow-hidden border border-border flex flex-col sm:flex-row hover:shadow-lg transition-shadow"
              >
                <div className="sm:w-1/3 h-48 sm:h-auto shrink-0 relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col justify-center flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-serif text-foreground">{item.name}</h3>
                    <span className="font-bold text-cafe-600 dark:text-cafe-400">{item.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
