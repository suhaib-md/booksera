import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/AuthContext";

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

  useEffect(() => {
    if (user) {
      fetchPersonalizedRecommendations();
    }
  }, [user]);

  const fetchPersonalizedRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "http://localhost:8000/api/personalized-recommendations/",
        { withCredentials: true }
      );
      console.log("Recommendations response:", response.data);
      const books = response.data.books || [];
      setRecommendedBooks(books);
      if (books.length === 0) {
        setError("No recommendations found based on your preferences.");
      }
    } catch (error) {
      console.error("Error fetching personalized recommendations:", error);
      console.log("Error response:", error.response?.data);
      setError("Failed to load personalized recommendations: " + (error.response?.data?.error || "Unknown error"));
      setRecommendedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingBooks = async (startIndex = 0) => {
    setTrendingLoading(true);
    setTrendingError("");
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=best+books&orderBy=relevance&maxResults=16&startIndex=${startIndex}&key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY}`
      );
      
      if (startIndex === 0) {
        setTrendingBooks(response.data.items || []);
      } else {
        setTrendingBooks(prevBooks => [...prevBooks, ...(response.data.items || [])]);
      }
      setTrendingPage(startIndex / 16);
    } catch (error) {
      console.error("Error fetching trending books:", error);
      setTrendingError("Failed to load trending books.");
    } finally {
      setTrendingLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingBooks();
  }, []);

  const loadMoreTrendingBooks = () => {
    fetchTrendingBooks((trendingPage + 1) * 16);
  };

  const addToBookshelf = async (book, status) => {
    try {
      const bookData = {
        book_id: book.id,
        title: book.title || book.volumeInfo?.title || "Unknown Title",
        authors: book.authors || book.volumeInfo?.authors?.join(", ") || "Unknown Author",
        image: book.image || book.volumeInfo?.imageLinks?.thumbnail || "",
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

  // Display recommendations in carousel view
const renderBooksCarousel = (books, isRecommended = true) => {
  const displayBooks = isRecommended 
    ? (viewMoreRecommendations ? books : books.slice(0, 8))
    : (viewMoreTrending ? books : books.slice(0, 8));
    
  return (
    <div className="overflow-x-auto whitespace-nowrap pb-4">
      {displayBooks.map((book) => {
        const bookId = isRecommended ? book.id : book.id;
        const bookTitle = isRecommended ? book.title : book.volumeInfo?.title;
        const bookAuthors = isRecommended ? book.authors : book.volumeInfo?.authors?.join(", ") || "Unknown Author";
        const bookImage = isRecommended ? book.image : book.volumeInfo?.imageLinks?.thumbnail;
        const bookPublishedDate = isRecommended ? book.publishedDate : book.volumeInfo?.publishedDate;
        const bookDescription = isRecommended ? book.description : book.volumeInfo?.description;
        
        return (
          <div
            key={book.id}
            className="inline-block bg-white p-4 rounded-lg shadow-md hover:shadow-xl w-64 mx-2 flex-shrink-0"
          >
            <div 
              onClick={() => navigate(`/book/${bookId}`)}
              className="cursor-pointer"
            >
              <img
                src={bookImage || "placeholder.jpg"}
                alt={bookTitle}
                className="w-36 h-56 object-cover rounded-md shadow mx-auto"
              />
              <h4 className="font-semibold text-center mt-2 text-lg truncate">{bookTitle}</h4>
              <p className="text-gray-600 text-sm text-center truncate">{bookAuthors}</p>
              <p className="text-gray-500 text-xs mt-1 text-center">{bookPublishedDate}</p>
              {isRecommended && book.recommendation_reason && (
                <p className="text-blue-600 text-xs mt-1 text-center font-medium">
                  {book.recommendation_reason}
                </p>
              )}
              <p className="text-gray-600 text-sm mt-1 line-clamp-2 h-10">{bookDescription}</p>
            </div>
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
        );
      })}
    </div>
  );
};

// Display books in grid view
const renderBooksGrid = (books, isRecommended = true) => {
  const displayBooks = isRecommended 
    ? (viewMoreRecommendations ? books : books.slice(0, 8))
    : (viewMoreTrending ? books : books.slice(0, 8));
    
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {displayBooks.map((book) => {
        const bookId = isRecommended ? book.id : book.id;
        const bookTitle = isRecommended ? book.title : book.volumeInfo?.title;
        const bookAuthors = isRecommended ? book.authors : book.volumeInfo?.authors?.join(", ") || "Unknown Author";
        const bookImage = isRecommended ? book.image : book.volumeInfo?.imageLinks?.thumbnail;
        const recommendationReason = isRecommended ? book.recommendation_reason : null;
        
        return (
          <div
            key={book.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl flex flex-col"
          >
            <div 
              className="flex-grow flex items-center justify-center cursor-pointer"
              onClick={() => navigate(`/book/${bookId}`)}
            >
              <img
                src={bookImage || "placeholder.jpg"}
                alt={bookTitle}
                className="w-32 h-48 object-cover rounded-md shadow"
              />
            </div>
            <div className="mt-2">
              <h4 
                className="font-semibold text-center text-md truncate cursor-pointer"
                onClick={() => navigate(`/book/${bookId}`)}
              >
                {bookTitle}
              </h4>
              <p className="text-gray-600 text-xs text-center truncate">{bookAuthors}</p>
              {recommendationReason && (
                <p className="text-blue-600 text-xs mt-1 text-center font-medium">
                  {recommendationReason}
                </p>
              )}
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
        );
      })}
    </div>
  );
};

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-3xl font-semibold mb-2">
            Welcome, {user?.username || "User"}! 🎉
          </h2>
          <p className="text-white opacity-90">Discover your next favorite read today!</p>
        </div>

        {/* Recommendations Section */}
        <section className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">📖 Recommended for You</h3>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  className={`px-3 py-1 rounded-md ${
                    recommendationView === "grid" ? "bg-white shadow" : ""
                  }`}
                  onClick={() => setRecommendationView("grid")}
                >
                  Grid
                </button>
                <button
                  className={`px-3 py-1 rounded-md ${
                    recommendationView === "carousel" ? "bg-white shadow" : ""
                  }`}
                  onClick={() => setRecommendationView("carousel")}
                >
                  Carousel
                </button>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : recommendedBooks.length > 0 ? (
            <div>
              {recommendationView === "carousel" 
                ? renderBooksCarousel(recommendedBooks) 
                : renderBooksGrid(recommendedBooks)}
              
              {recommendedBooks.length > 8 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setViewMoreRecommendations(!viewMoreRecommendations)}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {viewMoreRecommendations ? "Show Less" : `View ${recommendedBooks.length - 8} More Recommendations`}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
              <p className="text-yellow-700 mb-2">
                No recommendations yet. Update your profile with your favorite genres, authors, and books you've read!
              </p>
              <button 
                onClick={() => navigate("/profile")} 
                className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Update Profile
              </button>
            </div>
          )}
        </section>

        {/* Trending Section */}
        <section className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">🔥 Trending Books</h3>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  className={`px-3 py-1 rounded-md ${
                    trendingView === "grid" ? "bg-white shadow" : ""
                  }`}
                  onClick={() => setTrendingView("grid")}
                >
                  Grid
                </button>
                <button
                  className={`px-3 py-1 rounded-md ${
                    trendingView === "carousel" ? "bg-white shadow" : ""
                  }`}
                  onClick={() => setTrendingView("carousel")}
                >
                  Carousel
                </button>
              </div>
            </div>
          </div>

          {trendingError && <p className="text-red-500 text-center mb-4">{trendingError}</p>}
          
          {trendingLoading && trendingBooks.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : trendingBooks.length > 0 ? (
            <div>
              {trendingView === "carousel" 
                ? renderBooksCarousel(trendingBooks, false) 
                : renderBooksGrid(trendingBooks, false)}
              
              <div className="mt-6 text-center">
                {trendingBooks.length > 8 && !viewMoreTrending && (
                  <button
                    onClick={() => setViewMoreTrending(true)}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors mr-4"
                  >
                    View All {trendingBooks.length} Books
                  </button>
                )}
                
                {viewMoreTrending && (
                  <button
                    onClick={() => setViewMoreTrending(false)}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors mr-4"
                  >
                    Show Less
                  </button>
                )}
                
                <button
                  onClick={loadMoreTrendingBooks}
                  disabled={trendingLoading}
                  className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full hover:bg-purple-200 transition-colors"
                >
                  {trendingLoading ? "Loading..." : "Load More Books"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No trending books found.</p>
          )}
        </section>

        {/* Quick Actions */}
        <section className="max-w-6xl mx-auto p-6 mt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => navigate("/bookshelf")}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">📚</div>
                <div>
                  <h3 className="text-xl font-bold">My Bookshelf</h3>
                  <p className="opacity-90">Manage your reading list and track your progress</p>
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
                  <p className="opacity-90">Join book clubs and discuss with fellow readers</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}

export default Home;