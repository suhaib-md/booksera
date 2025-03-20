import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import BookClubCard from "../components/BookClubCard";
import BookClubCreateModal from "../components/BookClubCreateModal";
import { backendAPI } from "../utils/api";

function Communities() {
  const [bookClubs, setBookClubs] = useState([]);
  const [myBookClubs, setMyBookClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myClubsLoading, setMyClubsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([
    { value: "", label: "All Categories" },
    { value: "fiction", label: "Fiction" },
    { value: "non_fiction", label: "Non-Fiction" },
    { value: "mystery", label: "Mystery" },
    { value: "science_fiction", label: "Science Fiction" },
    { value: "fantasy", label: "Fantasy" },
    { value: "biography", label: "Biography" },
    { value: "history", label: "History" },
    { value: "romance", label: "Romance" },
    { value: "thriller", label: "Thriller" },
    { value: "young_adult", label: "Young Adult" },
    { value: "classics", label: "Classics" },
    { value: "self_help", label: "Self Help" },
    { value: "poetry", label: "Poetry" },
    { value: "other", label: "Other" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery || selectedCategory) {
      fetchBookClubs();
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    fetchBookClubs();
    fetchMyBookClubs();
  }, []);

  const fetchBookClubs = async () => {
    setLoading(true);
    setError("");
    try {
      // Build query params
      let url = "/book-clubs/";
      const params = new URLSearchParams();
      
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await backendAPI.get(url, { withCredentials: true });
      setBookClubs(response.data.book_clubs || []);
    } catch (error) {
      console.error("Error fetching book clubs:", error);
      setError("Failed to load book clubs: " + (error.response?.data?.error || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookClubs = async () => {
    setMyClubsLoading(true);
    try {
      const response = await backendAPI.get(
        "/book-clubs/my-clubs/",
        { withCredentials: true }
      );
      setMyBookClubs(response.data.book_clubs || []);
    } catch (error) {
      console.error("Error fetching my book clubs:", error);
    } finally {
      setMyClubsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    fetchBookClubs();
    fetchMyBookClubs();
    setShowCreateModal(false);
  };

  const handleJoinClub = async (clubId) => {
    try {
      await backendAPI.post(
        `/book-clubs/${clubId}/join/`,
        {},
        { withCredentials: true }
      );
      fetchBookClubs(); // Refresh the list to update the "is_member" status
      fetchMyBookClubs(); // Update my clubs list
      alert("Successfully joined book club!");
    } catch (error) {
      console.error("Error joining book club:", error);
      alert("Failed to join book club: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  // Wrapper to adapt club data to BookClubCard component
  const renderClub = (club, isMember = false, role = null) => {
    return (
      <motion.div
        key={club.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="h-full"
      >
        <BookClubCard
          club={{
            name: club.name,
            description: club.description,
            category: club.category,
            image: club.image,
            current_book: club.current_book,
            current_book_image: club.current_book_image,
            members_count: club.member_count || club.members_count || 0,
            created_at: club.created_at
          }}
          isMember={isMember}
          role={role}
          onClick={() => navigate(`/communities/${club.id}`)}
          onJoin={() => handleJoinClub(club.id)}
        />
      </motion.div>
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
            <h1 className="text-3xl font-bold text-white">Book Communities</h1>
            <p className="text-purple-100 mt-2">Join clubs, discuss books, and connect with fellow readers</p>
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
          
          {/* My Book Clubs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="p-8">
              <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <span className="mr-2">👥</span> My Book Clubs
                </h2>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 sm:mt-0 px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
                >
                  Create Club
                </motion.button>
              </div>
              
              {myClubsLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-16 h-16 border-4 border-purple-400 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
              ) : myBookClubs.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myBookClubs.map((club) => renderClub(club, true, club.role))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-10 text-center shadow-inner"
                >
                  <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">You haven't joined any clubs yet</h3>
                  <p className="text-slate-600 mb-6">Join existing book clubs or create your own to discuss books with others</p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(true)} 
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
                  >
                    Create Your First Club
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          {/* Discover Book Clubs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center mb-6">
                <span className="mr-2">🔍</span> Discover Book Clubs
              </h2>
              
              {/* Search and Filter */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mb-8 bg-slate-50 p-4 rounded-xl shadow-inner"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Search book clubs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                  </div>
                  <div className="w-full md:w-64">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all appearance-none bg-white"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
              
              {/* Book Clubs List */}
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : bookClubs.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookClubs.map((club) => renderClub(club, club.is_member, club.role))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-10 text-center shadow-inner"
                >
                  <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No book clubs found</h3>
                  <p className="text-slate-600 mb-6">
                    {searchQuery || selectedCategory 
                      ? "Try adjusting your search criteria or clear filters to see more results" 
                      : "Be the first to create a book club!"
                    }
                  </p>
                  {searchQuery || selectedCategory ? (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("");
                      }} 
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
                    >
                      Clear Filters
                    </motion.button>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCreateModal(true)} 
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
                    >
                      Create a Book Club
                    </motion.button>
                  )}
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
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg cursor-pointer"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">📚</div>
                <div>
                  <h3 className="text-xl font-bold">My Bookshelf</h3>
                  <p className="opacity-90">Your personal library</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => navigate("/search")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg cursor-pointer"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">🔍</div>
                <div>
                  <h3 className="text-xl font-bold">Find Books</h3>
                  <p className="opacity-90">Discover new titles to discuss</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-6 rounded-2xl shadow-lg cursor-pointer"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">✨</div>
                <div>
                  <h3 className="text-xl font-bold">Create Club</h3>
                  <p className="opacity-90">Start your own community</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Create Book Club Modal */}
        {showCreateModal && (
          <BookClubCreateModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleCreateSuccess}
            categories={categories.filter(cat => cat.value !== "")}
          />
        )}
      </div>
    </AuthGuard>
  );
}

export default Communities;