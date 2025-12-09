import React, { useState, useMemo } from "react";
import { useLedger } from "../../context/LedgerContext";
import {
  Search,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  XCircle,
  Trash2,
  PlusCircle,
} from "lucide-react";

import JournalEntryModal from "../components/transactions/JournalEntryModal"; // New Import

export default function Transactions() {
  const { transactions, chartOfAccounts, formatCurrency } = useLedger(); // Use global state

  // Filters & Search
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false); // Modal State

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // --- Derived State ---
  // ... (Keep existing sort/filter logic same) 

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        tx.id.toLowerCase().includes(search.toLowerCase());

      const matchesDate = !filterDate || tx.date === filterDate;

      return matchesSearch && matchesDate;
    });
  }, [transactions, search, filterDate]);

  const sortedTransactions = useMemo(() => {
    let sorted = [...filteredTransactions];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [filteredTransactions, sortConfig]);

  const pageCount = Math.ceil(sortedTransactions.length / pageSize);
  const paginatedTransactions = sortedTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // --- Handlers ---
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleExportCSV = () => {
    const header = "ID,Date,Description,Account,Type,Amount\n";
    const rows = sortedTransactions.flatMap(tx =>
      tx.entries.map(e =>
        `${tx.id},${tx.date},"${tx.description}","${e.account}",${e.type},${e.amount}`
      )
    ).join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ledger_transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">General Ledger</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Double-entry bookkeeping system.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEntryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-marine-600 text-white rounded-lg hover:bg-marine-700 font-medium transition-colors shadow-sm"
          >
            <PlusCircle size={18} />
            New Journal Entry
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <JournalEntryModal isOpen={isEntryModalOpen} onClose={() => setIsEntryModalOpen(false)} />

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search description or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-700 dark:text-gray-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-600"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort("date")}>
                  <div className="flex items-center gap-2">Date <ArrowUpDown size={14} /></div>
                </th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Details (Dr/Cr)</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx) => {
                  const totalAmount = tx.entries
                    .filter(e => e.type === 'debit')
                    .reduce((sum, e) => sum + Number(e.amount), 0);

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors align-top">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                        {tx.date}
                        <div className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-1">{tx.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {tx.description}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {tx.entries.map((entry, idx) => (
                            <div key={idx} className="flex justify-between text-sm max-w-xs">
                              <span className={entry.type === 'credit' ? "pl-4 text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-gray-200 font-medium"}>
                                {entry.account}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">
                                {entry.type === 'debit' ? `Dr ${formatCurrency(entry.amount)}` : `Cr ${formatCurrency(entry.amount)}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(totalAmount)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {pageCount || 1}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount || pageCount === 0}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
