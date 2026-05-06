import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { addMessage } from '../services/db';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await addMessage(data);
      setIsSuccess(true);
      reset();
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to send message", error);
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Contact Us</h1>
          <div className="h-1 w-20 bg-cafe-600 mx-auto rounded-full mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-muted p-8 rounded-2xl border border-border">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-background p-3 rounded-full text-cafe-600 shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Location</h3>
                    <p className="text-muted-foreground mt-1">123 Coffee Lane<br />Seattle, WA 98101</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-background p-3 rounded-full text-cafe-600 shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Phone</h3>
                    <p className="text-muted-foreground mt-1">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-background p-3 rounded-full text-cafe-600 shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Email</h3>
                    <p className="text-muted-foreground mt-1">hello@aromacafe.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-background p-3 rounded-full text-cafe-600 shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Hours</h3>
                    <p className="text-muted-foreground mt-1">Mon - Fri: 8am - 8pm<br />Sat: 9am - 6pm<br />Sun: 10am - 4pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="h-64 rounded-2xl overflow-hidden border border-border">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d86064.06733230836!2d-122.39958190917969!3d47.6131742054668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54906ab3f905c4b1%3A0x96bf575ff75cb1aa!2sPike%20Place%20Market!5e0!3m2!1sen!2sus!4v1714080112345!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Cafe Location Map"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-muted p-8 md:p-12 rounded-2xl border border-border"
          >
            {isSuccess ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-16 h-full flex flex-col justify-center"
              >
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Message Sent!</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Thank you for reaching out. We will get back to you as soon as possible.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-8 py-3 bg-cafe-600 text-white rounded-full font-medium hover:bg-cafe-700 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <input 
                      {...register("name", { required: "Name is required" })}
                      type="text" 
                      className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-cafe-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-border'}`}
                      placeholder="Your Name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input 
                      {...register("email", { 
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                      })}
                      type="email" 
                      className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-cafe-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-border'}`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea 
                      {...register("message", { required: "Message is required" })}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-cafe-500 outline-none transition-all resize-none ${errors.message ? 'border-red-500' : 'border-border'}`}
                      placeholder="How can we help you?"
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-cafe-800 hover:bg-cafe-900 text-white dark:bg-cafe-200 dark:hover:bg-cafe-300 dark:text-cafe-900 rounded-lg font-bold transition-colors flex justify-center items-center disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-cafe-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Send Message <Send className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
