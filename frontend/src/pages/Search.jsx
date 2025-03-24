import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/AuthContext";
import { backendAPI, externalAPI } from "../utils/api";

function Search() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchView, setSearchView] = useState("grid");
  const [searching, setSearching] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [popularCategories, setPopularCategories] = useState([]);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState("");
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

  useEffect(() => {
    // Fetch popular categories on component mount
    fetchPopularCategories();
  }, []);

  const fetchPopularCategories = async () => {
    setLoadingCategories(true);
    try {
      // Use the new backend endpoint to fetch categories
      const response = await backendAPI.get("/categories/");
      const categories = response.data.categories || [];
      
      setPopularCategories(categories);
      
      // Fetch books for the first category if available
      if (categories.length > 0) {
        setActiveCategoryTab(categories[0].id);
        await fetchCategoryBooks(categories[0].id);
      }
    } catch (error) {
      console.error("Error fetching popular categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchCategoryBooks = async (categoryId) => {
    setLoadingCategories(true);
    try {
      // Use the new backend endpoint to fetch books by category
      const response = await backendAPI.get(`/category/browse/?category=${categoryId}&max_results=10`);
      
      // Update state with the fetched books
      setCategoryBooks(response.data.books || []);
    } catch (error) {
      console.error(`Error fetching ${categoryId} books:`, error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategoryTabChange = async (categoryId) => {
    setActiveCategoryTab(categoryId);
    await fetchCategoryBooks(categoryId);
  };

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
      const response = await externalAPI.get(
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

  // Updated addToBookshelf function for Search.jsx
  const addToBookshelf = async (e, book, status) => {
    e.stopPropagation(); // Prevent navigation when clicking buttons
    try {
      // Check if this is a book from search results (Google Books API)
      const isSearchResult = book.volumeInfo !== undefined;
      
      const bookData = {
        book_id: book.id,
        title: isSearchResult ? book.volumeInfo?.title : book.title || "Unknown Title",
        authors: isSearchResult 
          ? (book.volumeInfo?.authors?.join(", ") || "Unknown Author") 
          : (book.authors || "Unknown Author"),
        image: isSearchResult 
          ? (book.volumeInfo?.imageLinks?.thumbnail || "") 
          : (book.image || ""),
        status,
      };
      
      console.log("Adding book to bookshelf:", bookData);
      
      await backendAPI.post(
        "/bookshelf/add/",
        bookData,
        { withCredentials: true }
      );
      
      alert(`Book added to ${status === "to_read" ? "To Read" : "Read"}!`);
    } catch (error) {
      console.error("Error adding to bookshelf:", error);
      
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      
      alert("Failed to add book to bookshelf.");
    }
  };

  // Updated to handle the new backend response format
  const renderBooksGrid = (books, isSearchResults = true) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => {
          // Handle both formats (direct API and backend API)
          const bookInfo = isSearchResults ? book.volumeInfo : book;
          const bookId = isSearchResults ? book.id : book.id;
          const title = isSearchResults ? bookInfo?.title : bookInfo?.title;
          const authors = isSearchResults ? bookInfo?.authors?.join(", ") : bookInfo?.authors;
          const image = isSearchResults ? bookInfo?.imageLinks?.thumbnail : bookInfo?.image;

          return (
            <motion.div
              key={bookId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
              onClick={() => navigate(`/book/${bookId}`)}
            >
              <div className="relative pb-[140%]">
                <img
                  src={image || "/placeholder.jpg"}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-slate-800 text-sm md:text-base truncate">
                  {title}
                </h4>
                <p className="text-slate-500 text-xs truncate mt-1">
                  {authors || "Unknown Author"}
                </p>

                <div className="mt-4 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => addToBookshelf(e, book, "to_read")}
                    className="flex-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    To Read
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => addToBookshelf(e, book, "read")}
                    className="flex-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Read
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Updated to handle the new backend response format  
  const renderBooksCarousel = (books, isSearchResults = true) => {
    return (
      <div className="overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex space-x-6 px-2">
          {books.map((book) => {
            // Handle both formats (direct API and backend API)
            const bookInfo = isSearchResults ? book.volumeInfo : book;
            const bookId = isSearchResults ? book.id : book.id;
            const title = isSearchResults ? bookInfo?.title : bookInfo?.title;
            const authors = isSearchResults ? bookInfo?.authors?.join(", ") : bookInfo?.authors;
            const image = isSearchResults ? bookInfo?.imageLinks?.thumbnail : bookInfo?.image;

            return (
              <motion.div
                key={bookId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl flex-shrink-0 w-48 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/book/${bookId}`)}
              >
                <div className="relative pb-[140%]">
                  <img
                    src={image || "/placeholder.jpg"}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-slate-800 text-sm truncate">
                    {title}
                  </h4>
                  <p className="text-slate-500 text-xs truncate mt-1">
                    {authors || "Unknown Author"}
                  </p>
                  
                  <div className="mt-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => addToBookshelf(e, book, "to_read")}
                      className="flex-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      To Read
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => addToBookshelf(e, book, "read")}
                      className="flex-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full hover:bg-green-700 transition-colors shadow-sm"
                    >
                      Read
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-full ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 text-blue-700"
          }`}
        >
          First
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-full ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 text-blue-700"
          }`}
        >
          &laquo;
        </motion.button>
        
        {pages.map(page => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-full ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-md"
                : "bg-blue-100 hover:bg-blue-200 text-blue-700"
            }`}
          >
            {page}
          </motion.button>
        ))}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= maxDisplayedPages}
          className={`px-3 py-1 rounded-full ${
            currentPage >= maxDisplayedPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 text-blue-700"
          }`}
        >
          &raquo;
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(maxDisplayedPages)}
          disabled={currentPage >= maxDisplayedPages}
          className={`px-3 py-1 rounded-full ${
            currentPage >= maxDisplayedPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 text-blue-700"
          }`}
        >
          Last
        </motion.button>
      </div>
    );
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Header section with curved background */}
        <div className="relative mb-32">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-b-[40px] h-64"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center pt-20 pb-16"
          >
            <h1 className="text-3xl font-bold text-white">Search Books</h1>
            <p className="text-blue-100 mt-2">Discover your next great read</p>
          </motion.div>
        </div>
        
        {/* Main content */}
        <div className="max-w-6xl mx-auto -mt-40 relative z-10 px-4 pb-12">
          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="mr-2">🔍</span> Find Books
              </h2>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title, author, or keyword..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none bg-white"
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
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
                    >
                      {loading ? "Searching..." : "Search"}
                    </motion.button>
                  </div>
                </div>
              </form>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Search Results Section */}
          {searching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              id="search-results"
              className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center">
                    <span className="mr-2">🔍</span> Search Results
                    {totalItems > 0 && (
                      <span className="text-sm font-normal text-slate-500 ml-2">
                        (Showing {startIndex + 1}-{Math.min(startIndex + maxResults, totalItems)} of {totalItems})
                      </span>
                    )}
                  </h2>
                  
                  <div className="flex bg-slate-100 rounded-full p-1 mt-2 sm:mt-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                        searchView === "grid" 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                      onClick={() => setSearchView("grid")}
                    >
                      Grid
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                        searchView === "carousel" 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                      onClick={() => setSearchView("carousel")}
                    >
                      Carousel
                    </motion.button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="mt-8">
                    {searchView === "grid" 
                      ? renderBooksGrid(searchResults, true) 
                      : renderBooksCarousel(searchResults, true)}
                    
                    {/* Pagination */}
                    {renderPagination()}
                  </div>
                ) : !error && (
                  <motion.div
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-10 text-center shadow-inner"
                  >
                    <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No books found</h3>
                    <p className="text-slate-600 mb-6">Try different keywords or browse our categories</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Browse Categories Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="mr-2">📚</span> Browse Categories
              </h2>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {popularCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryTabChange(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategoryTab === category.id
                        ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span className="mr-1">{category.emoji}</span> {category.name}
                  </motion.button>
                ))}
              </div>
              
              {/* Category Books */}
              {loadingCategories ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : categoryBooks.length > 0 ? (
                <div className="mt-6">
                  {renderBooksCarousel(categoryBooks, false)}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-8 text-center">
                  <p className="text-slate-600">No books found in this category.</p>
                </div>
              )}
            </div>
          </motion.div>
          
          
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => navigate("/bookshelf")}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg cursor-pointer"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">📚</div>
                <div>
                  <h3 className="text-xl font-bold">My Bookshelf</h3>
                  <p className="opacity-90">Track your reading journey</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => navigate("/profile")}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 rounded-2xl shadow-lg cursor-pointer"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">👤</div>
                <div>
                  <h3 className="text-xl font-bold">My Profile</h3>
                  <p className="opacity-90">Reading goals and preferences</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => navigate("/mood")}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 rounded-2xl shadow-lg cursor-pointer"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">😊</div>
                <div>
                  <h3 className="text-xl font-bold">Mood Reader</h3>
                  <p className="opacity-90">Find books for your mood</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default Search;