import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
                <div className="space-y-1">
                    <p className="text-sm text-indigo-600 font-medium">
                        Income: ${payload[0].value.toLocaleString()}
                    </p>
                    <p className="text-sm text-rose-500 font-medium">
                        Expense: ${payload[1].value.toLocaleString()}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function RevenueChart({ data }) {
    return (
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Cash Flow Trend</h2>
                <select className="text-sm text-gray-500 border-none bg-transparent focus:ring-0 cursor-pointer">
                    <option>Last 6 Months</option>
                    <option>Last 12 Months</option>
                </select>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                            name="Income"
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke="#f43f5e"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorExpense)"
                            name="Expenses"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
