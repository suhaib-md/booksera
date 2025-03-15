import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/AuthContext";

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
      const response = await axios.get("http://localhost:8000/api/bookshelf/", {
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

  const updateStatus = async (bookId, newStatus) => {
    try {
      await axios.post(
        "http://localhost:8000/api/bookshelf/update/",
        { book_id: bookId, status: newStatus },
        { withCredentials: true }
      );
      await fetchBookshelf();
      alert(`Book moved to ${newStatus === "to_read" ? "To Read" : "Read"}!`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update book status.");
    }
  };

  const removeFromBookshelf = async (bookId) => {
    try {
      await axios.post(
        "http://localhost:8000/api/bookshelf/remove/",
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

  // Display books in carousel view
  const renderBooksCarousel = (books, section) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl flex flex-col cursor-pointer"
            onClick={() => navigate(`/book/${book.book_id || book.id}`)}
          >
            <img
              src={book.image || "placeholder.jpg"}
              alt={book.title}
              className="w-36 h-56 object-cover rounded-md shadow mx-auto"
            />
            <h4 className="font-semibold text-center mt-2 text-lg truncate">{book.title}</h4>
            <p className="text-gray-600 text-sm text-center truncate">{book.authors}</p>
            <div className="mt-2 flex justify-center space-x-2">
              {section === "toRead" ? (
                <>
                  <button
                    onClick={() => updateStatus(book.id, "read")}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => removeFromBookshelf(book.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => updateStatus(book.id, "to_read")}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    To Read
                  </button>
                  <button
                    onClick={() => removeFromBookshelf(book.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Display books in grid view
  const renderBooksGrid = (books, section) => {
    return (
      <div className="overflow-x-auto whitespace-nowrap pb-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="inline-block bg-white p-4 rounded-lg shadow-md hover:shadow-xl w-64 mx-2 flex-shrink-0 cursor-pointer"
            onClick={() => navigate(`/book/${book.book_id || book.id}`)}
          >
            <div className="flex-grow flex items-center justify-center">
              <img
                src={book.image || "placeholder.jpg"}
                alt={book.title}
                className="w-32 h-48 object-cover rounded-md shadow"
              />
            </div>
            <div className="mt-2">
              <h4 className="font-semibold text-center text-md truncate">{book.title}</h4>
              <p className="text-gray-600 text-xs text-center truncate">{book.authors}</p>
              <div className="mt-2 flex justify-center space-x-2">
                {section === "toRead" ? (
                  <>
                    <button
                      onClick={() => updateStatus(book.id, "read")}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    >
                      Mark as Read
                    </button>
                    <button
                      onClick={() => removeFromBookshelf(book.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => updateStatus(book.id, "to_read")}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      To Read
                    </button>
                    <button
                      onClick={() => removeFromBookshelf(book.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-3xl font-semibold mb-2">
            My Bookshelf 📚
          </h2>
          <p className="text-white opacity-90">Track and manage your reading journey</p>
        </div>

        {error && (
          <div className="max-w-6xl mx-auto p-4 mt-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* To Read Section */}
            <section className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">📖 To Read</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex bg-gray-200 rounded-lg p-1">
                    <button
                      className={`px-3 py-1 rounded-md ${
                        toReadView === "grid" ? "bg-white shadow" : ""
                      }`}
                      onClick={() => setToReadView("grid")}
                    >
                      Grid
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md ${
                        toReadView === "carousel" ? "bg-white shadow" : ""
                      }`}
                      onClick={() => setToReadView("carousel")}
                    >
                      Carousel
                    </button>
                  </div>
                </div>
              </div>

              {toRead.length > 0 ? (
                <>
                  {toReadView === "carousel" 
                    ? renderBooksCarousel(toRead, "toRead") 
                    : renderBooksGrid(toRead, "toRead")}
                </>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
                  <p className="text-yellow-700 mb-2">
                    You don't have any books in your To Read list yet.
                  </p>
                  <button 
                    onClick={() => navigate("/search")} 
                    className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Find Books
                  </button>
                </div>
              )}
            </section>

            {/* Read Section */}
            <section className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">✅ Read</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex bg-gray-200 rounded-lg p-1">
                    <button
                      className={`px-3 py-1 rounded-md ${
                        readView === "grid" ? "bg-white shadow" : ""
                      }`}
                      onClick={() => setReadView("grid")}
                    >
                      Grid
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md ${
                        readView === "carousel" ? "bg-white shadow" : ""
                      }`}
                      onClick={() => setReadView("carousel")}
                    >
                      Carousel
                    </button>
                  </div>
                </div>
              </div>

              {read.length > 0 ? (
                <>
                  {readView === "carousel" 
                    ? renderBooksCarousel(read, "read") 
                    : renderBooksGrid(read, "read")}
                </>
              ) : (
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
                  <p className="text-blue-700 mb-2">
                    You haven't marked any books as Read yet.
                  </p>
                  {toRead.length > 0 && (
                    <p className="text-blue-600">
                      Try finishing some books from your To Read list!
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Quick Actions */}
        <section className="max-w-6xl mx-auto p-6 mt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => navigate("/bookshelf")}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">📚</div>
                <div>
                  <h3 className="text-xl font-bold">My Bookshelf</h3>
                  <p className="opacity-90">Manage your reading list</p>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => navigate("/mood")}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">😊</div>
                <div>
                  <h3 className="text-xl font-bold">Mood Reader</h3>
                  <p className="opacity-90">Find books that match your mood</p>
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
                  <p className="opacity-90">Join book discussions</p>
                </div>
              </div>
            </div>
          </div>
        </section>
          </>
        )}
      </div>
    </AuthGuard>
  );
}

export default Bookshelf;