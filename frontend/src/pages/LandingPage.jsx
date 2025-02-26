import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* Hero Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">BooksEra</span> 📚
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover books tailored to your interests, join virtual book clubs, and explore AI-powered summaries.
        </p>
      </motion.div>

      {/* Call-to-Action Buttons with Hover Effects */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 flex space-x-4"
      >
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-900 transition-transform transform hover:scale-105"
        >
          Log In
        </Link>
      </motion.div>

      {/* Features Section with Slide-in Animations */}
      <div className="mt-12 max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {[
          { title: "📖 AI Book Recommendations", desc: "Get personalized book suggestions." },
          { title: "💬 Virtual Book Clubs", desc: "Engage in discussions with readers worldwide." },
          { title: "🔍 AI-Generated Summaries", desc: "Save time with AI-powered book summaries." }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="p-4 bg-white rounded-lg shadow"
          >
            <h2 className="text-xl font-semibold text-gray-700">{feature.title}</h2>
            <p className="text-gray-500">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-16 max-w-3xl text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">What Readers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "Sarah L.", review: "BooksEra changed the way I read books! The recommendations are spot on." },
            { name: "John D.", review: "I love the AI summaries, they save me so much time!" }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
              className="p-4 bg-white rounded-lg shadow"
            >
              <p className="text-gray-600 italic">"{testimonial.review}"</p>
              <h3 className="text-gray-800 font-semibold mt-2">{testimonial.name}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default LandingPage;
