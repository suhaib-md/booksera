import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import BookClubCard from "../components/BookClubCard";
import BookClubCreateModal from "../components/BookClubCreateModal";
import { backendAPI, externalAPI } from "../utils/api";

function Communities() {
  const [bookClubs, setBookClubs] = useState([]);
  const [myBookClubs, setMyBookClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myClubsLoading, setMyClubsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([
    { value: "", label: "All Categories" },
    { value: "fiction", label: "Fiction" },
    { value: "non_fiction", label: "Non-Fiction" },
    { value: "mystery", label: "Mystery" },
    { value: "science_fiction", label: "Science Fiction" },
    { value: "fantasy", label: "Fantasy" },
    { value: "biography", label: "Biography" },
    { value: "history", label: "History" },
    { value: "romance", label: "Romance" },
    { value: "thriller", label: "Thriller" },
    { value: "young_adult", label: "Young Adult" },
    { value: "classics", label: "Classics" },
    { value: "self_help", label: "Self Help" },
    { value: "poetry", label: "Poetry" },
    { value: "other", label: "Other" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookClubs();
    fetchMyBookClubs();
  }, []);

  useEffect(() => {
    fetchBookClubs();
  }, [searchQuery, selectedCategory]);

  const fetchBookClubs = async () => {
    setLoading(true);
    setError("");
    try {
      // Build query params
      let url = "/book-clubs/";
      const params = new URLSearchParams();
      
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await backendAPI.get(url, { withCredentials: true });
      setBookClubs(response.data.book_clubs || []);
    } catch (error) {
      console.error("Error fetching book clubs:", error);
      setError("Failed to load book clubs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookClubs = async () => {
    setMyClubsLoading(true);
    try {
      const response = await backendAPI.get(
        "/book-clubs/my-clubs/",
        { withCredentials: true }
      );
      setMyBookClubs(response.data.book_clubs || []);
    } catch (error) {
      console.error("Error fetching my book clubs:", error);
    } finally {
      setMyClubsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    fetchBookClubs();
    fetchMyBookClubs();
    setShowCreateModal(false);
  };

  const handleJoinClub = async (clubId) => {
    try {
      await backendAPI.post(
        `/book-clubs/${clubId}/join/`,
        {},
        { withCredentials: true }
      );
      fetchBookClubs(); // Refresh the list to update the "is_member" status
      fetchMyBookClubs(); // Update my clubs list
    } catch (error) {
      console.error("Error joining book club:", error);
      alert("Failed to join book club: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-3xl font-semibold mb-2">Book Communities</h2>
          <p className="text-white opacity-90">Join clubs, discuss books, and connect with fellow readers</p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-4">
          
          {/* My Book Clubs Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">My Book Clubs</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Book Club
              </button>
            </div>
            
            {myClubsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : myBookClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myBookClubs.map((club) => (
                  <BookClubCard
                    key={club.id}
                    club={club}
                    onClick={() => navigate(`/communities/${club.id}`)}
                    isMember={true}
                    role={club.role}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600">You haven't joined any book clubs yet.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200 transition-colors"
                >
                  Create Your First Club
                </button>
              </div>
            )}
          </section>
          
          {/* Discover Book Clubs Section */}
          <section>
            <h3 className="text-xl font-bold mb-4">Discover Book Clubs</h3>
            
            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search book clubs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="w-full sm:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Results */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-600 p-4 rounded-lg">{error}</div>
            ) : bookClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookClubs.map((club) => (
                  <BookClubCard
                    key={club.id}
                    club={club}
                    onClick={() => navigate(`/communities/${club.id}`)}
                    onJoin={() => handleJoinClub(club.id)}
                    isMember={club.is_member}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600">No book clubs found.</p>
                {searchQuery || selectedCategory ? (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                    }}
                    className="mt-2 bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-2 bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200 transition-colors"
                  >
                    Create a Book Club
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
        
        {/* Create Book Club Modal */}
        {showCreateModal && (
          <BookClubCreateModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleCreateSuccess}
            categories={categories.filter(cat => cat.value !== "")}
          />
        )}
      </div>
    </AuthGuard>
  );
}

export default Communities;