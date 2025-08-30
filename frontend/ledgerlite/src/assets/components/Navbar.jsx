// src/assets/components/Navbar.jsx
export default function Navbar() {
  return (
    <div className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-600">
        Welcome to LedgerLite
      </h1>
      <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
        Logout
      </button>
    </div>
  );
}
