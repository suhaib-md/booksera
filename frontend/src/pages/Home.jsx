import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/AuthContext";
import { backendAPI, externalAPI } from "../utils/api";

function Home() {
  const { user } = useAuth();
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [error, setError] = useState("");
  const [trendingError, setTrendingError] = useState("");
  const [recommendationView, setRecommendationView] = useState("grid");
  const [trendingView, setTrendingView] = useState("grid");
  const [viewMoreRecommendations, setViewMoreRecommendations] = useState(false);
  const [viewMoreTrending, setViewMoreTrending] = useState(false);
  const [trendingPage, setTrendingPage] = useState(0);
  const navigate = useNavigate();
  
  // Reading goal and stats state
  const [readingGoal, setReadingGoal] = useState({
    target: 0,
    completed: 0
  });
  const [readingStats, setReadingStats] = useState({
    totalBooks: 0,
    totalPages: 0,
    averageRating: 0
  });
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoalTarget, setNewGoalTarget] = useState(0);

  useEffect(() => {
    if (user) {
      fetchPersonalizedRecommendations();
      fetchReadingGoal();
      fetchReadingStats();
    }
  }, [user]);

  useEffect(() => {
    fetchTrendingBooks();
  }, []);

  const fetchReadingGoal = async () => {
    try {
      const response = await backendAPI.get("/profile/reading-goal/", {
        withCredentials: true,
      });
      setReadingGoal({
        target: response.data.target || 0,
        completed: response.data.completed || 0
      });
      setNewGoalTarget(response.data.target || 0);
    } catch (error) {
      console.error("Error fetching reading goal:", error);
      // If endpoint doesn't exist yet, use default values
      setReadingGoal({
        target: user?.reading_goal?.target || 0,
        completed: user?.reading_goal?.completed || 0
      });
    }
  };

  const fetchReadingStats = async () => {
    try {
      const response = await backendAPI.get("/profile/reading-stats/", {
        withCredentials: true,
      });
      setReadingStats({
        totalBooks: response.data.total_books || 0,
        totalPages: response.data.total_pages || 0,
        averageRating: response.data.average_rating || 0
      });
    } catch (error) {
      console.error("Error fetching reading stats:", error);
      // Set default values if endpoint doesn't exist
      setReadingStats({
        totalBooks: 0,
        totalPages: 0,
        averageRating: 0
      });
    }
  };

  const updateReadingGoal = async () => {
    try {
      await backendAPI.post("/profile/reading-goal/", {
        target: newGoalTarget
      }, {
        withCredentials: true,
      });
      
      setReadingGoal({
        ...readingGoal,
        target: newGoalTarget
      });
      
      setEditingGoal(false);
    } catch (error) {
      console.error("Error updating reading goal:", error);
    }
  };

  const fetchPersonalizedRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await backendAPI.get("/personalized-recommendations/", {
        withCredentials: true,
      });
      const books = response.data.books || [];
      setRecommendedBooks(books);
      if (books.length === 0) {
        setError("No recommendations found based on your preferences.");
      }
    } catch (error) {
      console.error("Error fetching personalized recommendations:", error);
      setError(
        "Failed to load personalized recommendations: " +
          (error.response?.data?.error || "Unknown error")
      );
      setRecommendedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingBooks = async (startIndex = 0) => {
    setTrendingLoading(true);
    setTrendingError("");
    try {
      const response = await externalAPI.get(
        `https://www.googleapis.com/books/v1/volumes?q=best+books&orderBy=relevance&maxResults=16&startIndex=${startIndex}&key=${
          import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
        }`
      );

      if (startIndex === 0) {
        setTrendingBooks(response.data.items || []);
      } else {
        setTrendingBooks((prevBooks) => [
          ...prevBooks,
          ...(response.data.items || []),
        ]);
      }
      setTrendingPage(startIndex / 16);
    } catch (error) {
      console.error("Error fetching trending books:", error);
      setTrendingError("Failed to load trending books.");
    } finally {
      setTrendingLoading(false);
    }
  };

  const loadMoreTrendingBooks = () => {
    fetchTrendingBooks((trendingPage + 1) * 16);
  };

  const addToBookshelf = async (book, status) => {
    try {
      const bookData = {
        book_id: book.id,
        title: book.title || book.volumeInfo?.title || "Unknown Title",
        authors:
          book.authors ||
          book.volumeInfo?.authors?.join(", ") ||
          "Unknown Author",
        image: book.image || book.volumeInfo?.imageLinks?.thumbnail || "",
        status,
      };
      await backendAPI.post("/bookshelf/add/", bookData, {
        withCredentials: true,
      });
      alert(`Book added to ${status === "to_read" ? "To Read" : "Read"}!`);
    } catch (error) {
      console.error("Error adding to bookshelf:", error);
      alert("Failed to add book to bookshelf.");
    }
  };

  // Calculate progress percentage for reading goal
  const progressPercentage = readingGoal.target > 0 
    ? Math.min(Math.round((readingGoal.completed / readingGoal.target) * 100), 100)
    : 0;

  // Display books in grid view
  const renderBooksGrid = (books, isRecommended = true) => {
    const displayBooks = isRecommended
      ? viewMoreRecommendations
        ? books
        : books.slice(0, 8)
      : viewMoreTrending
      ? books
      : books.slice(0, 8);

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {displayBooks.map((book) => {
          const bookId = isRecommended ? book.id : book.id;
          const bookTitle = isRecommended
            ? book.title
            : book.volumeInfo?.title;
          const bookAuthors = isRecommended
            ? book.authors
            : book.volumeInfo?.authors?.join(", ") || "Unknown Author";
          const bookImage = isRecommended
            ? book.image
            : book.volumeInfo?.imageLinks?.thumbnail;
          const recommendationReason = isRecommended
            ? book.recommendation_reason
            : null;

          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              onClick={() => navigate(`/book/${bookId}`)}
            >
              <div className="relative pb-[140%]">
                <img
                  src={bookImage || "/placeholder.jpg"}
                  alt={bookTitle}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-slate-800 text-sm md:text-base truncate">
                  {bookTitle}
                </h4>
                <p className="text-slate-500 text-xs truncate mt-1">
                  {bookAuthors}
                </p>
                {recommendationReason && (
                  <p className="text-blue-600 text-xs mt-1 font-medium">
                    {recommendationReason}
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
          );
        })}
      </div>
    );
  };

  // Display books in carousel view
  const renderBooksCarousel = (books, isRecommended = true) => {
    const displayBooks = isRecommended
      ? viewMoreRecommendations
        ? books
        : books.slice(0, 8)
      : viewMoreTrending
      ? books
      : books.slice(0, 8);

    return (
      <div className="overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex space-x-6 px-2">
          {displayBooks.map((book) => {
            const bookId = isRecommended ? book.id : book.id;
            const bookTitle = isRecommended
              ? book.title
              : book.volumeInfo?.title;
            const bookAuthors = isRecommended
              ? book.authors
              : book.volumeInfo?.authors?.join(", ") || "Unknown Author";
            const bookImage = isRecommended
              ? book.image
              : book.volumeInfo?.imageLinks?.thumbnail;
            const recommendationReason = isRecommended
              ? book.recommendation_reason
              : null;

            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl flex-shrink-0 w-48 overflow-hidden"
                onClick={() => navigate(`/book/${bookId}`)}
              >
                <div className="relative pb-[140%]">
                  <img
                    src={bookImage || "/placeholder.jpg"}
                    alt={bookTitle}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-slate-800 text-sm truncate">
                    {bookTitle}
                  </h4>
                  <p className="text-slate-500 text-xs truncate mt-1">
                    {bookAuthors}
                  </p>
                  {recommendationReason && (
                    <p className="text-blue-600 text-xs mt-1 font-medium">
                      {recommendationReason}
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
            );
          })}
        </div>
      </div>
    );
  };

  const renderEmptyRecommendations = () => (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-10 text-center shadow-inner"
    >
      <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
        <span className="text-2xl">📚</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        No recommendations yet
      </h3>
      <p className="text-slate-600 mb-6">
        Update your profile with your favorite genres, authors, and books you've
        read!
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/profile")}
        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
      >
        Update Profile
      </motion.button>
    </motion.div>
  );

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
            <h1 className="text-3xl font-bold text-white">
              Welcome, {user?.username || "Reader"}! 🎉
            </h1>
            <p className="text-blue-100 mt-2">
              Discover your next favorite read today
            </p>
          </motion.div>
        </div>

        {/* Main content */}
        <div className="max-w-6xl mx-auto -mt-40 relative z-10 px-4 pb-12">
          {/* NEW: Reading Goals and Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reading Goal */}
                <div className="col-span-1 lg:col-span-2">
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                      <span className="mr-2">🎯</span> Your Reading Goal
                    </h2>
                    {!editingGoal ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditingGoal(true)}
                        className="text-sm px-4 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200"
                      >
                        Edit Goal
                      </motion.button>
                    ) : (
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={newGoalTarget}
                          onChange={(e) => setNewGoalTarget(parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border rounded text-center"
                          min="1"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={updateReadingGoal}
                          className="text-sm px-3 py-1 bg-green-600 text-white rounded-full"
                        >
                          Save
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setEditingGoal(false);
                            setNewGoalTarget(readingGoal.target);
                          }}
                          className="text-sm px-3 py-1 bg-slate-300 text-slate-700 rounded-full"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 shadow-inner mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600 font-medium">Progress</span>
                      <span className="text-blue-600 font-bold">
                        {readingGoal.completed} / {readingGoal.target} books
                      </span>
                    </div>
                    <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-right text-sm text-slate-500">
                      {progressPercentage}% complete
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                      <div className="text-blue-400 text-sm font-medium">Books Read</div>
                      <div className="text-blue-800 text-2xl font-bold">{readingStats.totalBooks}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl shadow-sm">
                      <div className="text-purple-400 text-sm font-medium">Pages Read</div>
                      <div className="text-purple-800 text-2xl font-bold">{readingStats.totalPages}</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl shadow-sm">
                      <div className="text-indigo-400 text-sm font-medium">Avg. Rating</div>
                      <div className="text-indigo-800 text-2xl font-bold">
                        {readingStats.averageRating.toFixed(1)} ⭐
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mood Reader Promo */}
                <div className="col-span-1">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="h-full bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-3xl mb-2">😊 🤔 😴</div>
                      <h3 className="text-xl font-bold mb-2">Need Book Recommendations?</h3>
                      <p className="text-blue-100 mb-4">
                        Tell us how you're feeling and we'll suggest the perfect books for your mood.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/mood")}
                      className="px-6 py-3 bg-white text-blue-600 rounded-full font-medium shadow-lg hover:shadow-xl transition-all w-full mt-4"
                    >
                      Try Mood Reader
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recommendations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="p-8">
              <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <span className="mr-2">📖</span> Recommended for You
                </h2>

                <div className="flex bg-gray-100 rounded-full p-1 mt-2 sm:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      recommendationView === "grid"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setRecommendationView("grid")}
                  >
                    Grid
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      recommendationView === "carousel"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setRecommendationView("carousel")}
                  >
                    Carousel
                  </motion.button>
                </div>
              </div>

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
              ) : recommendedBooks.length > 0 ? (
                <div className="mt-8">
                  {recommendationView === "grid"
                    ? renderBooksGrid(recommendedBooks)
                    : renderBooksCarousel(recommendedBooks)}

                  {recommendedBooks.length > 8 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8 text-center"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setViewMoreRecommendations(!viewMoreRecommendations)
                        }
                        className="px-6 py-2 bg-blue-100 text-blue-600 rounded-full font-medium hover:bg-blue-200 transition-all"
                      >
                        {viewMoreRecommendations
                          ? "Show Less"
                          : `View ${
                              recommendedBooks.length - 8
                            } More Recommendations`}
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              ) : (
                renderEmptyRecommendations()
              )}
            </div>
          </motion.div>

          {/* Trending Books Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="p-8">
              <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <span className="mr-2">🔥</span> Trending Books
                </h2>

                <div className="flex bg-gray-100 rounded-full p-1 mt-2 sm:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      trendingView === "grid"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setTrendingView("grid")}
                  >
                    Grid
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      trendingView === "carousel"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setTrendingView("carousel")}
                  >
                    Carousel
                  </motion.button>
                </div>
              </div>

              {trendingError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md"
                >
                  <p>{trendingError}</p>
                </motion.div>
              )}

              {trendingLoading && trendingBooks.length === 0 ? (
                <div className="flex justify-center py-16">
                  <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : trendingBooks.length > 0 ? (
                <div className="mt-8">
                  {trendingView === "grid"
                    ? renderBooksGrid(trendingBooks, false)
                    : renderBooksCarousel(trendingBooks, false)}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 text-center flex flex-wrap justify-center gap-4"
                  >
                    {trendingBooks.length > 8 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMoreTrending(!viewMoreTrending)}
                        className="px-6 py-2 bg-blue-100 text-blue-600 rounded-full font-medium hover:bg-blue-200 transition-all"
                      >
                        {viewMoreTrending
                          ? "Show Less"
                          : `View All ${trendingBooks.length} Books`}
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={loadMoreTrendingBooks}
                      disabled={trendingLoading}
                      className="px-6 py-2 bg-purple-100 text-purple-600 rounded-full font-medium hover:bg-purple-200 transition-all disabled:opacity-50"
                    >
                      {trendingLoading ? "Loading..." : "Load More Books"}
                    </motion.button>
                  </motion.div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-600">
                  No trending books found.
                </div>
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
                  <p className="opacity-90">Manage your reading list</p>
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

            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => navigate("/communities")}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg cursor-pointer"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">👥</div>
                <div>
                  <h3 className="text-xl font-bold">Communities</h3>
                  <p className="opacity-90">Join book discussions</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default Home;