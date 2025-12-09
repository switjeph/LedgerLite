import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ title, value, icon, trend, trendValue, color = "indigo" }) {
  const isPositive = trend === "up";

  // Map color prop to tailwind classes
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
  };

  const iconClass = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 border border-gray-100 dark:border-gray-700 flex items-start justify-between transition-colors">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>

        {trendValue && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{trendValue}</span>
            <span className="text-gray-400 dark:text-gray-500 font-normal">vs last month</span>
          </div>
        )}
      </div>

      <div className={`p-3 rounded-lg ${iconClass}`}>
        {icon}
      </div>
    </div>
  );
}
