import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { backendAPI } from "../utils/api";

function Recommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await backendAPI.get(
          "/personalized-recommendations/",
          { withCredentials: true }
        );
        setRecommendations(response.data.books || []);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const addToBookshelf = async (book, status) => {
    try {
      const bookData = {
        book_id: book.id,
        title: book.title || "Unknown Title",
        authors: book.authors || "Unknown Author",
        image: book.image || "",
        status,
      };
      await backendAPI.post("/bookshelf/add/", bookData, {
        withCredentials: true,
      });
      alert(`Book added to ${status === "to_read" ? "To Read" : "Read"}!`);
    } catch (error) {
      console.error("Error adding to bookshelf:", error);
      setError("Failed to add book to bookshelf.");
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4 text-center">Personalized Recommendations</h3>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading ? (
        <p className="text-center">Loading recommendations...</p>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map((book) => (
            <div
              key={book.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl flex flex-col items-center"
            >
              <img
                src={book.image || "placeholder.jpg"}
                alt={book.title}
                className="w-36 h-56 object-cover rounded-md shadow"
              />
              <h4 className="font-semibold text-center mt-2 text-lg">{book.title}</h4>
              <p className="text-gray-600 text-sm">{book.authors || "Unknown Author"}</p>
              <p className="text-gray-500 text-xs mt-1">{book.publishedDate}</p>
              <p className="text-gray-600 text-sm mt-1 truncate">{book.description}</p>
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
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">
          No recommendations available. Update your profile preferences!
        </p>
      )}
    </div>
  );
}

export default Recommendations;