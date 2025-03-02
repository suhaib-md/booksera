import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY}`
      );
      navigate("/search", { state: { books: response.data.items } });
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    axios.post("http://localhost:8000/api/logout/", {}, { withCredentials: true })
      .then(() => navigate("/login"))
      .catch((error) => console.error("Logout failed:", error));
  };

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null; // Hide navbar on login/signup pages
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md flex justify-between items-center">
      
      {/* Logo */}
      <Link to="/" className="text-3xl font-bold tracking-wide flex items-center">
        📚 BooksEra
      </Link>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center w-1/3 max-w-md">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 pl-4 w-full text-black rounded-l-md outline-none border-none focus:ring focus:ring-blue-300"
        />
        <button 
          type="submit" 
          className="bg-green-500 px-4 py-2 rounded-r-md hover:bg-green-600 transition"
        >
          🔍
        </button>
      </form>

      {/* Navigation Links */}
      <div className="flex space-x-6 text-lg">
        <Link to="/home" className="hover:text-gray-200 transition">Home</Link>
        <Link to="/bookshelf" className="hover:text-gray-200 transition">My Bookshelf</Link>
        <Link to="/communities" className="hover:text-gray-200 transition">Communities</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>

        {/* Show Logout button only if logged in */}
        {localStorage.getItem("token") && (
          <button 
            onClick={handleLogout} 
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
      
    </nav>
  );
}

export default Navbar;
