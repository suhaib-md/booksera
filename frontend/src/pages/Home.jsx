import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/AuthContext"; // Import AuthContext

function Home() {
  const { user } = useAuth(); // Use user from AuthContext
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchRecommendations(user.email);
    }
  }, [user]); // Re-fetch if user changes

  const fetchRecommendations = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/recommendations/?email=${email}`,
        { withCredentials: true }
      );
      setRecommendedBooks(response.data.books || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendedBooks([]);
    }
  };

  useEffect(() => {
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=best+books&key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY}`
      )
      .then((response) => setTrendingBooks(response.data.items || []))
      .catch((error) => console.error("Error fetching trending books:", error));
  }, []);

  const addToBookshelf = async (book, status) => {
    try {
      const bookData = {
        book_id: book.id,
        title: book.title || book.volumeInfo?.title,
        authors: book.author || book.volumeInfo?.authors?.join(", ") || "",
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendedBooks.length > 0 ? (
              recommendedBooks.map((book) => (
                <div key={book.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl w-full flex flex-col items-center">
                  <img
                    src={book.image || "placeholder.jpg"}
                    alt={book.title}
                    className="w-36 h-56 object-cover rounded-md shadow"
                  />
                  <h4 className="font-semibold text-center mt-2 text-lg">{book.title}</h4>
                  <p className="text-gray-600 text-sm">{book.author}</p>
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
              <p className="text-gray-600">No recommendations yet. Start adding books!</p>
            )}
          </div>
        </section>

        <section className="p-6">
          <h3 className="text-xl font-bold mb-4">🔥 Trending Books</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingBooks.length > 0 ? (
              trendingBooks.slice(0, 8).map((book) => (
                <div key={book.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl w-full flex flex-col items-center">
                  <img
                    src={book.volumeInfo?.imageLinks?.thumbnail || "placeholder.jpg"}
                    alt={book.volumeInfo?.title}
                    className="w-36 h-56 object-cover rounded-md shadow"
                  />
                  <h4 className="font-semibold text-center mt-2 text-lg">{book.volumeInfo?.title}</h4>
                  <p className="text-gray-600 text-sm">{book.volumeInfo?.authors?.join(", ")}</p>
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
              <p className="text-gray-600">Loading trending books...</p>
            )}
          </div>
        </section>

        <section className="p-6 flex space-x-4 justify-center">
          <button onClick={() => navigate("/bookshelf")} className="bg-purple-500 text-white p-3 rounded">
            📚 My Bookshelf
          </button>
          <button onClick={() => navigate("/communities")} className="bg-yellow-500 text-white p-3 rounded">
            👥 Communities
          </button>
        </section>
      </div>
    </AuthGuard>
  );
}

export default Home;