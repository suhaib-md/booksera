import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/AuthContext";

function Search() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchView, setSearchView] = useState("grid");
  const [searching, setSearching] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const navigate = useNavigate();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const maxResults = 20; // Number of results per page

  const genres = [
    "Fiction", "Fantasy", "Science Fiction", "Mystery", "Thriller", 
    "Romance", "Biography", "History", "Self-Help", "Business",
    "Children", "Young Adult", "Poetry", "Science", "Technology"
  ];

  const handleSearch = async (e, newPage = 1) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!searchQuery && !selectedGenre) {
      setError("Please enter a search term or select a genre");
      return;
    }

    setLoading(true);
    setError("");
    setSearching(true);
    setCurrentPage(newPage);
    
    const newStartIndex = (newPage - 1) * maxResults;
    setStartIndex(newStartIndex);
    
    let query = searchQuery;
    if (selectedGenre) {
      query = query ? `${query}+subject:${selectedGenre}` : `subject:${selectedGenre}`;
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${newStartIndex}&maxResults=${maxResults}&key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY}`
      );
      
      setSearchResults(response.data.items || []);
      setTotalItems(response.data.totalItems || 0);
      
      if (!response.data.items || response.data.items.length === 0) {
        setError("No books found. Try a different search term.");
      }
    } catch (error) {
      console.error("Error searching books:", error);
      setError("Failed to search books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    handleSearch(null, newPage);
    // Scroll to results section
    document.getElementById("search-results").scrollIntoView({ behavior: "smooth" });
  };

  const addToBookshelf = async (book, status) => {
    try {
      const bookData = {
        book_id: book.id,
        title: book.volumeInfo?.title || "Unknown Title",
        authors: book.volumeInfo?.authors?.join(", ") || "Unknown Author",
        image: book.volumeInfo?.imageLinks?.thumbnail || "",
        status,
      };
      await axios.post(
        "http://localhost:8000/api/bookshelf/add/",
        bookData,
        { withCredentials: true }
      );
      alert(`Book added to ${status === "to_read" ? "To Read" : "Read"}!`);
    } catch (error) {
      console.error("Error adding to bookshelf:", error);
      alert("Failed to add book to bookshelf.");
    }
  };

  // Display books in carousel view
  const renderBooksCarousel = (books) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl flex flex-col cursor-pointer"
            onClick={() => navigate(`/book/${book.book_id || book.id}`)}
          >
            <img
              src={book.volumeInfo?.imageLinks?.thumbnail || "placeholder.jpg"}
              alt={book.volumeInfo?.title}
              className="w-36 h-56 object-cover rounded-md shadow mx-auto"
            />
            <h4 className="font-semibold text-center mt-2 text-lg truncate">{book.volumeInfo?.title}</h4>
            <p className="text-gray-600 text-sm text-center truncate">
              {book.volumeInfo?.authors?.join(", ") || "Unknown Author"}
            </p>
            <p className="text-gray-500 text-xs mt-1 text-center">{book.volumeInfo?.publishedDate}</p>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2 h-10">
              {book.volumeInfo?.description?.substring(0, 100)}
              {book.volumeInfo?.description?.length > 100 ? "..." : ""}
            </p>
            <div className="mt-2 flex justify-center space-x-2">
              <button
                onClick={() => addToBookshelf(book, "to_read")}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                To Read
              </button>
              <button
                onClick={() => addToBookshelf(book, "read")}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Read
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Display books in grid view
  const renderBooksGrid = (books) => {
    return (
      <div className="overflow-x-auto whitespace-nowrap pb-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="inline-block bg-white p-4 rounded-lg shadow-md hover:shadow-xl w-64 mx-2 flex-shrink-0 cursor-pointer"
            onClick={() => navigate(`/book/${book.book_id || book.id}`)}
          >
            <div className="flex-grow flex items-center justify-center">
              <img
                src={book.volumeInfo?.imageLinks?.thumbnail || "placeholder.jpg"}
                alt={book.volumeInfo?.title}
                className="w-32 h-48 object-cover rounded-md shadow"
              />
            </div>
            <div className="mt-2">
              <h4 className="font-semibold text-center text-md truncate">{book.volumeInfo?.title}</h4>
              <p className="text-gray-600 text-xs text-center truncate">
                {book.volumeInfo?.authors?.join(", ") || "Unknown Author"}
              </p>
              <div className="mt-2 flex justify-center space-x-2">
                <button
                  onClick={() => addToBookshelf(book, "to_read")}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                >
                  To Read
                </button>
                <button
                  onClick={() => addToBookshelf(book, "read")}
                  className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                >
                  Read
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Pagination component
  const renderPagination = () => {
    const totalPages = Math.ceil(totalItems / maxResults);
    
    // Limit total pages to 50 (Google Books API limit)
    const maxDisplayedPages = Math.min(totalPages, 50);
    
    // Only show pagination if we have enough results
    if (maxDisplayedPages <= 1) return null;
    
    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(maxDisplayedPages, startPage + 4);
    
    // Adjust if we're at the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return (
      <div className="flex items-center justify-center space-x-1 mt-6">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 text-blue-700"
          }`}
        >
          First
        </button>
        
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 text-blue-700"
          }`}
        >
          &laquo;
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-blue-100 hover:bg-blue-200 text-blue-700"
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= maxDisplayedPages}
          className={`px-3 py-1 rounded ${
            currentPage >= maxDisplayedPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 text-blue-700"
          }`}
        >
          &raquo;
        </button>
        
        <button
          onClick={() => handlePageChange(maxDisplayedPages)}
          disabled={currentPage >= maxDisplayedPages}
          className={`px-3 py-1 rounded ${
            currentPage >= maxDisplayedPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 text-blue-700"
          }`}
        >
          Last
        </button>
      </div>
    );
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-3xl font-semibold mb-2">
            Book Search 🔍
          </h2>
          <p className="text-white opacity-90">Find your next great read</p>
        </div>

        {/* Search Form */}
        <section className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or keyword..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full md:w-1/4">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
        </section>

        {/* Search Results */}
        {searching && (
          <section id="search-results" className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                Search Results
                {totalItems > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Showing {startIndex + 1}-{Math.min(startIndex + maxResults, totalItems)} of {totalItems})
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex bg-gray-200 rounded-lg p-1">
                  <button
                    className={`px-3 py-1 rounded-md ${
                      searchView === "grid" ? "bg-white shadow" : ""
                    }`}
                    onClick={() => setSearchView("grid")}
                  >
                    Grid
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md ${
                      searchView === "carousel" ? "bg-white shadow" : ""
                    }`}
                    onClick={() => setSearchView("carousel")}
                  >
                    Carousel
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                {searchView === "carousel" 
                  ? renderBooksCarousel(searchResults) 
                  : renderBooksGrid(searchResults)}
                
                {/* Pagination */}
                {renderPagination()}
              </div>
            ) : !error && (
              <p className="text-gray-600 text-center py-8">
                No books found. Try a different search term.
              </p>
            )}
          </section>
        )}

        {/* Quick Actions */}
        <section className="max-w-6xl mx-auto p-6 mt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => navigate("/bookshelf")}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">📚</div>
                <div>
                  <h3 className="text-xl font-bold">My Bookshelf</h3>
                  <p className="opacity-90">Manage your reading list</p>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => navigate("/mood")}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">😊</div>
                <div>
                  <h3 className="text-xl font-bold">Mood Reader</h3>
                  <p className="opacity-90">Find books that match your mood</p>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => navigate("/communities")}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">👥</div>
                <div>
                  <h3 className="text-xl font-bold">Communities</h3>
                  <p className="opacity-90">Join book discussions</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}

export default Search;