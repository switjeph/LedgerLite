import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet } from "lucide-react";

import { useLedger } from "../../../context/LedgerContext";

export default function ReportDashboard({ kpis, plData }) {
    const { formatCurrency } = useLedger();

    const stats = [
        {
            label: "Total Revenue",
            value: kpis.revenue,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            icon: <ArrowUpRight size={20} />
        },
        {
            label: "Total Expenses",
            value: kpis.expense,
            color: "text-rose-600",
            bg: "bg-rose-50",
            icon: <ArrowDownRight size={20} />
        },
        {
            label: "Net Profit",
            value: kpis.netProfit,
            color: kpis.netProfit >= 0 ? "text-indigo-600" : "text-rose-600",
            bg: "bg-indigo-50",
            icon: <DollarSign size={20} />
        },
        {
            label: "Cash on Hand",
            value: kpis.cashBalance,
            color: "text-blue-600",
            bg: "bg-blue-50",
            icon: <Wallet size={20} />
        },
    ];

    // function removed

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} dark:bg-opacity-20`}>
                                {stat.icon}
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.value >= 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                }`}>
                                {stat.value >= 0 ? "+12%" : "-4%"}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {formatCurrency(stat.value)}
                        </h3>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white">Financial Performance</h3>
                        <select className="text-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-lg focus:ring-0">
                            <option>This Month</option>
                            <option>Last Quarter</option>
                            <option>YTD</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Revenue', amount: kpis.revenue, fill: '#10b981' },
                                { name: 'Expense', amount: kpis.expense, fill: '#f43f5e' },
                                { name: 'Profit', amount: kpis.netProfit, fill: '#6366f1' },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Simulated Recent Activity or Alerts */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Insights</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                            <h4 className="font-semibold text-amber-800 text-sm mb-1">Cash Flow Warning</h4>
                            <p className="text-xs text-amber-700">Expenses are projected to exceed revenue next week based on recurring bills.</p>
                        </div>
                        <div className="p-4 bg-marine-50 rounded-lg border border-marine-100">
                            <h4 className="font-semibold text-marine-800 text-sm mb-1">Revenue Goal</h4>
                            <p className="text-xs text-marine-700">You achieved 85% of your monthly revenue target.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
