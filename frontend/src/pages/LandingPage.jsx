import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

function LandingPage() {
  // Mouse position tracking for cursor effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // State for scroll position to trigger animations
  const [scrollY, setScrollY] = useState(0);
  
  // Update mouse position
  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };
  
  // Update scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Features with improved descriptions
  const features = [
    {
      icon: "📚",
      title: "Personalized AI Recommendations",
      desc: "Our advanced AI learns your reading preferences and suggests books you'll actually love.",
      color: "bg-gradient-to-r from-blue-400 to-blue-600"
    },
    {
      icon: "😊",
      title: "Mood-Based Recommendations",
      desc: "Tell us how you feel, and we'll recommend the perfect book to match your current mood.",
      color: "bg-gradient-to-r from-purple-400 to-purple-600"
    },
    {
      icon: "📝",
      title: "AI-Generated Summaries",
      desc: "Get concise, intelligent summaries of any book to help you decide what to read next.",
      color: "bg-gradient-to-r from-green-400 to-green-600"
    },
    {
      icon: "👥",
      title: "Virtual Book Clubs",
      desc: "Connect with readers worldwide, join discussions, and share your thoughts in our community.",
      color: "bg-gradient-to-r from-yellow-400 to-yellow-600"
    }
  ];

  // Testimonials with more detailed reviews
  const testimonials = [
    {
      name: "Sarah L.",
      role: "Avid Reader",
      review: "BooksEra's AI recommendations introduced me to my new favorite author! The mood-based system is eerily accurate.",
      avatar: "src/assets/sarah.jpeg"
    },
    {
      name: "John D.",
      role: "Book Club Host",
      review: "I run three virtual book clubs on BooksEra. The community features make discussions engaging and seamless.",
      avatar: "src/assets/john.jpeg"
    },
    {
      name: "Maya K.",
      role: "Busy Professional",
      review: "The AI summaries help me keep up with my reading goal despite my hectic schedule. Absolutely game-changing!",
      avatar: "src/assets/maya.jpeg"
    }
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800"
      onMouseMove={handleMouseMove}
    >
      {/* Cursor follower effect */}
      <motion.div
        className="fixed w-64 h-64 rounded-full bg-blue-300 filter blur-3xl opacity-20 pointer-events-none"
        style={{
          x: useTransform(mouseX, (value) => value - 128),
          y: useTransform(mouseY, (value) => value - 128),
        }}
      />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-blue-600"
          >
            BooksEra<span className="text-slate-800">.</span>
          </motion.div>
          <div className="flex items-center space-x-6">
            <motion.a 
              whileHover={{ y: -2 }}
              className="text-slate-600 hover:text-blue-600 transition-colors flex items-center h-8"
              href="#features"
            >
              Features
            </motion.a>
            <motion.a 
              whileHover={{ y: -2 }}
              className="text-slate-600 hover:text-blue-600 transition-colors flex items-center h-8"
              href="#testimonials"
            >
              Testimonials
            </motion.a>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with enhanced animation */}
      <div className="relative overflow-hidden pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-6 text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Your Next <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Reading Adventure
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              BooksEra combines AI-powered recommendations with a vibrant community
              to transform how you discover, experience, and share books.
            </p>
          </motion.div>

          {/* Single CTA button centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex justify-center mt-10"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white font-medium rounded-full px-8 py-4 text-lg shadow-lg"
              >
                Start Reading Smarter
              </motion.button>
            </Link>
          </motion.div>

          {/* Floating books animation */}
          <div className="absolute -bottom-16 left-0 right-0 flex justify-center opacity-20 pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ y: 100, opacity: 0, rotate: i % 2 === 0 ? -10 : 10 }}
                animate={{ 
                  y: [100, -20, 100],
                  opacity: [0, 1, 0],
                  rotate: i % 2 === 0 ? [-10, 5, -10] : [10, -5, 10]
                }}
                transition={{ 
                  duration: 12 + i * 2,
                  repeat: Infinity,
                  delay: i * 1.5
                }}
                className="w-16 h-24 mx-2 bg-white shadow-lg rounded opacity-70"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats counter section */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-6">
          {[
            { value: "50K+", label: "Active Readers" },
            { value: "1M+", label: "Books Analyzed" },
            { value: "200K+", label: "AI Summaries" },
            { value: "5K+", label: "Book Clubs" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col items-center"
            >
              <span className="text-4xl font-bold text-blue-600">{stat.value}</span>
              <span className="text-slate-500 mt-2">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features with interactive cards */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Unique AI Features</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              BooksEra combines cutting-edge AI technology with a passionate reading community
              to create a truly unique book discovery platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transform transition-all duration-300"
              >
                <div className={`${feature.color} p-6 text-white text-center`}>
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <div className="p-6 flex-1">
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
<section className="py-24 bg-slate-50">
  <div className="max-w-6xl mx-auto px-6">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">How BooksEra Works</h2>
      <p className="text-xl text-slate-600 max-w-3xl mx-auto">
        Our AI-powered platform evolves with you, learning your preferences to deliver increasingly personalized recommendations.
      </p>
    </motion.div>
    
    {/* Fixed alignment issues */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { step: "01", title: "Create Profile", desc: "Tell us about your reading preferences and interests." },
        { step: "02", title: "Get Recommendations", desc: "Receive AI-curated suggestions tailored to your taste and mood." },
        { step: "03", title: "Explore & Read", desc: "Discover new books with AI summaries to guide your choices." },
        { step: "04", title: "Join Community", desc: "Connect with like-minded readers in virtual book clubs." }
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          viewport={{ once: true }}
          className="text-center relative"
        >
          <div className="relative z-10">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              {item.step}
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-600">{item.desc}</p>
          </div>
          
          {/* Connecting line between steps */}
          {index < 3 && (
            <div className="hidden md:block absolute top-6 left-1/2 w-full h-1 bg-slate-200">
              <motion.div 
                className="h-full bg-blue-600" 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* Testimonials section */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Readers Say</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover how BooksEra is transforming reading experiences around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-slate-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 italic">"{testimonial.review}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Reading Experience?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of readers who've discovered their next favorite book through BooksEra.
            </p>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 font-bold text-lg rounded-full px-8 py-4 shadow-lg"
              >
                Start Your Free Trial
              </motion.button>
            </Link>
            <p className="mt-4 text-sm opacity-80">No credit card required. 14-day free trial.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">BooksEra</h3>
            <p className="text-slate-400">Revolutionizing how you discover and experience books through AI and community.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Features</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">AI Recommendations</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Mood-Based Discovery</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">AI Summaries</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Virtual Book Clubs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-700 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} BooksEra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;