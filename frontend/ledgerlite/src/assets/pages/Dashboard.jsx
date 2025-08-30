import StatCard from "../components/StatCard";
import Chart from "../components/Chart";
import RecentTransactions from "../components/RecentTransactions";

export default function Dashboard() {
  // Mock user data
  const user = {
    name: "Jane Doe",
    avatar: "https://ui-avatars.com/api/?name=Jane+Doe",
    lastLogin: "2025-08-27 10:15",
    device: "Chrome on Windows",
  };

  return (
    <div className="p-6">
      {/* User Greeting & Login Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-12 h-12 rounded-full border"
        />
        <div>
          <div className="text-xl font-bold text-indigo-700">
            Welcome, {user.name}!
          </div>
          <div className="text-sm text-gray-500">
            Last login: {user.lastLogin} ({user.device})
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-indigo-600 mb-4">Dashboard</h1>
      <p className="text-gray-700 mb-6">
        Welcome to your LedgerLite dashboard. Your quick stats and reports will
        appear here.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Balance" value="$2,500" icon="💰" />
        <StatCard title="Expenses" value="$670" icon="📉" />
        <StatCard title="Income" value="$3,170" icon="📈" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Chart />
        <RecentTransactions />
      </div>
    </div>
  );
}
