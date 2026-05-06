import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { addReservation } from '../services/db';

export default function Reservation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await addReservation({
        ...data,
        status: 'pending'
      });
      setIsSuccess(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to submit reservation", error);
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date formatted for the min attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="pt-24 pb-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Book a Table</h1>
          <div className="h-1 w-20 bg-cafe-600 mx-auto rounded-full mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join us for an unforgettable cafe experience. We recommend booking in advance for weekends.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted p-8 md:p-12 rounded-2xl shadow-sm border border-border"
        >
          {isSuccess ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-16"
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Booking Request Sent!</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Thank you for choosing Aroma Cafe. We've received your request and will confirm your table within 2 hours.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="px-8 py-3 bg-cafe-600 text-white rounded-full font-medium hover:bg-cafe-700 transition-colors"
              >
                Book Another Table
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input 
                    {...register("name", { required: "Name is required" })}
                    type="text" 
                    className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-cafe-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-border'}`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input 
                    {...register("email", { 
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                    })}
                    type="email" 
                    className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-cafe-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-border'}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <input 
                    {...register("phone", { required: "Phone number is required" })}
                    type="tel" 
                    className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-cafe-500 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-border'}`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* Party Size */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Party Size</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <select 
                      {...register("partySize", { required: "Party size is required" })}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-cafe-500 outline-none transition-all appearance-none ${errors.partySize ? 'border-red-500' : 'border-border'}`}
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input 
                      {...register("date", { required: "Date is required" })}
                      type="date"
                      min={minDate}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-cafe-500 outline-none transition-all ${errors.date ? 'border-red-500' : 'border-border'}`}
                    />
                  </div>
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <select 
                      {...register("time", { required: "Time is required" })}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-cafe-500 outline-none transition-all appearance-none ${errors.time ? 'border-red-500' : 'border-border'}`}
                    >
                      <option value="">Select a time</option>
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                    </select>
                  </div>
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Special Requests (Optional)</label>
                <textarea 
                  {...register("requests")}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-cafe-500 outline-none transition-all resize-none"
                  placeholder="Window seating, allergies, high chair needed, etc."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-cafe-800 hover:bg-cafe-900 text-white dark:bg-cafe-200 dark:hover:bg-cafe-300 dark:text-cafe-900 rounded-lg font-bold text-lg transition-colors flex justify-center items-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-cafe-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Request Booking"
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
