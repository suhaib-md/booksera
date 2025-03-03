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
        setUser(response.data); // Update state with full user data from server
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []); // Runs only on mount

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
      // Update user state with the new profile picture URL from the server
      setUser({ ...user, profile_picture: response.data.profile_picture });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold">User Profile</h2>

      <div className="flex flex-col items-center my-4">
        {user.profile_picture ? (
          <img
            src={user.profile_picture} // Use the full URL directly from the server
            alt="Profile"
            className="w-24 h-24 rounded-full shadow-md"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        <input type="file" onChange={handleImageUpload} className="mt-2" />
      </div>

      <button
        onClick={() => setEditMode(!editMode)}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        {editMode ? "Cancel" : "Edit Profile"}
      </button>

      <div className="space-y-3">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>

        {editMode ? (
          <>
            <input
              type="text"
              name="bio"
              value={user.bio || ""}
              onChange={handleChange}
              placeholder="Write about yourself..."
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="favorite_genres"
              value={user.favorite_genres || ""}
              onChange={handleChange}
              placeholder="Favorite Genres (comma-separated)"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="favorite_authors"
              value={user.favorite_authors || ""}
              onChange={handleChange}
              placeholder="Favorite Authors (comma-separated)"
              className="w-full border p-2 rounded"
            />
            <textarea
              name="books_read"
              value={user.books_read?.join(", ") || ""}
              onChange={(e) =>
                setUser({ ...user, books_read: e.target.value.split(", ") })
              }
              placeholder="Books you've read (comma-separated)"
              className="w-full border p-2 rounded"
            />
          </>
        ) : (
          <>
            <p><strong>Bio:</strong> {user.bio || "Not provided"}</p>
            <p><strong>Favorite Genres:</strong> {user.favorite_genres || "Not provided"}</p>
            <p><strong>Favorite Authors:</strong> {user.favorite_authors || "Not provided"}</p>
            <p><strong>Books Read:</strong> {user.books_read?.join(", ") || "None"}</p>
          </>
        )}
      </div>

      {editMode && (
        <button
          onClick={handleUpdate}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      )}
    </div>
  );
}

export default Profile;