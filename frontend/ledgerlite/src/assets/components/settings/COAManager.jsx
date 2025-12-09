import React, { useState } from "react";
import { useLedger } from "../../../context/LedgerContext";
import { Plus, Trash2, Search } from "lucide-react";

export default function COAManager() {
    const { chartOfAccounts, addAccount, deleteAccount } = useLedger();
    const [isAdding, setIsAdding] = useState(false);
    const [newAccount, setNewAccount] = useState({ name: "", type: "Asset", code: "" });
    const [search, setSearch] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newAccount.name && newAccount.type) {
            addAccount(newAccount);
            setNewAccount({ name: "", type: "Asset", code: "" });
            setIsAdding(false);
        }
    };

    const filteredAccounts = chartOfAccounts.filter(acc =>
        acc.name.toLowerCase().includes(search.toLowerCase()) ||
        acc.type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Chart of Accounts</h2>
                    <p className="text-sm text-gray-500">Manage your general ledger accounts.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-marine-600 text-white rounded-lg hover:bg-marine-700 text-sm font-medium"
                >
                    <Plus size={16} />
                    Add Account
                </button>
            </div>

            {/* Add Form */}
            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Account Code</label>
                            <input
                                type="text"
                                value={newAccount.code}
                                onChange={e => setNewAccount({ ...newAccount, code: e.target.value })}
                                className="w-full p-2 border rounded-md text-sm"
                                placeholder="e.g. 101"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Account Name</label>
                            <input
                                type="text"
                                value={newAccount.name}
                                onChange={e => setNewAccount({ ...newAccount, name: e.target.value })}
                                className="w-full p-2 border rounded-md text-sm"
                                placeholder="e.g. Marketing Expense"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
                            <select
                                value={newAccount.type}
                                onChange={e => setNewAccount({ ...newAccount, type: e.target.value })}
                                className="w-full p-2 border rounded-md text-sm"
                            >
                                <option value="Asset">Asset</option>
                                <option value="Liability">Liability</option>
                                <option value="Equity">Equity</option>
                                <option value="Revenue">Revenue</option>
                                <option value="Expense">Expense</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 text-sm bg-marine-600 text-white rounded-md hover:bg-marine-700"
                        >
                            Save Account
                        </button>
                    </div>
                </form>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Search accounts..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
            </div>

            {/* List */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-3 w-24">Code</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3 w-32">Type</th>
                            <th className="px-4 py-3 w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredAccounts.map((acc, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 group">
                                <td className="px-4 py-3 font-mono text-gray-500">{acc.id}</td>
                                <td className="px-4 py-3 font-medium text-gray-900">{acc.name}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${acc.type === 'Asset' ? 'bg-emerald-100 text-emerald-700' :
                                            acc.type === 'Liability' ? 'bg-amber-100 text-amber-700' :
                                                acc.type === 'Equity' ? 'bg-blue-100 text-blue-700' :
                                                    acc.type === 'Revenue' ? 'bg-indigo-100 text-indigo-700' :
                                                        'bg-rose-100 text-rose-700'}`}>
                                        {acc.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => deleteAccount(acc.id)}
                                        className="text-gray-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
