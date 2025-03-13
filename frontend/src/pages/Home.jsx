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
  const [error, setError] = useState("");
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

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=best+books&key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY}`
        );
        setTrendingBooks(response.data.items || []);
      } catch (error) {
        console.error("Error fetching trending books:", error);
        setError("Failed to load trending books.");
        setTrendingBooks([]);
      }
    };
    fetchTrendingBooks();
  }, []);

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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 text-center">
          <h2 className="text-3xl font-semibold mb-2">
            Welcome, {user?.username || "User"}! 🎉
          </h2>
          <p className="text-gray-600">Explore your next favorite book today!</p>
        </div>

        <section className="p-6">
          <h3 className="text-xl font-bold mb-4">📖 Recommended for You</h3>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {loading ? (
            <p className="text-gray-600 text-center">Loading recommendations...</p>
          ) : recommendedBooks.length > 0 ? (
            <div className="overflow-x-auto whitespace-nowrap pb-4">
              {recommendedBooks.map((book) => (
                <div
                  key={book.id}
                  className="inline-block bg-white p-4 rounded-lg shadow-md hover:shadow-xl w-64 mx-2 flex-shrink-0"
                >
                  <img
                    src={book.image || "placeholder.jpg"}
                    alt={book.title}
                    className="w-36 h-56 object-cover rounded-md shadow mx-auto"
                  />
                  <h4 className="font-semibold text-center mt-2 text-lg truncate">{book.title}</h4>
                  <p className="text-gray-600 text-sm text-center truncate">{book.authors}</p>
                  <p className="text-gray-500 text-xs mt-1 text-center">{book.publishedDate}</p>
                  <p className="text-gray-600 text-sm mt-1 truncate">{book.description}</p>
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
          ) : (
            <p className="text-gray-600 text-center">
              No recommendations yet. Update your profile with preferences!
            </p>
          )}
        </section>

        <section className="p-6">
          <h3 className="text-xl font-bold mb-4">🔥 Trending Books</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingBooks.length > 0 ? (
              trendingBooks.slice(0, 8).map((book) => (
                <div
                  key={book.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl w-full flex flex-col items-center"
                >
                  <img
                    src={book.volumeInfo?.imageLinks?.thumbnail || "placeholder.jpg"}
                    alt={book.volumeInfo?.title}
                    className="w-36 h-56 object-cover rounded-md shadow"
                  />
                  <h4 className="font-semibold text-center mt-2 text-lg truncate">
                    {book.volumeInfo?.title}
                  </h4>
                  <p className="text-gray-600 text-sm truncate">
                    {book.volumeInfo?.authors?.join(", ") || "Unknown Author"}
                  </p>
                  <div className="mt-2 space-x-2">
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
              ))
            ) : (
              <p className="text-gray-600 text-center">Loading trending books...</p>
            )}
          </div>
        </section>

        <section className="p-6 flex space-x-4 justify-center">
          <button
            onClick={() => navigate("/bookshelf")}
            className="bg-purple-500 text-white p-3 rounded"
          >
            📚 My Bookshelf
          </button>
          <button
            onClick={() => navigate("/communities")}
            className="bg-yellow-500 text-white p-3 rounded"
          >
            👥 Communities
          </button>
        </section>
      </div>
    </AuthGuard>
  );
}

export default Home;