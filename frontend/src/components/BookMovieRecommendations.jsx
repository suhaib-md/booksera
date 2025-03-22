import { useEffect, useState } from "react";
import { backendAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";

function BookMovieRecommendations({ bookId, bookTitle }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (bookId) {
      fetchRecommendations();
    }
  }, [bookId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await backendAPI.get(`/movie-recommendations/movies/${bookId}/`, {
        withCredentials: true,
      });
      
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error("Error fetching movie recommendations:", error);
      setError(
        "Failed to load movie recommendations: " +
          (error.response?.data?.error || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    setIsRefreshing(true);
    setError("");
    
    try {
      const response = await backendAPI.post(
        "/movie-recommendations/movies/refresh/",
        { book_id: bookId },
        { withCredentials: true }
      );
      
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error("Error refreshing movie recommendations:", error);
      setError(
        "Failed to refresh movie recommendations: " +
          (error.response?.data?.error || "Unknown error")
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
        <p>{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-gray-600 mb-3">No movie recommendations available for this book yet.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={refreshRecommendations}
            disabled={isRefreshing}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isRefreshing ? "Finding Movies..." : "Find Movies"}
          </button>
          <button
            onClick={() => navigate("/movie-recommendations")}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
          >
            View All Recommendations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Recommended Movies
        </h3>
        <div className="flex gap-2">
          <button
            onClick={refreshRecommendations}
            disabled={isRefreshing}
            className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => navigate("/movie-recommendations")}
            className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
          >
            View All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.slice(0, 3).map((movie) => (
          <div
            key={movie.movie_id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            onClick={() => window.open(`https://www.themoviedb.org/movie/${movie.movie_id}`, "_blank")}
            style={{ cursor: "pointer" }}
          >
            <div className="relative pb-[56.25%]">
              {movie.movie_poster ? (
                <img
                  src={movie.movie_poster}
                  alt={movie.movie_title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-2xl">🎬</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <h4 className="font-medium text-gray-800 truncate">
                {movie.movie_title}
              </h4>
              <p className="text-gray-500 text-xs mt-1">
                {movie.movie_release_date ? new Date(movie.movie_release_date).getFullYear() : ""}
              </p>
              <div className="text-indigo-600 text-xs mt-2 line-clamp-2">
                {movie.recommendation_reason}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {recommendations.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/movie-recommendations")}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            See {recommendations.length - 3} more recommendations
          </button>
        </div>
      )}
    </div>
  );
}

export default BookMovieRecommendations;