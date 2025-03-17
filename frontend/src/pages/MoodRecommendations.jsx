import { useState, useEffect } from "react";
import axios from "axios";
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
      alert(`Book added to ${status === "to_read" ? "To Read" : "Read"}!`);
    } catch (error) {
      console.error("Error adding to bookshelf:", error);
      alert("Failed to add book to bookshelf.");
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="p-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h2 className="text-3xl font-semibold mb-2">How are you feeling today?</h2>
          <p className="text-white opacity-90">
            Select a mood and we'll recommend books that match how you're feeling
          </p>
        </div>

        {/* Mood Selection Grid */}
        <section className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-bold mb-6 text-center">Choose Your Mood</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {moods.map((mood) => (
              <div
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 text-center ${
                  selectedMood === mood.id
                    ? "bg-indigo-100 border-2 border-indigo-500 shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <div className="text-4xl mb-2">{mood.emoji}</div>
                <div className="font-medium">{mood.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations Section */}
        <section id="recommendations-section" className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6 mb-6">
          {selectedMood ? (
            <>
              <h3 className="text-xl font-bold mb-2">
                {moods.find(m => m.id === selectedMood)?.emoji} Books for your {moods.find(m => m.id === selectedMood)?.name} Mood
              </h3>
              <p className="text-gray-600 mb-6">{moodDescription}</p>

              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : recommendedBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {recommendedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div 
                        className="cursor-pointer" 
                        onClick={() => navigate(`/book/${book.id}`)}
                      >
                        <div className="flex justify-center">
                          <img
                            src={book.image || "placeholder.jpg"}
                            alt={book.title}
                            className="w-32 h-48 object-cover rounded-md shadow"
                          />
                        </div>
                        <h4 className="font-semibold text-center mt-3 text-lg line-clamp-2">
                          {book.title}
                        </h4>
                        <p className="text-gray-600 text-sm text-center mt-1 line-clamp-1">
                          {book.authors}
                        </p>
                        {book.recommendation_reason && (
                          <p className="text-indigo-600 text-sm mt-2 text-center font-medium italic line-clamp-2">
                            "{book.recommendation_reason}"
                          </p>
                        )}
                        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                          {book.description}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-center space-x-3">
                        <button
                          onClick={() => addToBookshelf(book, "to_read")}
                          className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm transition-colors"
                        >
                          To Read
                        </button>
                        <button
                          onClick={() => addToBookshelf(book, "read")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm transition-colors"
                        >
                          Read
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !loading && (
                <p className="text-center text-gray-600 py-8">
                  No books found for this mood. Try selecting a different mood.
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p className="text-xl">Select a mood above to see recommended books</p>
            </div>
          )}
        </section>
      </div>
    </AuthGuard>
  );
}

export default MoodRecommendations;