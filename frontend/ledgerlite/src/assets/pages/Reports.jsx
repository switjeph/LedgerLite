import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Example data
const initialTransactions = [
  {
    id: 1,
    date: "2025-08-01",
    amount: 1500,
    type: "Income",
    category: "Salary",
  },
  {
    id: 2,
    date: "2025-08-02",
    amount: -200,
    type: "Expense",
    category: "Groceries",
  },
  {
    id: 3,
    date: "2025-08-03",
    amount: -100,
    type: "Expense",
    category: "Utilities",
  },
  {
    id: 4,
    date: "2025-08-10",
    amount: 500,
    type: "Income",
    category: "Investment",
  },
  {
    id: 5,
    date: "2025-08-15",
    amount: -50,
    type: "Expense",
    category: "Transport",
  },
  {
    id: 6,
    date: "2025-08-20",
    amount: -300,
    type: "Expense",
    category: "Groceries",
  },
  {
    id: 7,
    date: "2025-08-25",
    amount: -80,
    type: "Expense",
    category: "Utilities",
  },
];

const COLORS = [
  "#6366f1",
  "#f59e42",
  "#10b981",
  "#ef4444",
  "#f472b6",
  "#fbbf24",
  "#3b82f6",
];

function getMonth(dateStr) {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

export default function Reports() {
  const [transactions] = useState(initialTransactions);
  const [dateFrom, setDateFrom] = useState("2025-08-01");
  const [dateTo, setDateTo] = useState("2025-08-31");

  // Filter transactions by date range
  const filtered = transactions.filter(
    (tx) => tx.date >= dateFrom && tx.date <= dateTo
  );

  // Monthly Income/Expense for chart
  const months = [...new Set(filtered.map((tx) => getMonth(tx.date)))];
  const chartData = months.map((month) => ({
    month,
    income: filtered
      .filter((tx) => getMonth(tx.date) === month && tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0),
    expense: filtered
      .filter((tx) => getMonth(tx.date) === month && tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
  }));

  // Category breakdown for pie chart
  const categoryMap = {};
  filtered.forEach((tx) => {
    const key = tx.category;
    if (!categoryMap[key]) categoryMap[key] = 0;
    categoryMap[key] += Math.abs(tx.amount);
  });
  const pieData = Object.entries(categoryMap).map(([cat, amt]) => ({
    name: cat,
    value: amt,
  }));

  // Summary
  const totalIncome = filtered
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = filtered
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const balance = totalIncome - totalExpense;

  // Top categories
  const topCategories = pieData.sort((a, b) => b.value - a.value).slice(0, 3);

  // Export CSV
  const handleExportCSV = () => {
    const header = "Date,Category,Type,Amount\n";
    const rows = filtered
      .map((tx) => `${tx.date},"${tx.category}",${tx.type},${tx.amount}`)
      .join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">Reports</h1>
      <p className="text-gray-700 mb-6">
        Visualize your financial data, analyze trends, and export reports.
      </p>

      {/* Date Range Filter */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <button
          className="bg-indigo-500 text-white px-4 py-2 rounded self-end"
          onClick={handleExportCSV}
        >
          Export CSV
        </button>
        <button
          className="bg-pink-500 text-white px-4 py-2 rounded self-end"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>

      {/* Summary Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-indigo-600">${balance}</span>
          <span className="text-gray-500">Balance</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-xl font-bold text-green-600">
            +${totalIncome}
          </span>
          <span className="text-gray-500">Total Income</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-xl font-bold text-red-500">
            -${totalExpense}
          </span>
          <span className="text-gray-500">Total Expenses</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Income vs Expense Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Category Breakdown Pie Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Top Categories</h2>
        <ul>
          {topCategories.map((cat) => (
            <li
              key={cat.name}
              className="flex justify-between py-1 border-b last:border-b-0"
            >
              <span>{cat.name}</span>
              <span className="font-bold">${cat.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary Table */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Summary Table</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Category</th>
              <th className="text-left py-2">Type</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id} className="border-t">
                <td className="py-2">{tx.date}</td>
                <td className="py-2">{tx.category}</td>
                <td className="py-2">{tx.type}</td>
                <td
                  className={`py-2 text-right ${
                    tx.amount < 0 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-gray-500 py-4">No transactions found.</div>
        )}
      </div>
    </div>
  );
}
