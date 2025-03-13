import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdLogOut, IoMdSearch } from "react-icons/io";
import { MdAccountCircle, MdHome, MdMenuBook, MdPeople } from "react-icons/md";
import { useAuth } from "../components/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [searchError, setSearchError] = useState("");
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

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError("");

    if (!searchQuery.trim()) {
      setSearchError("Please enter a search term.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/search/?q=${encodeURIComponent(searchQuery)}&type=${searchType}`,
        { withCredentials: true }
      );
      const { books, totalItems } = response.data;
      if (books.length === 0) {
        setSearchError("No books found for this query.");
      } else {
        navigate("/search", { state: { books, query: searchQuery, totalItems, searchType } });
      }
    } catch (error) {
      console.error("Error searching books:", error);
      setSearchError("An error occurred while searching. Please try again.");
    }
  };

  const handleLogout = () => {
    logout().then(() => navigate("/login"));
  };

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  // Helper function to check if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold tracking-wide flex items-center"
            >
              <span className="mr-2">📚</span>
              <span className="hidden sm:inline">BooksEra</span>
            </Link>
          </div>

          {/* Search Bar (hidden on mobile) */}
          <div className="hidden md:flex items-center justify-center flex-1 px-2 lg:px-6">
            <form onSubmit={handleSearch} className="flex items-center w-full max-w-md relative">
              <div className="flex-shrink-0 flex rounded-l-md overflow-hidden">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="p-2 text-black outline-none border-r border-gray-300 focus:ring-2 focus:ring-blue-300 bg-white"
                >
                  <option value="all">All</option>
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                  <option value="isbn">ISBN</option>
                </select>
              </div>
              
              <input
                type="text"
                placeholder={`Search by ${searchType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 pl-4 w-full text-black outline-none focus:ring-2 focus:ring-blue-300"
              />
              
              <button
                type="submit"
                className="bg-green-500 px-4 py-2 rounded-r-md hover:bg-green-600 transition flex items-center"
              >
                <IoMdSearch className="text-xl" />
              </button>
              
              {searchError && (
                <p className="absolute top-full left-0 text-red-300 text-sm mt-1 bg-gray-900 bg-opacity-80 px-2 py-1 rounded">
                  {searchError}
                </p>
              )}
            </form>
          </div>

          {/* Navigation Links (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/home" 
              className={`flex items-center px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors ${
                isActive("/home") ? "bg-blue-700 font-medium" : ""
              }`}
            >
              <MdHome className="mr-1" /> Home
            </Link>
            
            <Link 
              to="/bookshelf" 
              className={`flex items-center px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors ${
                isActive("/bookshelf") ? "bg-blue-700 font-medium" : ""
              }`}
            >
              <MdMenuBook className="mr-1" /> My Bookshelf
            </Link>
            
            <Link 
              to="/communities" 
              className={`flex items-center px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors ${
                isActive("/communities") ? "bg-blue-700 font-medium" : ""
              }`}
            >
              <MdPeople className="mr-1" /> Communities
            </Link>
            
            {user && (
              <div className="relative ml-3" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex items-center focus:outline-none rounded-full p-1 hover:bg-blue-500 transition-colors"
                >
                  {user.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center border-2 border-white">
                      <MdAccountCircle className="text-white text-xl" />
                    </div>
                  )}
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50 animated fadeIn">
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
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md focus:outline-none focus:bg-blue-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-800 px-2 pt-2 pb-4 space-y-1 sm:px-3">
          <form onSubmit={handleSearch} className="flex items-center mb-3 relative">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="p-2 text-black rounded-l-md outline-none border-none"
            >
              <option value="all">All</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="isbn">ISBN</option>
            </select>
            <input
              type="text"
              placeholder={`Search...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 pl-4 w-full text-black outline-none border-none"
            />
            <button
              type="submit"
              className="bg-green-500 px-4 py-2 rounded-r-md hover:bg-green-600 transition"
            >
              <IoMdSearch />
            </button>
            {searchError && (
              <p className="absolute top-full left-0 text-red-300 text-sm mt-1 bg-gray-900 bg-opacity-80 px-2 py-1 rounded">
                {searchError}
              </p>
            )}
          </form>

          <Link
            to="/home"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/home") ? "bg-blue-700" : "hover:bg-blue-700"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <MdHome className="mr-2" /> Home
            </div>
          </Link>

          <Link
            to="/bookshelf"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/bookshelf") ? "bg-blue-700" : "hover:bg-blue-700"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <MdMenuBook className="mr-2" /> My Bookshelf
            </div>
          </Link>

          <Link
            to="/communities"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/communities") ? "bg-blue-700" : "hover:bg-blue-700"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <MdPeople className="mr-2" /> Communities
            </div>
          </Link>

          {user && (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
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
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-blue-700"
              >
                <div className="flex items-center">
                  <IoMdLogOut className="mr-2" /> Logout
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;