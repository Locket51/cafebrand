import { motion } from 'framer-motion';
import { Leaf, Heart, Coffee } from 'lucide-react';

const team = [
  {
    id: 1,
    name: 'Elena Rodriguez',
    role: 'Head Roaster',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'David Kim',
    role: 'Lead Barista',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Sophie Laurent',
    role: 'Pastry Chef',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop'
  }
];

export default function About() {
  return (
    <div className="pt-24 pb-16 bg-background min-h-screen">
      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=800&auto=format&fit=crop" 
              alt="Cafe Owner pouring coffee" 
              className="rounded-2xl shadow-2xl object-cover h-[500px] w-full"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Our Story</h1>
            <div className="h-1 w-20 bg-cafe-600 mb-8"></div>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Founded in 2024, Aroma Cafe began with a simple dream: to create a cozy sanctuary where exceptional coffee meets warm community. We believe that a great cup of coffee has the power to start conversations, inspire creativity, and bring people together.
              </p>
              <p>
                Every bean we roast and every pastry we bake is crafted with intention. We've spent countless hours sourcing the finest ethical ingredients, partnering directly with farmers who share our commitment to sustainability and quality.
              </p>
              <p>
                Whether you're stopping by for your morning commute or settling in for an afternoon of reading, we're here to make your day a little brighter.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted py-20 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">What drives us every day to pour the perfect cup.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-cafe-600">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-3">Sustainability</h3>
              <p className="text-muted-foreground">From compostable packaging to zero-waste practices, we minimize our footprint.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-cafe-600">
                <Coffee className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-3">Quality First</h3>
              <p className="text-muted-foreground">We never compromise. Only the top tier of specialty beans make it into our hoppers.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-cafe-600">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-3">Community</h3>
              <p className="text-muted-foreground">A safe, welcoming space for everyone. We support local artists and charities.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Meet the Team</h2>
          <div className="h-1 w-20 bg-cafe-600 mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">The passionate people behind your daily brew.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {team.map((member, index) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="relative mb-6 mx-auto w-64 h-64 overflow-hidden rounded-full border-4 border-muted">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-serif font-bold text-foreground">{member.name}</h3>
              <p className="text-cafe-600 dark:text-cafe-400 font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
