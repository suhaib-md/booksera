import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/AuthContext";
import { backendAPI } from "../utils/api";

function MovieRecommendationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filterGenre, setFilterGenre] = useState("all");
  const [sortOption, setSortOption] = useState("relevance");

  useEffect(() => {
    if (user) {
      fetchAllMovieRecommendations();
    }
  }, [user]);

  const fetchAllMovieRecommendations = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Get books from user's bookshelf
      const bookshelfResponse = await backendAPI.get("/bookshelf/", {
        withCredentials: true,
      });
      
      // Combine to_read and read books
      const allBooks = [
        ...(bookshelfResponse.data.to_read || []), 
        ...(bookshelfResponse.data.read || [])
      ];
      
      console.log(`Total books in bookshelf: ${allBooks.length}`);
      
      if (allBooks.length === 0) {
        setLoading(false);
        return; // No books to get recommendations for
      }
      
      // Get movie recommendations for all books
      const recommendations = [];
      const processedBooks = {};
      let booksWithRecommendations = 0;
      
      // Process each book one by one
      for (const book of allBooks) {
        if (processedBooks[book.id]) continue; // Skip if already processed
        
        try {
          const response = await backendAPI.get(`/movie-recommendations/movies/${book.id}/`, {
            withCredentials: true,
          });
          
          if (response.data.recommendations && response.data.recommendations.length > 0) {
            // Add book information to each recommendation
            const bookRecommendations = response.data.recommendations.map(rec => ({
              ...rec,
              source_book: {
                id: book.id,
                title: book.title,
                authors: book.authors,
                image: book.image
              }
            }));
            
            recommendations.push(...bookRecommendations);
            booksWithRecommendations++;
          }
          
          processedBooks[book.id] = true;
        } catch (error) {
          console.error(`Error fetching recommendations for book ${book.id}:`, error);
          // Continue with other books even if one fails
        }
      }
      
      console.log(`Books that generated recommendations: ${booksWithRecommendations}/${allBooks.length}`);
      
      // Filter out duplicates (same movie recommended for multiple books)
      const uniqueMovies = {};
      const uniqueRecommendations = [];
      
      for (const rec of recommendations) {
        if (!uniqueMovies[rec.movie_id]) {
          uniqueMovies[rec.movie_id] = true;
          uniqueRecommendations.push(rec);
        }
      }
      
      setMovieRecommendations(uniqueRecommendations);
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
    setRefreshing(true);
    
    try {
      // Get books from user's bookshelf
      const bookshelfResponse = await backendAPI.get("/bookshelf/", {
        withCredentials: true,
      });
      
      // Combine to_read and read books
      const allBooks = [
        ...(bookshelfResponse.data.to_read || []), 
        ...(bookshelfResponse.data.read || [])
      ];
      
      if (allBooks.length === 0) {
        setRefreshing(false);
        return; // No books to refresh recommendations for
      }
      
      // Refresh recommendations for a few random books
      const booksToRefresh = allBooks.sort(() => 0.5 - Math.random()).slice(0, 3);
      const newRecommendations = [...movieRecommendations];
      
      for (const book of booksToRefresh) {
        try {
          const response = await backendAPI.post(
            "/movie-recommendations/movies/refresh/",
            { book_id: book.id },
            { withCredentials: true }
          );
          
          if (response.data.recommendations && response.data.recommendations.length > 0) {
            // Remove existing recommendations for this book
            const filteredRecs = newRecommendations.filter(
              rec => rec.source_book?.id !== book.id
            );
            
            // Add book information to each new recommendation
            const bookRecommendations = response.data.recommendations.map(rec => ({
              ...rec,
              source_book: {
                id: book.id,
                title: book.title,
                authors: book.authors,
                image: book.image
              }
            }));
            
            // Add new recommendations
            filteredRecs.push(...bookRecommendations);
            
            // Update state with new recommendations
            setMovieRecommendations(filteredRecs);
          }
        } catch (error) {
          console.error(`Error refreshing recommendations for book ${book.id}:`, error);
          // Continue with other books even if one fails
        }
      }
    } catch (error) {
      console.error("Error refreshing recommendations:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Extract unique genres from all movie recommendations
  const genres = movieRecommendations.reduce((acc, movie) => {
    if (movie.genres) {
      movie.genres.forEach(genre => {
        if (!acc.includes(genre)) {
          acc.push(genre);
        }
      });
    }
    return acc;
  }, []);

  // Filter and sort recommendations
  let filteredRecommendations = [...movieRecommendations];
  
  // Apply genre filter
  if (filterGenre !== "all") {
    filteredRecommendations = filteredRecommendations.filter(movie => 
      movie.genres && movie.genres.includes(filterGenre)
    );
  }
  
  // Apply sorting
  filteredRecommendations.sort((a, b) => {
    if (sortOption === "relevance") {
      return b.relevance_score - a.relevance_score;
    } else if (sortOption === "release_date") {
      const dateA = a.movie_release_date ? new Date(a.movie_release_date) : new Date(0);
      const dateB = b.movie_release_date ? new Date(b.movie_release_date) : new Date(0);
      return dateB - dateA; // Sort descending (newest first)
    } else if (sortOption === "title") {
      return a.movie_title.localeCompare(b.movie_title);
    }
    return 0;
  });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="pt-16 pb-10 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white">Movie Recommendations</h1>
            <p className="text-indigo-200 mt-2">
              Discover movies based on your book collection
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-16 h-16 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          ) : movieRecommendations.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No movie recommendations yet</h3>
              <p className="text-gray-600 mb-6">
                {user?.bookshelf ? 
                  "We'll find movies based on books in your collection." :
                  "Add books to your bookshelf to get movie recommendations!"}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => navigate("/bookshelf")}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Go to My Bookshelf
                </button>
                <button 
                  onClick={refreshRecommendations}
                  disabled={refreshing}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {refreshing ? "Finding Movies..." : "Find Movies Now"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Controls */}
              <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="flex flex-wrap justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        {filteredRecommendations.length} Movie Recommendations
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Based on {new Set(movieRecommendations.map(rec => rec.source_book?.id)).size} books from your collection
                    </p>
                </div>
                  
                  <div className="flex mt-4 sm:mt-0">
                    <button
                      onClick={refreshRecommendations}
                      disabled={refreshing}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 mr-3"
                    >
                      {refreshing ? "Refreshing..." : "Refresh Recommendations"}
                    </button>
                    
                    <button
                      onClick={() => navigate("/bookshelf")}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      My Bookshelf
                    </button>
                  </div>
                </div>
                
                {/* Filters */}
                <div className="mt-6 flex flex-wrap items-center gap-6">
                  <div>
                    <label htmlFor="sort" className="text-sm text-gray-600 block mb-1">Sort by:</label>
                    <select
                      id="sort"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="release_date">Release Date</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                  
                  {genres.length > 0 && (
                    <div>
                      <label htmlFor="genre" className="text-sm text-gray-600 block mb-1">Filter by genre:</label>
                      <select
                        id="genre"
                        value={filterGenre}
                        onChange={(e) => setFilterGenre(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                      >
                        <option value="all">All Genres</option>
                        {genres.map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Movies Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecommendations.map((movie) => (
                  <div
                    key={movie.movie_id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    {/* Movie Poster */}
                    <div className="relative pt-[150%]">
                      {movie.movie_poster ? (
                        <img
                          src={movie.movie_poster}
                          alt={movie.movie_title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-3xl">🎬</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Movie Info */}
                    <div className="p-4 flex-grow">
                      <h3 className="font-medium text-lg text-gray-800 mb-1">
                        {movie.movie_title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {movie.movie_release_date ? new Date(movie.movie_release_date).getFullYear() : ""}
                      </p>
                      
                      <div className="mt-3">
                        <div className="text-indigo-600 text-sm font-medium">
                          {movie.recommendation_reason}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                        {movie.movie_overview}
                      </p>
                      
                      <div className="mt-3 text-sm text-gray-500 flex items-center">
                        <div className="mr-2">Match:</div>
                        <div className="w-24 bg-gray-200 h-2 rounded-full">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${Math.round(movie.relevance_score * 100)}%` }}
                          ></div>
                        </div>
                        <div className="ml-2">
                          {Math.round(movie.relevance_score * 100)}%
                        </div>
                      </div>
                      
                      {/* Source Book */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center">
                        <div className="w-10 h-14 bg-gray-100 rounded mr-3 flex-shrink-0 overflow-hidden">
                          {movie.source_book?.image ? (
                            <img
                              src={movie.source_book.image}
                              alt={movie.source_book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-400 text-xs">📚</span>
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs text-gray-500">Based on:</div>
                          <div 
                            className="text-sm font-medium text-gray-800 truncate hover:text-indigo-600 cursor-pointer"
                            onClick={() => navigate(`/book/${movie.source_book?.id}`)}
                          >
                            {movie.source_book?.title}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => window.open(`https://www.themoviedb.org/movie/${movie.movie_id}`, "_blank")}
                        className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                      >
                        View Movie Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Empty State When Filtered */}
              {filteredRecommendations.length === 0 && movieRecommendations.length > 0 && (
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-3">No movies match your current filters.</p>
                  <button
                    onClick={() => setFilterGenre("all")}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}

          {/* How It Works Section */}
          <div className="mt-12 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-indigo-100 rounded-lg p-4 bg-indigo-50">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">📚</span>
                  </div>
                  <h3 className="font-medium text-indigo-800">Analyze Your Books</h3>
                </div>
                <p className="text-indigo-700 text-sm">
                  We analyze the themes, genres, and narrative styles of books in your collection to understand your reading preferences.
                </p>
              </div>
              
              <div className="border border-indigo-100 rounded-lg p-4 bg-indigo-50">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">🔍</span>
                  </div>
                  <h3 className="font-medium text-indigo-800">AI Matching</h3>
                </div>
                <p className="text-indigo-700 text-sm">
                  Our AI uses natural language processing to find movies that match the themes, content, and emotional tone of your books.
                </p>
              </div>
              
              <div className="border border-indigo-100 rounded-lg p-4 bg-indigo-50">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">🔄</span>
                  </div>
                  <h3 className="font-medium text-indigo-800">Continuous Improvement</h3>
                </div>
                <p className="text-indigo-700 text-sm">
                  The more books you add to your collection, the better our recommendations become. Refresh anytime to discover new movies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default MovieRecommendationsPage;