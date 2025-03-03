import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { IoMdLogOut } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user profile from Django
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/profile/", {
          withCredentials: true,
        });
        setUser(response.data); // Set user state with full profile data, including profile_picture
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null); // Set to null if fetch fails (e.g., user not logged in)
      }
    };
    fetchUserProfile();
  }, []);

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
    axios
      .post("http://localhost:8000/api/logout/", {}, { withCredentials: true })
      .then(() => {
        setUser(null); // Remove user from state
        navigate("/login");
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 shadow-md flex justify-between items-center relative">
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
      <div className="flex items-center space-x-6 text-lg">
        <Link to="/home" className="hover:text-gray-200 transition">
          Home
        </Link>
        <Link to="/bookshelf" className="hover:text-gray-200 transition">
          My Bookshelf
        </Link>
        <Link to="/communities" className="hover:text-gray-200 transition">
          Communities
        </Link>

        {/* Profile Dropdown (Only Show If User is Logged In) */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center focus:outline-none"
            >
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              ) : (
                <MdAccountCircle className="text-white text-3xl" />
              )}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 hover:bg-gray-100 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <MdAccountCircle className="mr-2" /> View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-3 hover:bg-gray-100 transition"
                >
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