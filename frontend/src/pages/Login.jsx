import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { motion, useMotionValue, useTransform } from "framer-motion";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Mouse position tracking for cursor effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY + scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [scrollY]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({ identifier, password });
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials!");
      console.error("Login error:", err);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center py-24 px-4"
    >
      <motion.div
        className="fixed w-64 h-64 rounded-full bg-blue-300 filter blur-3xl opacity-20 pointer-events-none"
        style={{
          x: useTransform(mouseX, value => value - 128),
          y: useTransform(mouseY, value => value - 128)
        }}
      />
      
      {/* Simplified Navigation - just logo and signup button */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-blue-600"
          >
            <Link to="/">BooksEra<span className="text-slate-800">.</span></Link>
          </motion.div>
          <div>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                Sign Up
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 relative mt-16"
      >
        {/* Floating books animation */}
        <div className="absolute -z-10 -top-20 left-0 right-0 flex justify-center opacity-10 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ y: 0, opacity: 0, rotate: i % 2 === 0 ? -10 : 10 }}
              animate={{ 
                y: [0, -20, 0],
                opacity: [0, 0.8, 0],
                rotate: i % 2 === 0 ? [-10, 5, -10] : [10, -5, 10]
              }}
              transition={{ 
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.5
              }}
              className="w-16 h-24 mx-4 bg-blue-600/30 shadow-lg rounded"
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="mt-2 text-blue-100">Continue your reading journey</p>
          </div>
          
          <div className="p-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-center"
              >
                {error}
              </motion.div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  placeholder="Username or Email"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-blue-600 text-white font-medium rounded-full px-4 py-3 shadow-lg text-lg transition-all"
              >
                Log In
              </motion.button>
            </form>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-6 text-center flex flex-col space-y-4"
            >
              <p className="text-slate-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                  Sign up
                </Link>
              </p>
              
              <div className="text-xs text-slate-500">
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Features preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 gap-4 mt-6"
        >
          {[
            { icon: "🔍", title: "Search Over 10M Books" },
            { icon: "🌙", title: "Track Your Reading Goals" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-3"
            >
              <span className="text-2xl">{feature.icon}</span>
              <span className="text-sm font-medium text-slate-700">{feature.title}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;