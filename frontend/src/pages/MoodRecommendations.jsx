import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/AuthContext";
import { backendAPI } from "../utils/api";

function MoodRecommendations() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState("");
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [moodDescription, setMoodDescription] = useState("");
  const [view, setView] = useState("grid");
  const navigate = useNavigate();

  // Mood options with emoji and names
  const moods = [
    { id: "happy", emoji: "😊", name: "Happy" },
    { id: "sad", emoji: "😢", name: "Sad" },
    { id: "inspired", emoji: "✨", name: "Inspired" },
    { id: "adventurous", emoji: "🌍", name: "Adventurous" },
    { id: "relaxed", emoji: "😌", name: "Relaxed" },
    { id: "anxious", emoji: "😰", name: "Anxious" },
    { id: "romantic", emoji: "❤️", name: "Romantic" },
    { id: "curious", emoji: "🧠", name: "Curious" },
    { id: "nostalgic", emoji: "🕰️", name: "Nostalgic" },
    { id: "scared", emoji: "😱", name: "Scared" },
    { id: "angry", emoji: "😤", name: "Angry" },
    { id: "bored", emoji: "😴", name: "Bored" },
    { id: "confused", emoji: "🤔", name: "Confused" },
    { id: "hopeful", emoji: "🌈", name: "Hopeful" }
  ];

  const fetchMoodRecommendations = async (mood) => {
    setLoading(true);
    setError("");
    try {
      const response = await backendAPI.get(
        `/mood-recommendations/?mood=${mood}`,
        { withCredentials: true }
      );
      console.log("Mood recommendations response:", response.data);
      setRecommendedBooks(response.data.books || []);
      setMoodDescription(response.data.mood_description || "");
      
      if (response.data.books.length === 0) {
        setError(`No books found for your ${mood} mood. Try another mood!`);
      }
    } catch (error) {
      console.error("Error fetching mood recommendations:", error);
      setError("Failed to load recommendations: " + (error.response?.data?.error || "Unknown error"));
      setRecommendedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    fetchMoodRecommendations(mood);
    // Scroll to books section
    setTimeout(() => {
      document.getElementById("recommendations-section")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const addToBookshelf = async (book, status) => {
    try {
      const bookData = {
        book_id: book.id,
        title: book.title || "Unknown Title",
        authors: book.authors || "Unknown Author",
        image: book.image || "",
        status,
      };
      await backendAPI.post(
        '/bookshelf/add/',
        bookData,
        { withCredentials: true }
      );
      // Using a more modern toast notification would be better here
      alert(`Book added to ${status === "to_read" ? "To Read" : "Read"}!`);
    } catch (error) {
      console.error("Error adding to bookshelf:", error);
      alert("Failed to add book to bookshelf.");
    }
  };

  // Display books in grid view
  const renderBooksGrid = (books) => {
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
            onClick={() => navigate(`/book/${book.id}`)}
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
              {book.recommendation_reason && (
                <p className="text-indigo-600 text-xs italic mt-2 line-clamp-2">
                  "{book.recommendation_reason}"
                </p>
              )}
              
              <div className="mt-4 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToBookshelf(book, "to_read");
                  }}
                  className="flex-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                >
                  To Read
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToBookshelf(book, "read");
                  }}
                  className="flex-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full hover:bg-green-700 transition-colors shadow-sm"
                >
                  Read
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Display books in carousel view
  const renderBooksCarousel = (books) => {
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
              onClick={() => navigate(`/book/${book.id}`)}
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
                {book.recommendation_reason && (
                  <p className="text-indigo-600 text-xs italic mt-2 line-clamp-2">
                    "{book.recommendation_reason}"
                  </p>
                )}
                
                <div className="mt-4 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToBookshelf(book, "to_read");
                    }}
                    className="flex-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    To Read
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToBookshelf(book, "read");
                    }}
                    className="flex-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Read
                  </motion.button>
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
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-b-[40px] h-64"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center pt-20 pb-16"
          >
            <h1 className="text-3xl font-bold text-white">How are you feeling today?</h1>
            <p className="text-purple-100 mt-2">Find books that match your current mood</p>
          </motion.div>
        </div>
        
        {/* Main content */}
        <div className="max-w-6xl mx-auto -mt-40 relative z-10 px-4 pb-12">
          {/* Mood Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="mr-2">🎭</span> Choose Your Mood
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {moods.map((mood) => (
                  <motion.div
                    key={mood.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoodSelect(mood.id)}
                    className={`p-4 rounded-lg cursor-pointer text-center ${
                      selectedMood === mood.id
                        ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-md"
                        : "bg-slate-50 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <div className="font-medium text-sm">{mood.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Recommendations Section */}
          <motion.div
            id="recommendations-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="p-8">
              {selectedMood ? (
                <>
                  <div className="flex flex-wrap justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                      <span className="mr-2">{moods.find(m => m.id === selectedMood)?.emoji}</span> 
                      Books for your {moods.find(m => m.id === selectedMood)?.name} Mood
                    </h2>
                    
                    <div className="flex bg-gray-100 rounded-full p-1 mt-2 sm:mt-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                          view === "grid" 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "text-slate-600 hover:bg-gray-200"
                        }`}
                        onClick={() => setView("grid")}
                      >
                        Grid
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                          view === "carousel" 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "text-slate-600 hover:bg-gray-200"
                        }`}
                        onClick={() => setView("carousel")}
                      >
                        Carousel
                      </motion.button>
                    </div>
                  </div>
                  
                  {moodDescription && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl mb-6 text-slate-700 border border-slate-200 shadow-sm"
                    >
                      <p className="italic">{moodDescription}</p>
                    </motion.div>
                  )}
                  
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
                      <div className="w-16 h-16 border-4 border-purple-400 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                  ) : recommendedBooks.length > 0 ? (
                    <div className="mt-8">
                      {view === "grid" 
                        ? renderBooksGrid(recommendedBooks) 
                        : renderBooksCarousel(recommendedBooks)}
                    </div>
                  ) : !loading && (
                    <motion.div
                      initial={{ opacity: 0.5, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-10 text-center shadow-inner"
                    >
                      <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <span className="text-2xl">📚</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">No books found for this mood</h3>
                      <p className="text-slate-600 mb-6">Try selecting a different mood from the options above</p>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-10 text-center shadow-inner"
                >
                  <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-2xl">👆</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Select a mood above</h3>
                  <p className="text-slate-600">We'll recommend books that match how you're feeling</p>
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
              onClick={() => navigate("/bookshelf")}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg cursor-pointer"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">📚</div>
                <div>
                  <h3 className="text-xl font-bold">My Bookshelf</h3>
                  <p className="opacity-90">View your reading list</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => navigate("/search")}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 rounded-2xl shadow-lg cursor-pointer"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">🔍</div>
                <div>
                  <h3 className="text-xl font-bold">Search Books</h3>
                  <p className="opacity-90">Find specific titles</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => navigate("/profile")}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg cursor-pointer"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">👤</div>
                <div>
                  <h3 className="text-xl font-bold">My Profile</h3>
                  <p className="opacity-90">Reading goals and preferences</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default MoodRecommendations;