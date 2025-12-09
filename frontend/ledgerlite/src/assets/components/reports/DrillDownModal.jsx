import React, { useMemo } from "react";
import { X } from "lucide-react";

export default function DrillDownModal({ isOpen, onClose, accountName, transactions, formatCurrency }) {
    if (!isOpen) return null;

    // Filter transactions for this account
    const accountTxs = useMemo(() => {
        const list = [];
        transactions.forEach(tx => {
            const entry = tx.entries.find(e => e.account === accountName);
            if (entry) {
                list.push({
                    date: tx.date,
                    description: tx.description,
                    type: entry.type,
                    amount: entry.amount
                });
            }
        });
        return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [transactions, accountName]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{accountName}</h3>
                        <p className="text-sm text-gray-500">Transaction History</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-0">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 sticky top-0 z-10 font-medium text-gray-500 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3 text-right">Debit</th>
                                <th className="px-6 py-3 text-right">Credit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {accountTxs.map((tx, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-3 text-gray-600 font-mono text-xs">{tx.date}</td>
                                    <td className="px-6 py-3 text-gray-800">{tx.description}</td>
                                    <td className="px-6 py-3 text-right text-gray-600">
                                        {tx.type === "debit" ? formatCurrency(tx.amount) : "-"}
                                    </td>
                                    <td className="px-6 py-3 text-right text-gray-600">
                                        {tx.type === "credit" ? formatCurrency(tx.amount) : "-"}
                                    </td>
                                </tr>
                            ))}
                            {accountTxs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">
                                        No transactions found for this period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
