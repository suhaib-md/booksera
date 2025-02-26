import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <h1 className="text-2xl font-bold">BooksEra</h1>
      <div>
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/login" className="mr-4">Login</Link>
        <Link to="/signup" className="mr-4">Signup</Link>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">Logout</button>
      </div>    
    </nav>
  );
}

export default Navbar;
