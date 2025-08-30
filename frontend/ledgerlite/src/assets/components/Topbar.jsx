// Topbar.jsx
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored user session (if you’re using localStorage/sessionStorage)
    localStorage.removeItem("authToken");

    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
