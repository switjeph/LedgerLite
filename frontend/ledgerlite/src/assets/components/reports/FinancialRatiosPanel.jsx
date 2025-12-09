import React from "react";
import { Activity, TrendingUp, Scale, Percent } from "lucide-react";

export default function FinancialRatiosPanel({ ratios }) {
    // ratios: { currentRatio, profitMargin, debtToEquity }

    const metrics = [
        {
            label: "Current Ratio",
            value: ratios.currentRatio,
            desc: "Liquidity (Goal: > 1.5)",
            color: ratios.currentRatio > 1.5 ? "text-emerald-600" : "text-amber-600",
            icon: <Activity size={18} />
        },
        {
            label: "Net Profit Margin",
            value: `${ratios.profitMargin}%`,
            desc: "Profitability",
            color: ratios.profitMargin > 10 ? "text-emerald-600" : "text-blue-600",
            icon: <Percent size={18} />
        },
        {
            label: "Debt to Equity",
            value: ratios.debtToEquity,
            desc: "Solvency (Goal: < 2.0)",
            color: ratios.debtToEquity < 2.0 ? "text-emerald-600" : "text-rose-600",
            icon: <Scale size={18} />
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {metrics.map((m, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-1">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                        <span className="text-sm font-medium">{m.label}</span>
                        {m.icon}
                    </div>
                    <div className={`text-2xl font-bold ${m.color}`}>
                        {m.value}
                    </div>
                    <div className="text-xs text-gray-400">
                        {m.desc}
                    </div>
                </div>
            ))}
        </div>
    );
}
