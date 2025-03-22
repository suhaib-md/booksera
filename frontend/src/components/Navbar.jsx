import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { IoMdLogOut, IoMdSearch } from "react-icons/io";
import { MdAccountCircle, MdHome, MdMenuBook, MdPeople, MdMovie } from "react-icons/md";
import { useAuth } from "../components/AuthContext";
import { motion } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout().then(() => navigate("/login"));
  };

  const goToSearch = () => {
    navigate("/search");
  };

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  // Helper function to check if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold tracking-wide flex items-center text-blue-600"
            >
              BooksEra<span className="text-slate-800">.</span>
            </Link>
          </div>

          {/* Search Button (center) */}
          <div className="hidden md:flex items-center justify-center flex-1 px-2 lg:px-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToSearch}
              className="bg-blue-600 px-4 py-2 rounded-full text-white text-sm font-medium shadow-md hover:shadow-lg transition flex items-center"
            >
              <IoMdSearch className="text-xl mr-2" />
              <span>Search Books</span>
            </motion.button>
          </div>

          {/* Navigation Links (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to="/home" 
                className={`flex items-center text-slate-600 hover:text-blue-600 transition-colors h-8 ${
                  isActive("/home") ? "text-blue-600 font-medium" : ""
                }`}
              >
                <MdHome className="mr-1" /> Home
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to="/bookshelf" 
                className={`flex items-center text-slate-600 hover:text-blue-600 transition-colors h-8 ${
                  isActive("/bookshelf") ? "text-blue-600 font-medium" : ""
                }`}
              >
                <MdMenuBook className="mr-1" /> My Bookshelf
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to="/communities" 
                className={`flex items-center text-slate-600 hover:text-blue-600 transition-colors h-8 ${
                  isActive("/communities") ? "text-blue-600 font-medium" : ""
                }`}
              >
                <MdPeople className="mr-1" /> Communities
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to="/movie-recommendations" 
                className={`flex items-center text-slate-600 hover:text-blue-600 transition-colors h-8 ${
                  isActive("/movie-recommendations") ? "text-blue-600 font-medium" : ""
                }`}
              >
                <MdMovie className="mr-1" /> Book To Screen
              </Link>
            </motion.div>
            
            {user && (
              <div className="relative ml-3" ref={dropdownRef}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex items-center focus:outline-none rounded-full p-1 hover:bg-slate-100 transition-colors"
                >
                  {user.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border-2 border-blue-100 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-100 shadow-sm">
                      <MdAccountCircle className="text-white text-xl" />
                    </div>
                  )}
                </motion.button>
                
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white text-black rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <div className="border-b border-gray-200 py-2 px-4">
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-3 hover:bg-gray-100 transition" 
                      onClick={() => setDropdownOpen(false)}
                    >
                      <MdAccountCircle className="mr-2 text-blue-600" /> View Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left flex items-center px-4 py-3 hover:bg-gray-100 transition text-red-600"
                    >
                      <IoMdLogOut className="mr-2" /> Logout
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md focus:outline-none text-slate-600 hover:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg border-b border-slate-200"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              goToSearch();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center w-full bg-blue-600 px-3 py-2 rounded-full text-white text-sm font-medium shadow-md hover:shadow-lg transition mb-4"
          >
            <IoMdSearch className="mr-2" /> Search Books
          </motion.button>

          <div className="space-y-3">
            <Link
              to="/home"
              className={`block px-3 py-2 rounded-lg text-base ${
                isActive("/home") ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              } transition-colors`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <MdHome className="mr-2" /> Home
              </div>
            </Link>

            <Link
              to="/bookshelf"
              className={`block px-3 py-2 rounded-lg text-base ${
                isActive("/bookshelf") ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              } transition-colors`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <MdMenuBook className="mr-2" /> My Bookshelf
              </div>
            </Link>

            <Link
              to="/communities"
              className={`block px-3 py-2 rounded-lg text-base ${
                isActive("/communities") ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              } transition-colors`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <MdPeople className="mr-2" /> Communities
              </div>
            </Link>

            <Link
              to="/movie-recommendations"
              className={`block px-3 py-2 rounded-lg text-base ${
                isActive("/movie-recommendations") ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              } transition-colors`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <MdMovie className="mr-2" /> Book To Screen
              </div>
            </Link>
            
            {user && (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-lg text-base text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <MdAccountCircle className="mr-2" /> Profile
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-base text-red-600 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center">
                    <IoMdLogOut className="mr-2" /> Logout
                  </div>
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

export default Navbar;