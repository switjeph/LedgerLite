import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

export default function FinancialStatementTable({
    title,
    data,
    totalLabel,
    formatCurrency,
    onRowClick,
    isComparative = false
}) {
    // data is array of { account: string, amount: number, previousAmount?: number, variance?: number }

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden mb-6 transition-colors">
            <div className="bg-marine-50/50 dark:bg-gray-900/50 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-marine-800 dark:text-marine-300">{title}</h3>
                <span className="text-xs font-medium text-marine-600 bg-marine-100 px-2.5 py-0.5 rounded-full">
                    {data.length} Accounts
                </span>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
                    <tr>
                        <th className="px-6 py-3 w-1/3">Account</th>
                        <th className="px-6 py-3 text-right">Amount</th>
                        {isComparative && <th className="px-6 py-3 text-right text-gray-400">Previous</th>}
                        {isComparative && <th className="px-6 py-3 text-right">Variance</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {data.map((item, idx) => (
                        <tr
                            key={idx}
                            onClick={() => onRowClick && onRowClick(item.account)}
                            className={`transition-colors group ${onRowClick ? "cursor-pointer hover:bg-marine-50/30 dark:hover:bg-marine-900/30" : "hover:bg-gray-50/50 dark:hover:bg-gray-800/50"}`}
                        >
                            <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200 group-hover:text-marine-700 dark:group-hover:text-marine-300">
                                {item.account}
                            </td>
                            <td className="px-6 py-3 text-right font-mono text-gray-600 dark:text-gray-300">
                                {formatCurrency(item.amount)}
                            </td>
                            {isComparative && (
                                <td className="px-6 py-3 text-right font-mono text-gray-400">
                                    {formatCurrency(item.previousAmount || 0)}
                                </td>
                            )}
                            {isComparative && (
                                <td className={`px-6 py-3 text-right font-medium text-xs ${(item.variance || 0) >= 0 ? "text-emerald-600" : "text-rose-600"
                                    }`}>
                                    {(item.variance || 0) > 0 ? "+" : ""}{(item.variance || 0).toFixed(1)}%
                                </td>
                            )}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={isComparative ? 4 : 2} className="px-6 py-8 text-center text-gray-400 italic">
                                No entries found for this period.
                            </td>
                        </tr>
                    )}
                </tbody>
                {data.length > 0 && (
                    <tfoot className="bg-gray-50 dark:bg-gray-900/50 font-bold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">
                        <tr>
                            <td className="px-6 py-3">{totalLabel || "Total"}</td>
                            <td className="px-6 py-3 text-right text-marine-700 dark:text-marine-300">
                                {formatCurrency(data.reduce((sum, item) => sum + item.amount, 0))}
                            </td>
                            {isComparative && <td colSpan="2"></td>}
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
}
