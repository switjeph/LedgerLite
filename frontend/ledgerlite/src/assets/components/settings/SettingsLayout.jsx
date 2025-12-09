import React, { useState } from "react";
import { User, Settings, Database, Activity, Monitor, Shield } from "lucide-react";

export default function SettingsLayout({ activeTab, onTabChange, children }) {
    const tabs = [
        { id: "general", label: "Preferences", icon: <Settings size={18} /> },
        { id: "coa", label: "Chart of Accounts", icon: <Database size={18} /> },
        { id: "security", label: "Security & Logs", icon: <Shield size={18} /> },
        { id: "data", label: "Data Management", icon: <Activity size={18} /> },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-6 min-h-[600px]">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
                <nav className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                                ? "bg-marine-50 text-marine-700 dark:bg-marine-900/40 dark:text-marine-300"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                {children}
            </div>
        </div>
    );
}
