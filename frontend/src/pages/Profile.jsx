import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../components/AuthContext";
import { backendAPI, externalAPI } from "../utils/api";

function Profile() {
  const { user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [localUser, setLocalUser] = useState({});
  const [error, setError] = useState("");
  const [bookTitles, setBookTitles] = useState({}); // Cache for book titles
  const [loadingTitles, setLoadingTitles] = useState(false); // Loading state for titles
  
    // Reading goal state
    const [readingGoal, setReadingGoal] = useState({
      target: 0,
      completed: 0
    });
    const [editingGoal, setEditingGoal] = useState(false);
    const [newGoalTarget, setNewGoalTarget] = useState(0);

    // Sync local state with context user and fetch book titles
    useEffect(() => {
      if (user) {
        setLocalUser(user);
        fetchBookTitles(user.books_read || []);
        fetchReadingGoal();
      }
    }, [user]);

    const fetchReadingGoal = async () => {
      try {
        const response = await backendAPI.get("/profile/reading-goal/", {
          withCredentials: true,
        });
        setReadingGoal({
          target: response.data.target || 0,
          completed: response.data.completed || 0
        });
        setNewGoalTarget(response.data.target || 0);
      } catch (error) {
        console.error("Error fetching reading goal:", error);
        // If endpoint doesn't exist yet, use default values
        setReadingGoal({
          target: user?.reading_goal?.target || 0,
          completed: user?.reading_goal?.completed || 0
        });
      }
    };

    const updateReadingGoal = async () => {
      try {
        const response = await backendAPI.post("/profile/reading-goal/", {
          target: newGoalTarget
        }, {
          withCredentials: true,
        });
        
        setReadingGoal({
          ...readingGoal,
          target: newGoalTarget
        });
        
        // Update user object with new goal
        const updatedUser = {
          ...localUser,
          reading_goal: {
            ...readingGoal,
            target: newGoalTarget
          }
        };
        
        setLocalUser(updatedUser);
        setUser(updatedUser);
        setEditingGoal(false);
      } catch (error) {
        console.error("Error updating reading goal:", error);
        setError("Failed to update reading goal");
      }
    };

  const fetchBookTitles = async (bookIds) => {
    if (!bookIds || bookIds.length === 0) return;
    setLoadingTitles(true);
    const titles = { ...bookTitles };
    const idsToFetch = bookIds.filter(
      (id) => !titles[id] && /^[a-zA-Z0-9_-]{12}$/.test(id) // Only fetch if not cached and looks like a Google Books ID
    );

    try {
      for (const id of idsToFetch) {
        const response = await externalAPI.get(
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
      const response = await backendAPI.post("/profile/update/", localUser, {
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
      const response = await backendAPI.post(
        "/profile/upload/",
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

  // Calculate progress percentage
  const progressPercentage = readingGoal.target > 0 
    ? Math.min(Math.round((readingGoal.completed / readingGoal.target) * 100), 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      {/* Header section with curved background - FIXED POSITIONING */}
      <div className="relative mb-32"> {/* Increased margin bottom to make space for profile card */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-b-[40px] h-64"></div> {/* Increased height */}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center pt-20 pb-16" /* Added padding bottom to create space */
        >
          <h1 className="text-3xl font-bold text-white">Your Profile</h1>
          <p className="text-blue-100 mt-2">Manage your reading preferences and goals</p>
        </motion.div>
      </div>
      
      {/* Main content - FIXED MARGIN TOP */}
      <div className="max-w-4xl mx-auto -mt-40 relative z-10"> {/* Increased negative margin to pull content up */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md"
          >
            <p>{error}</p>
          </motion.div>
        )}
        
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="relative h-32 bg-gradient-to-r from-blue-400 to-blue-600">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"></div>
              <div className="absolute bottom-5 right-20 w-12 h-12 rounded-full bg-white"></div>
            </div>
            
            {/* Profile picture section */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                {localUser.profile_picture ? (
                  <img
                    src={localUser.profile_picture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-gray-500 text-xl font-semibold border-4 border-white shadow-lg">
                    <span>{localUser.username ? localUser.username.charAt(0).toUpperCase() : "?"}</span>
                  </div>
                )}
                <label
                  htmlFor="profile-picture-upload"
                  className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md"
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
          </div>
          
          <div className="pt-20 pb-6 px-8">
            {/* User info and edit button */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{localUser.username || "Username"}</h2>
                <p className="text-slate-500">{localUser.email || "Email"}</p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditMode(!editMode)}
                className={`px-5 py-2 rounded-full text-sm font-medium ${
                  editMode 
                    ? "bg-red-500 text-white hover:bg-red-600" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } transition-colors shadow-md`}
              >
                {editMode ? "Cancel Editing" : "Edit Profile"}
              </motion.button>
            </div>
            
            {/* Profile details */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <input
                      type="text"
                      name="bio"
                      value={localUser.bio || ""}
                      onChange={handleChange}
                      placeholder="Write about yourself..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Genres</label>
                    <input
                      type="text"
                      name="favorite_genres"
                      value={localUser.favorite_genres || ""}
                      onChange={handleChange}
                      placeholder="Favorite Genres (comma-separated)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Authors</label>
                    <input
                      type="text"
                      name="favorite_authors"
                      value={localUser.favorite_authors || ""}
                      onChange={handleChange}
                      placeholder="Favorite Authors (comma-separated)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Books Read</label>
                    <textarea
                      name="books_read"
                      value={localUser.books_read?.join(", ") || ""}
                      onChange={(e) => setLocalUser({ ...localUser, books_read: e.target.value.split(", ").filter(Boolean) })}
                      placeholder="Books you've read (comma-separated IDs or titles)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all h-24 resize-none"
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleUpdate}
                    className="w-full mt-2 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-md"
                  >
                    Save Changes
                  </motion.button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">About Me</h3>
                    <p className="text-slate-600">{localUser.bio || "Not provided"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Favorite Genres</h3>
                    <p className="text-slate-600">{localUser.favorite_genres || "Not provided"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Favorite Authors</h3>
                    <p className="text-slate-600">{localUser.favorite_authors || "Not provided"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Books Read</h3>
                    <p className="text-slate-600">
                      {loadingTitles
                        ? "Loading titles..."
                        : localUser.books_read?.map((id) => bookTitles[id] || id).join(", ") || "None"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Reading Goals Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Reading Goal</h2>
              
              {!editingGoal ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingGoal(true)}
                  className="px-5 py-2 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
                >
                  {readingGoal.target > 0 ? "Update Goal" : "Set Goal"}
                </motion.button>
              ) : (
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingGoal(false)}
                    className="px-5 py-2 rounded-full text-sm font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors shadow-md"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={updateReadingGoal}
                    className="px-5 py-2 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shadow-md"
                  >
                    Save
                  </motion.button>
                </div>
              )}
            </div>
            
            {editingGoal ? (
              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">How many books would you like to read this year?</label>
                <input
                  type="number"
                  min="1"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
            ) : (
              <>
                {readingGoal.target > 0 ? (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{new Date().getFullYear()} Reading Challenge</h3>
                        <p className="text-slate-600">
                          You've read <span className="font-semibold text-blue-600">{readingGoal.completed}</span> out of <span className="font-semibold">{readingGoal.target}</span> books
                        </p>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-sm">
                          <span className="text-blue-600 font-bold">{progressPercentage}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                    
                    {/* Encouragement message */}
                    <p className="mt-4 text-center text-slate-600">
                      {progressPercentage >= 100 ? (
                        <span className="text-green-600 font-semibold">🎉 Congratulations! You've completed your reading goal for the year!</span>
                      ) : readingGoal.completed === 0 ? (
                        <span>Start reading to track your progress!</span>
                      ) : (
                        <span>Keep going! You're making great progress on your reading journey.</span>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📚</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Set a Reading Goal for {new Date().getFullYear()}</h3>
                    <p className="text-slate-600 mb-4">Challenge yourself by setting a reading goal for the year!</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingGoal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
                    >
                      Set My Goal
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
        
        {/* Reading Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Reading Stats</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-2xl font-bold">{localUser.books_read?.length || 0}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Books Read</h3>
                <p className="text-slate-600 text-sm">Total books in your library</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 text-2xl font-bold">{readingGoal.completed || 0}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">This Year</h3>
                <p className="text-slate-600 text-sm">Books read in {new Date().getFullYear()}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-2xl font-bold">
                    {readingGoal.target > 0 ? (
                      readingGoal.target - readingGoal.completed > 0 ? 
                        readingGoal.target - readingGoal.completed : 0
                    ) : 0}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">To Go</h3>
                <p className="text-slate-600 text-sm">Books left to reach your goal</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;