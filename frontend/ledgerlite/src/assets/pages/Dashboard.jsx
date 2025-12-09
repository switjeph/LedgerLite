import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLedger } from "../../context/LedgerContext";
import { Briefcase, TrendingUp, TrendingDown, DollarSign, Wallet, AlertCircle } from "lucide-react";

// Components
import StatCard from "../components/StatCard";
import RecentTransactions from "../components/RecentTransactions";
import QuickActions from "../components/dashboard/QuickActions";
import RevenueChart from "../components/dashboard/RevenueChart";
import JournalEntryModal from "../components/transactions/JournalEntryModal";

export default function Dashboard() {
  const { transactions, chartOfAccounts, registerEntries, formatCurrency } = useLedger();
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  // --- Metrics Calculation ---

  const getAccountType = (accountName) => {
    const account = chartOfAccounts.find(a => a.name === accountName);
    return account ? account.type : "Unknown";
  };

  const metrics = useMemo(() => {
    let cash = 0;
    let revenue = 0;
    let expenses = 0;
    let receivables = 0;

    transactions.forEach(tx => {
      tx.entries.forEach(entry => {
        const type = getAccountType(entry.account);
        const amount = Number(entry.amount);

        // Cash on Hand (Assets named Cash or Bank)
        if (type === "Asset" && (entry.account.includes("Cash") || entry.account.includes("Bank"))) {
          cash += entry.type === 'debit' ? amount : -amount;
        }

        // Net Profit Components
        if (type === "Revenue") {
          revenue += entry.type === 'credit' ? amount : -amount;
        }
        if (type === "Expense") {
          expenses += entry.type === 'debit' ? amount : -amount;
        }

        // Outstanding Invoices (Accounts Receivable)
        if (entry.account === "Accounts Receivable") {
          receivables += entry.type === 'debit' ? amount : -amount;
        }
      });
    });

    return {
      cash,
      netProfit: revenue - expenses,
      receivables
    };
  }, [transactions, chartOfAccounts]);

  // --- Chart Data Calculation ---

  const chartData = useMemo(() => {
    const last6Months = [];
    const today = new Date();

    // Initialize months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      last6Months.push({ name: monthName, income: 0, expense: 0, monthIndex: d.getMonth(), year: d.getFullYear() });
    }

    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const monthIdx = last6Months.findIndex(m => m.monthIndex === txDate.getMonth() && m.year === txDate.getFullYear());

      if (monthIdx !== -1) {
        tx.entries.forEach(entry => {
          const type = getAccountType(entry.account);
          if (type === "Revenue" && entry.type === 'credit') {
            last6Months[monthIdx].income += Number(entry.amount);
          }
          if (type === "Expense" && entry.type === 'debit') {
            last6Months[monthIdx].expense += Number(entry.amount);
          }
        });
      }
    });

    return last6Months;
  }, [transactions, chartOfAccounts]);

  const pendingCount = registerEntries.filter(e => e.status === "Pending").length;
  const user = { name: "Jane Doe", role: "Financial Controller" };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {user.name}. Here's what's happening with your finances today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Date</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Cash on Hand"
          value={formatCurrency(metrics.cash)}
          icon={<Wallet size={24} />}
          color="emerald"
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Net Profit (YTD)"
          value={formatCurrency(metrics.netProfit)}
          icon={<TrendingUp size={24} />}
          color="indigo"
          trend={metrics.netProfit >= 0 ? "up" : "down"}
          trendValue="5%"
        />
        <StatCard
          title="Outstanding Invoices"
          value={formatCurrency(metrics.receivables)}
          icon={<Briefcase size={24} />}
          color="amber"
          trend="down"
          trendValue="2%"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Charts & Tables) */}
        <div className="lg:col-span-2 space-y-8">
          <RevenueChart data={chartData} />

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
              <Link to="/transactions" className="text-sm text-marine-600 dark:text-marine-400 font-medium hover:underline">View All</Link>
            </div>
            <RecentTransactions limit={5} />
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          <QuickActions onNewEntry={() => setIsEntryModalOpen(true)} />

          {/* Notifications / Pending */}
          {pendingCount > 0 ? (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="text-amber-600" size={24} />
                <h3 className="font-bold text-amber-900">Action Required</h3>
              </div>
              <p className="text-amber-800 text-sm mb-4">
                You have <span className="font-bold">{pendingCount}</span> pending transactions waiting for approval.
              </p>
              <Link to="/registers" className="block w-full text-center py-2 bg-amber-200 text-amber-900 rounded-lg font-semibold hover:bg-amber-300 transition-colors">
                Review Now
              </Link>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Briefcase size={24} />
              </div>
              <h3 className="font-bold text-emerald-900">All Caught Up!</h3>
              <p className="text-emerald-700 text-sm">
                No pending approvals. You're good to go.
              </p>
            </div>
          )}
        </div>
      </div>

      <JournalEntryModal isOpen={isEntryModalOpen} onClose={() => setIsEntryModalOpen(false)} />
    </div>
  );
}
