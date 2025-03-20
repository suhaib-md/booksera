import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BookSummaryContainer from "../components/BookSummaryContainer";
import { backendAPI } from "../utils/api";

function BookDetail() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await backendAPI.get(
          `/book/${bookId}/`,
          { withCredentials: true }
        );
        console.log("Book details:", response.data); 
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError(
          "Failed to load book details: " +
            (error.response?.data?.error || "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const addToBookshelf = async (status) => {
    try {
      // Ensure all required fields are present and correctly formatted
      if (!book || !book.id) {
        console.error("Invalid book object:", book);
        alert("Book information is incomplete. Cannot add to bookshelf.");
        return;
      }
  
      const bookData = {
        book_id: book.id, // Make sure this is a string
        title: book.title || "Unknown Title",
        authors: Array.isArray(book.authors) ? book.authors.join(", ") : book.authors || "Unknown Author",
        image: book.image || book.thumbnail || "",
        status,
      };
      
      console.log("Book data being sent:", bookData);
      
      await backendAPI.post(
        "/bookshelf/add/",
        bookData,
        { withCredentials: true }
      );
      
      alert(`Book added to ${status === "to_read" ? "To Read" : "Read"}!`);
    } catch (error) {
      console.error("Error adding to bookshelf:", error);
      
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      
      alert("Failed to add book to bookshelf.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-red-500 text-xl font-bold mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-gray-700 text-xl font-bold mb-4">Book Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gray-50 p-8 flex justify-center">
              <img
                src={book.image ||  "/placeholder.jpg"}
                alt={book.title}
                className="h-80 object-contain rounded-md shadow-md"
              />
            </div>
            <div className="md:w-2/3 p-8">
              <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
              {book.subtitle && (
                <h2 className="text-xl text-gray-700 mt-1">{book.subtitle}</h2>
              )}
              <p className="text-blue-600 mt-2">
                {Array.isArray(book.authors)
                  ? book.authors.join(", ")
                  : book.authors}
              </p>

              <div className="mt-4 flex items-center">
                {book.averageRating > 0 && (
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${
                          i < Math.round(book.averageRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-gray-600">
                      {book.averageRating.toFixed(1)} ({book.ratingsCount} ratings)
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => addToBookshelf("to_read")}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  Add to Read Later
                </button>
                <button
                  onClick={() => addToBookshelf("read")}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Mark as Read
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="text-gray-500 font-medium">Publisher</h3>
                  <p>{book.publisher || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium">Published Date</h3>
                  <p>{book.publishedDate || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium">Pages</h3>
                  <p>{book.pageCount || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium">Language</h3>
                  <p>{book.language?.toUpperCase() || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium">ISBN-10</h3>
                  <p>{book.isbn || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium">ISBN-13</h3>
                  <p>{book.isbn13 || "N/A"}</p>
                </div>
              </div>

              {book.categories && book.categories.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-gray-500 font-medium mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {book.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: book.description }}
            />
          </div>

          <div className="p-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI Summary</h3>
            <BookSummaryContainer bookId={bookId} bookTitle={book.title} />
          </div>

          <div className="p-8 bg-gray-50 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">External Links</h3>
            <div className="flex flex-wrap gap-4">
              {book.previewLink && (
                <a
                  href={book.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors"
                >
                  Preview Book
                </a>
              )}
              {book.infoLink && (
                <a
                  href={book.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full hover:bg-purple-200 transition-colors"
                >
                  More Info
                </a>
              )}
              {book.buyLink && (
                <a
                  href={book.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-100 text-green-600 px-4 py-2 rounded-full hover:bg-green-200 transition-colors"
                >
                  Buy Book
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;