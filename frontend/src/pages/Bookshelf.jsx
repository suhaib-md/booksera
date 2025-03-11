import { useEffect, useState } from "react";
import axios from "axios";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/AuthContext"; // Import AuthContext

function Bookshelf() {
  const [toRead, setToRead] = useState([]);
  const [read, setRead] = useState([]);
  const { user } = useAuth(); // Use user from AuthContext

  useEffect(() => {
    const fetchBookshelf = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/bookshelf/", {
          withCredentials: true,
        });
        setToRead(response.data.to_read || []);
        setRead(response.data.read || []);
      } catch (error) {
        console.error("Error fetching bookshelf:", error);
      }
    };
    if (user) {
      fetchBookshelf();
    }
  }, [user]); // Re-fetch if user changes

  const updateStatus = async (bookId, newStatus) => {
    try {
      await axios.post(
        "http://localhost:8000/api/bookshelf/update/",
        { book_id: bookId, status: newStatus },
        { withCredentials: true }
      );
      const response = await axios.get("http://localhost:8000/api/bookshelf/", {
        withCredentials: true,
      });
      setToRead(response.data.to_read || []);
      setRead(response.data.read || []);
      alert("Book status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update book status.");
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold text-center mb-8">📚 My Bookshelf</h2>

        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">To Read</h3>
          {toRead.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {toRead.map((book) => (
                <div key={book.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                  <img
                    src={book.image || "placeholder.jpg"}
                    alt={book.title}
                    className="w-36 h-56 object-cover rounded-md shadow"
                  />
                  <h4 className="font-semibold text-center mt-2 text-lg">{book.title}</h4>
                  <p className="text-gray-600 text-sm">{book.authors}</p>
                  <button
                    onClick={() => updateStatus(book.id, "read")}
                    className="mt-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Mark as Read
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No books in your To Read list yet.</p>
          )}
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4">Read</h3>
          {read.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {read.map((book) => (
                <div key={book.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                  <img
                    src={book.image || "placeholder.jpg"}
                    alt={book.title}
                    className="w-36 h-56 object-cover rounded-md shadow"
                  />
                  <h4 className="font-semibold text-center mt-2 text-lg">{book.title}</h4>
                  <p className="text-gray-600 text-sm">{book.authors}</p>
                  <button
                    onClick={() => updateStatus(book.id, "to_read")}
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Move to To Read
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No books marked as Read yet.</p>
          )}
        </section>
      </div>
    </AuthGuard>
  );
}

export default Bookshelf;