import React, { useState } from "react";

const initialTransactions = [
  {
    id: 1,
    date: "2025-08-20",
    amount: 1500,
    type: "Income",
    category: "Salary",
    notes: "Monthly salary",
  },
  {
    id: 2,
    date: "2025-08-21",
    amount: -50,
    type: "Expense",
    category: "Groceries",
    notes: "Supermarket",
  },
  {
    id: 3,
    date: "2025-08-22",
    amount: -120,
    type: "Expense",
    category: "Utilities",
    notes: "Electricity bill",
  },
];

const initialCategories = [
  "Salary",
  "Groceries",
  "Utilities",
  "Investment",
  "Other",
];

export default function Transactions() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    date: "",
    category: "",
    type: "",
    amount: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: "",
    amount: "",
    type: "Income",
    category: "",
    notes: "",
  });
  const [editId, setEditId] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const filtered = transactions.filter(
    (tx) =>
      (!filter.date || tx.date === filter.date) &&
      (!filter.category ||
        tx.category.toLowerCase().includes(filter.category.toLowerCase())) &&
      (!filter.type || tx.type === filter.type) &&
      (!filter.amount || Math.abs(tx.amount) === Number(filter.amount)) &&
      (!search ||
        tx.category.toLowerCase().includes(search.toLowerCase()) ||
        tx.notes.toLowerCase().includes(search.toLowerCase()))
  );
  const pageCount = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Summary calculations
  const totalIncome = transactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const balance = totalIncome + totalExpense;

  // Add or Edit transaction
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setTransactions((txs) =>
        txs.map((tx) =>
          tx.id === editId
            ? {
                ...tx,
                date: form.date,
                amount:
                  form.type === "Expense"
                    ? -Math.abs(Number(form.amount))
                    : Math.abs(Number(form.amount)),
                type: form.type,
                category: form.category,
                notes: form.notes,
              }
            : tx
        )
      );
    } else {
      setTransactions([
        ...transactions,
        {
          id: transactions.length + 1,
          date: form.date,
          amount:
            form.type === "Expense"
              ? -Math.abs(Number(form.amount))
              : Math.abs(Number(form.amount)),
          type: form.type,
          category: form.category,
          notes: form.notes,
        },
      ]);
    }
    setForm({ date: "", amount: "", type: "Income", category: "", notes: "" });
    setShowForm(false);
    setEditId(null);
    setPage(1);
  };

  // Edit transaction
  const handleEdit = (tx) => {
    setForm({
      date: tx.date,
      amount: Math.abs(tx.amount),
      type: tx.type,
      category: tx.category,
      notes: tx.notes,
    });
    setEditId(tx.id);
    setShowForm(true);
  };

  // Delete transaction
  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      setTransactions((txs) => txs.filter((tx) => tx.id !== id));
      setPage(1);
    }
  };

  // Cancel form
  const handleCancel = () => {
    setForm({ date: "", amount: "", type: "Income", category: "", notes: "" });
    setShowForm(false);
    setEditId(null);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const header = "Date,Category,Type,Amount,Notes\n";
    const rows = filtered
      .map(
        (tx) =>
          `${tx.date},"${tx.category}",${tx.type},${tx.amount},"${tx.notes}"`
      )
      .join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Category management
  const handleAddCategory = () => {
    const cat = newCategory.trim();
    if (cat && !categories.includes(cat)) {
      setCategories([...categories, cat]);
      setNewCategory("");
    }
  };
  const handleRemoveCategory = (cat) => {
    if (window.confirm(`Remove category "${cat}"?`)) {
      setCategories(categories.filter((c) => c !== cat));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Transactions</h1>
      <p className="text-gray-700 mb-6">
        View, add, edit, export, and manage all your business transactions.
      </p>

      {/* Summary Section */}
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
            -${Math.abs(totalExpense)}
          </span>
          <span className="text-gray-500">Total Expenses</span>
        </div>
      </div>

      {/* Category Management */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Manage Categories</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="bg-gray-200 px-2 py-1 rounded flex items-center"
            >
              {cat}
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveCategory(cat)}
                title="Remove"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New category"
            className="border rounded px-2 py-1"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="bg-indigo-500 text-white px-3 py-1 rounded"
            onClick={handleAddCategory}
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search by category or notes"
          className="border rounded px-2 py-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={filter.date}
          onChange={(e) => setFilter((f) => ({ ...f, date: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Category"
          className="border rounded px-2 py-1"
          value={filter.category}
          onChange={(e) =>
            setFilter((f) => ({ ...f, category: e.target.value }))
          }
        />
        <select
          className="border rounded px-2 py-1"
          value={filter.type}
          onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          className="border rounded px-2 py-1"
          value={filter.amount}
          onChange={(e) => setFilter((f) => ({ ...f, amount: e.target.value }))}
        />
      </div>

      {/* Add Transaction Button & Export */}
      <div className="flex gap-2 mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({
              date: "",
              amount: "",
              type: "Income",
              category: "",
              notes: "",
            });
          }}
        >
          Add Transaction
        </button>
        <button
          className="bg-indigo-500 text-white px-4 py-2 rounded"
          onClick={handleExportCSV}
        >
          Export CSV
        </button>
      </div>

      {/* Add/Edit Transaction Form */}
      {showForm && (
        <form
          className="bg-white shadow rounded-lg p-4 mb-6"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <input
              type="date"
              required
              className="border rounded px-2 py-1"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            <input
              type="number"
              required
              placeholder="Amount"
              className="border rounded px-2 py-1"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
            />
            <select
              className="border rounded px-2 py-1"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            <select
              required
              className="border rounded px-2 py-1"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Notes"
            className="border rounded px-2 py-1 w-full mb-2"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
          <div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              {editId ? "Update" : "Save"}
            </button>
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Transactions Table */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Category</th>
              <th className="text-left py-2">Type</th>
              <th className="text-right py-2">Amount</th>
              <th className="text-left py-2">Notes</th>
              <th className="text-center py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((tx) => (
              <tr key={tx.id} className="border-t hover:bg-gray-50">
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
                <td className="py-2">{tx.notes}</td>
                <td className="py-2 text-center">
                  <button
                    className="text-indigo-600 hover:underline mr-2"
                    onClick={() => handleEdit(tx)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(tx.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-gray-500 py-4">No transactions found.</div>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-2 py-1 rounded bg-gray-200"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          {[...Array(pageCount)].map((_, i) => (
            <button
              key={i}
              className={`px-2 py-1 rounded ${
                page === i + 1 ? "bg-indigo-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-2 py-1 rounded bg-gray-200"
            disabled={page === pageCount}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
