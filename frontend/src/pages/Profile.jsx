import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

function Profile() {
  const { user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [localUser, setLocalUser] = useState({});
  const [error, setError] = useState("");
  const [bookTitles, setBookTitles] = useState({}); // Cache for book titles
  const [loadingTitles, setLoadingTitles] = useState(false); // Loading state for titles

  // Sync local state with context user and fetch book titles
  useEffect(() => {
    if (user) {
      setLocalUser(user);
      fetchBookTitles(user.books_read || []);
    }
  }, [user]);

  const fetchBookTitles = async (bookIds) => {
    if (!bookIds || bookIds.length === 0) return;
    setLoadingTitles(true);
    const titles = { ...bookTitles };
    const idsToFetch = bookIds.filter(
      (id) => !titles[id] && /^[a-zA-Z0-9_-]{12}$/.test(id) // Only fetch if not cached and looks like a Google Books ID
    );

    try {
      for (const id of idsToFetch) {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${id}?key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY}`
        );
        titles[id] = response.data.volumeInfo.title;
      }
      setBookTitles(titles);
    } catch (error) {
      console.error("Error fetching book titles:", error);
      setError("Failed to load some book titles.");
      // Fallback to IDs for failed fetches
      idsToFetch.forEach((id) => {
        if (!titles[id]) titles[id] = id;
      });
      setBookTitles(titles);
    } finally {
      setLoadingTitles(false);
    }
  };

  const handleChange = (e) => {
    setLocalUser({ ...localUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/api/profile/update/", localUser, {
        withCredentials: true,
      });
      setUser(localUser);
      await fetchBookTitles(localUser.books_read || []); // Refresh titles after update
      alert("Profile Updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.error || "Failed to update profile.");
    } finally {
      setEditMode(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_picture", file);

    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/profile/upload/",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const updatedUser = { ...localUser, profile_picture: response.data.profile_picture };
      setLocalUser(updatedUser);
      setUser(updatedUser);
      alert("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError(error.response?.data?.error || "Failed to upload profile picture.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Profile</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {localUser.profile_picture ? (
              <img
                src={localUser.profile_picture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-semibold shadow-md">
                No Image
              </div>
            )}
            <label
              htmlFor="profile-picture-upload"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <input
                id="profile-picture-upload"
                type="file"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          onClick={() => setEditMode(!editMode)}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 mb-6 ${
            editMode ? "bg-red-500 text-white hover:bg-red-600" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>

        <div className="space-y-6">
          <div>
            <p className="text-gray-600 font-medium">
              <strong>Username:</strong> {localUser.username || "N/A"}
            </p>
            <p className="text-gray-600 font-medium">
              <strong>Email:</strong> {localUser.email || "N/A"}
            </p>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <input
                type="text"
                name="bio"
                value={localUser.bio || ""}
                onChange={handleChange}
                placeholder="Write about yourself..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <input
                type="text"
                name="favorite_genres"
                value={localUser.favorite_genres || ""}
                onChange={handleChange}
                placeholder="Favorite Genres (comma-separated)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <input
                type="text"
                name="favorite_authors"
                value={localUser.favorite_authors || ""}
                onChange={handleChange}
                placeholder="Favorite Authors (comma-separated)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <textarea
                name="books_read"
                value={localUser.books_read?.join(", ") || ""}
                onChange={(e) => setLocalUser({ ...localUser, books_read: e.target.value.split(", ") })}
                placeholder="Books you've read (comma-separated IDs or titles)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all h-24 resize-none"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>Bio:</strong> {localUser.bio || "Not provided"}
              </p>
              <p className="text-gray-600">
                <strong>Favorite Genres:</strong> {localUser.favorite_genres || "Not provided"}
              </p>
              <p className="text-gray-600">
                <strong>Favorite Authors:</strong> {localUser.favorite_authors || "Not provided"}
              </p>
              <p className="text-gray-600">
                <strong>Books Read:</strong>{" "}
                {loadingTitles
                  ? "Loading titles..."
                  : localUser.books_read?.map((id) => bookTitles[id] || id).join(", ") || "None"}
              </p>
            </div>
          )}
        </div>

        {editMode && (
          <button
            onClick={handleUpdate}
            className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;