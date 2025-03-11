import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import AuthGuard from "../components/AuthGuard";

function Search() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { books = [], query = "", totalItems = 0, searchType = "all" } = state || {};
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const maxResults = 10; // Matches backend

  const fetchPage = async (newPage) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/search/?q=${encodeURIComponent(query)}&type=${searchType}&page=${newPage}`,
        { withCredentials: true }
      );
      navigate("/search", { state: { ...state, books: response.data.books, currentPage: newPage } });
    } catch (error) {
      console.error("Error fetching page:", error);
      setError("Failed to load page.");
    }
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
      await axios.post("http://localhost:8000/api/bookshelf/add/", bookData, { withCredentials: true });
      alert(`Book added to ${status === "to_read" ? "To Read" : "Read"}!`);
    } catch (error) {
      console.error("Error adding to bookshelf:", error);
      setError("Failed to add book to bookshelf.");
    }
  };

  const totalPages = Math.ceil(totalItems / maxResults);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          Search Results for "{query}" ({totalItems} found)
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {books.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {books.map((book) => (
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
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={() => { setPage(page - 1); fetchPage(page - 1); }}
                disabled={page === 1}
                className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400"
              >
                Previous
              </button>
              <span className="text-lg">Page {page} of {totalPages}</span>
              <button
                onClick={() => { setPage(page + 1); fetchPage(page + 1); }}
                disabled={page >= totalPages}
                className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center">
            No books found for "{query}". Try a different search term.
          </p>
        )}
        <button
          onClick={() => navigate("/home")}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 block mx-auto"
        >
          Back to Home
        </button>
      </div>
    </AuthGuard>
  );
}

export default Search;