import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/profile/", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Handle text input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleUpdate = async () => {
    try {
      await axios.post("http://localhost:8000/api/profile/update/", user, {
        withCredentials: true,
      });
      alert("Profile Updated!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle profile picture upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/profile/upload/",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser({ ...user, profile_picture: response.data.profile_picture });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Your Profile
        </h2>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-semibold shadow-md">
                No Image
              </div>
            )}
            {/* Upload Button Overlay */}
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

        {/* Edit/Cancel Button */}
        <button
          onClick={() => setEditMode(!editMode)}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 mb-6 ${
            editMode
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>

        {/* Profile Details */}
        <div className="space-y-6">
          <div>
            <p className="text-gray-600 font-medium">
              <strong>Username:</strong> {user.username || "N/A"}
            </p>
            <p className="text-gray-600 font-medium">
              <strong>Email:</strong> {user.email || "N/A"}
            </p>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <input
                type="text"
                name="bio"
                value={user.bio || ""}
                onChange={handleChange}
                placeholder="Write about yourself..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <input
                type="text"
                name="favorite_genres"
                value={user.favorite_genres || ""}
                onChange={handleChange}
                placeholder="Favorite Genres (comma-separated)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <input
                type="text"
                name="favorite_authors"
                value={user.favorite_authors || ""}
                onChange={handleChange}
                placeholder="Favorite Authors (comma-separated)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <textarea
                name="books_read"
                value={user.books_read?.join(", ") || ""}
                onChange={(e) =>
                  setUser({ ...user, books_read: e.target.value.split(", ") })
                }
                placeholder="Books you've read (comma-separated)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all h-24 resize-none"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>Bio:</strong> {user.bio || "Not provided"}
              </p>
              <p className="text-gray-600">
                <strong>Favorite Genres:</strong>{" "}
                {user.favorite_genres || "Not provided"}
              </p>
              <p className="text-gray-600">
                <strong>Favorite Authors:</strong>{" "}
                {user.favorite_authors || "Not provided"}
              </p>
              <p className="text-gray-600">
                <strong>Books Read:</strong>{" "}
                {user.books_read?.join(", ") || "None"}
              </p>
            </div>
          )}
        </div>

        {/* Save Changes Button (Only in Edit Mode) */}
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