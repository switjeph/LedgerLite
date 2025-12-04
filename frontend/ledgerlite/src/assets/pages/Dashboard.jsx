import React from "react";
import { Link } from "react-router-dom";
import { useLedger } from "../../context/LedgerContext";
import StatCard from "../components/StatCard";
import Chart from "../components/Chart";
import RecentTransactions from "../components/RecentTransactions";
import { AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { registerEntries } = useLedger();

  // Mock user data
  const user = {
    name: "Jane Doe",
    avatar: "https://ui-avatars.com/api/?name=Jane+Doe",
    lastLogin: "2025-08-27 10:15",
    device: "Chrome on Windows",
  };

  const pendingCount = registerEntries.filter(e => e.status === "Pending").length;

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

      {/* Pending Approvals Widget */}
      {pendingCount > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-yellow-900">Pending Approvals</h3>
              <p className="text-yellow-700 text-sm">
                You have {pendingCount} transaction{pendingCount !== 1 ? 's' : ''} waiting for approval.
              </p>
            </div>
          </div>
          <Link
            to="/registers"
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium text-sm transition-colors"
          >
            Review Items
          </Link>
        </div>
      )}

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
