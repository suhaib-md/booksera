import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/AuthContext";
import { backendAPI } from "../utils/api";

function Bookshelf() {
  const { user } = useAuth();
  const [toRead, setToRead] = useState([]);
  const [read, setRead] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toReadView, setToReadView] = useState("grid");
  const [readView, setReadView] = useState("grid");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchBookshelf();
    }
  }, [user]);

  const fetchBookshelf = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await backendAPI.get("/bookshelf/", {
        withCredentials: true,
      });
      setToRead(response.data.to_read || []);
      setRead(response.data.read || []);
    } catch (error) {
      console.error("Error fetching bookshelf:", error);
      setError("Failed to load your bookshelf: " + (error.response?.data?.error || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (e, bookId, newStatus) => {
    e.stopPropagation(); // Prevent navigation when clicking buttons
    try {
      await backendAPI.post(
        "/bookshelf/update/",
        { book_id: bookId, status: newStatus },
        { withCredentials: true }
      );
      await fetchBookshelf();
      // Using a more modern toast notification would be better here
      alert(`Book moved to ${newStatus === "to_read" ? "To Read" : "Read"}!`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update book status.");
    }
  };

  const removeFromBookshelf = async (e, bookId) => {
    e.stopPropagation(); // Prevent navigation when clicking buttons
    try {
      await backendAPI.post(
        "/bookshelf/remove/",
        { book_id: bookId },
        { withCredentials: true }
      );
      await fetchBookshelf();
      alert("Book removed from bookshelf!");
    } catch (error) {
      console.error("Error removing book:", error);
      alert("Failed to remove book from bookshelf.");
    }
  };

  const navigateToBook = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  // Display books in grid view
  const renderBooksGrid = (books, section) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all"
            onClick={() => navigateToBook(book.book_id || book.id)}
          >
            <div className="relative pb-[140%]">
              <img
                src={book.image || "/placeholder.jpg"}
                alt={book.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-slate-800 text-sm md:text-base truncate">{book.title}</h4>
              <p className="text-slate-500 text-xs truncate mt-1">{book.authors}</p>
              
              <div className="mt-4 flex space-x-2">
                {section === "toRead" ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => updateStatus(e, book.id, "read")}
                      className="flex-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full hover:bg-green-700 transition-colors shadow-sm"
                    >
                      Read
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => removeFromBookshelf(e, book.id)}
                      className="flex-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                    >
                      Remove
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => updateStatus(e, book.id, "to_read")}
                      className="flex-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      To Read
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => removeFromBookshelf(e, book.id)}
                      className="flex-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                    >
                      Remove
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Display books in carousel view
  const renderBooksCarousel = (books, section) => {
    return (
      <div className="overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex space-x-6 px-2">
          {books.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl flex-shrink-0 w-48 overflow-hidden"
              onClick={() => navigateToBook(book.book_id || book.id)}
            >
              <div className="relative pb-[140%]">
                <img
                  src={book.image || "/placeholder.jpg"}
                  alt={book.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-slate-800 text-sm truncate">{book.title}</h4>
                <p className="text-slate-500 text-xs truncate mt-1">{book.authors}</p>
                
                <div className="mt-4 flex space-x-2">
                  {section === "toRead" ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => updateStatus(e, book.id, "read")}
                        className="flex-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full hover:bg-green-700 transition-colors shadow-sm"
                      >
                        Read
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => removeFromBookshelf(e, book.id)}
                        className="flex-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                      >
                        Remove
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => updateStatus(e, book.id, "to_read")}
                        className="flex-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        To Read
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => removeFromBookshelf(e, book.id)}
                        className="flex-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                      >
                        Remove
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
            <h1 className="text-3xl font-bold text-white">My Bookshelf</h1>
            <p className="text-blue-100 mt-2">Track and manage your reading journey</p>
          </motion.div>
        </div>
        
        {/* Main content */}
        <div className="max-w-6xl mx-auto -mt-40 relative z-10 px-4 pb-12">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md"
            >
              <p>{error}</p>
            </motion.div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* To Read Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
              >
                <div className="p-8">
                  <div className="flex flex-wrap justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                      <span className="mr-2">📖</span> To Read
                    </h2>
                    
                    <div className="flex bg-gray-100 rounded-full p-1 mt-2 sm:mt-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                          toReadView === "grid" 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "text-slate-600 hover:bg-gray-200"
                        }`}
                        onClick={() => setToReadView("grid")}
                      >
                        Grid
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                          toReadView === "carousel" 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "text-slate-600 hover:bg-gray-200"
                        }`}
                        onClick={() => setToReadView("carousel")}
                      >
                        Carousel
                      </motion.button>
                    </div>
                  </div>
                  
                  {toRead.length > 0 ? (
                    <div className="mt-8">
                      {toReadView === "grid" 
                        ? renderBooksGrid(toRead, "toRead") 
                        : renderBooksCarousel(toRead, "toRead")}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0.5, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-10 text-center shadow-inner"
                    >
                      <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <span className="text-2xl">📚</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Your reading list is empty</h3>
                      <p className="text-slate-600 mb-6">Discover new books and add them to your reading list</p>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/search")} 
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
                      >
                        Find Books
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
              
              {/* Read Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
              >
                <div className="p-8">
                  <div className="flex flex-wrap justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                      <span className="mr-2">✅</span> Read
                    </h2>
                    
                    <div className="flex bg-gray-100 rounded-full p-1 mt-2 sm:mt-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                          readView === "grid" 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "text-slate-600 hover:bg-gray-200"
                        }`}
                        onClick={() => setReadView("grid")}
                      >
                        Grid
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                          readView === "carousel" 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "text-slate-600 hover:bg-gray-200"
                        }`}
                        onClick={() => setReadView("carousel")}
                      >
                        Carousel
                      </motion.button>
                    </div>
                  </div>
                  
                  {read.length > 0 ? (
                    <div className="mt-8">
                      {readView === "grid" 
                        ? renderBooksGrid(read, "read") 
                        : renderBooksCarousel(read, "read")}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0.5, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-10 text-center shadow-inner"
                    >
                      <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <span className="text-2xl">📖</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">You haven't finished any books yet</h3>
                      <p className="text-slate-600 mb-2">
                        {toRead.length > 0 
                          ? "Start reading books from your reading list and mark them as read when you're done!" 
                          : "Add books to your reading list and mark them as read when you finish them."}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
              
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <motion.div 
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  onClick={() => navigate("/search")}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">🔍</div>
                    <div>
                      <h3 className="text-xl font-bold">Search Books</h3>
                      <p className="opacity-90">Discover new titles</p>
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
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

export default Bookshelf;