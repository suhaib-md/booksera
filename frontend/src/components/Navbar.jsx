import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { IoMdLogOut } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { useAuth } from "../components/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all"); // New: Search type
  const [searchError, setSearchError] = useState("");

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

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 shadow-md flex justify-between items-center relative">
      <Link to="/" className="text-3xl font-bold tracking-wide flex items-center">
        📚 BooksEra
      </Link>
      <form onSubmit={handleSearch} className="flex items-center w-1/3 max-w-md relative">
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
          placeholder={`Search by ${searchType}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 pl-4 w-full text-black outline-none border-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="bg-green-500 px-4 py-2 rounded-r-md hover:bg-green-600 transition"
        >
          🔍
        </button>
        {searchError && (
          <p className="absolute top-full left-0 text-red-300 text-sm mt-1">{searchError}</p>
        )}
      </form>
      <div className="flex items-center space-x-6 text-lg">
        <Link to="/home" className="hover:text-gray-200 transition">Home</Link>
        <Link to="/bookshelf" className="hover:text-gray-200 transition">My Bookshelf</Link>
        <Link to="/communities" className="hover:text-gray-200 transition">Communities</Link>
        {user && (
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
              {user.profile_picture ? (
                <img src={user.profile_picture} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white" />
              ) : (
                <MdAccountCircle className="text-white text-3xl" />
              )}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">
                <Link to="/profile" className="flex items-center px-4 py-3 hover:bg-gray-100 transition" onClick={() => setDropdownOpen(false)}>
                  <MdAccountCircle className="mr-2" /> View Profile
                </Link>
                <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-3 hover:bg-gray-100 transition">
                  <IoMdLogOut className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;