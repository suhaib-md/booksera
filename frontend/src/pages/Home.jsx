import { useEffect, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import axios from "axios";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://127.0.0.1:8000/api/user/", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => setUser(response.data))
    .catch(error => console.error("Error fetching user data:", error));
  }, []);

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Welcome, {user?.email || "User"} 📚</h1>
        <p className="text-lg text-gray-600">Your AI-powered book recommendation platform.</p>
        <button 
          onClick={() => {
            localStorage.removeItem("token"); // Logout
            window.location.href = "/login";
          }}
          className="mt-6 bg-red-500 text-white px-6 py-3 rounded shadow hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </AuthGuard>
  );
}

export default Home;
