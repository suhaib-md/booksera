import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";

function Home() {
  const [user, setUser] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingBooks, setTrendingBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch user data & recommendations
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user/", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        fetchRecommendations(response.data.email);
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  // Fetch personalized recommendations from Django API
  const fetchRecommendations = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/recommendations/?email=${email}`,
        { withCredentials: true }
      );
      setRecommendedBooks(response.data.books || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendedBooks([]);  // Ensure UI doesn't break if no books are returned
    }
  };

  // Fetch trending books from Google Books API
  useEffect(() => {
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=best+books&key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY}`
      )
      .then((response) => setTrendingBooks(response.data.items || []))
      .catch((error) => console.error("Error fetching trending books:", error));
  }, []);


  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        
        {/* Welcome Section */}
        <div className="p-6 text-center">
          <h2 className="text-3xl font-semibold mb-2">
            Welcome, {user?.username || "User"}! 🎉
          </h2>
          <p className="text-gray-600">Explore your next favorite book today!</p>
        </div>

{/* Recommendations Section */}
<section className="p-6">
  <h3 className="text-xl font-bold mb-4">📖 Recommended for You</h3>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {recommendedBooks && recommendedBooks.length > 0 ? (
      recommendedBooks.map((book) => (
        <div key={book.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl w-full flex flex-col items-center">
          <img
            src={book.image || "placeholder.jpg"}
            alt={book.title}
            className="w-36 h-56 object-cover rounded-md shadow"
          />
          <h4 className="font-semibold text-center mt-2 text-lg">{book.title}</h4>
          <p className="text-gray-600 text-sm">{book.author}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-600">No recommendations yet. Start adding books!</p>
    )}
  </div>
</section>

{/* Trending Books */}
<section className="p-6">
  <h3 className="text-xl font-bold mb-4">🔥 Trending Books</h3>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {trendingBooks && trendingBooks.length > 0 ? (
      trendingBooks.slice(0, 8).map((book) => (
        <div key={book.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl w-full flex flex-col items-center">
          <img
            src={book.volumeInfo?.imageLinks?.thumbnail || "placeholder.jpg"}
            alt={book.volumeInfo?.title}
            className="w-36 h-56 object-cover rounded-md shadow"
          />
          <h4 className="font-semibold text-center mt-2 text-lg">{book.volumeInfo?.title}</h4>
          <p className="text-gray-600 text-sm">{book.volumeInfo?.authors?.join(", ")}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-600">Loading trending books...</p>
    )}
  </div>
</section>

        {/* Quick Links */}
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
