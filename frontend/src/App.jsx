import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext"; // Import AuthProvider
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Bookshelf from "./pages/Bookshelf";
import Search from "./pages/Search";  
import BookDetail from "./pages/BookDetail";
import MoodRecommendations from "./pages/MoodRecommendations";


function App() {
  return (
    <AuthProvider> {/* Wrap with AuthProvider */}
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/" && <Navbar />}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookshelf" element={<Bookshelf />} />
          <Route path="/search" element={<Search />} />
          <Route path="/book/:bookId" element={<BookDetail />} />
          <Route path="/mood" element={<MoodRecommendations />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;