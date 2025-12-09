import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, FileText, Settings, Users } from "lucide-react";

export default function QuickActions({ onNewEntry }) {
    return (
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 h-full">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={onNewEntry}
                    className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors gap-2"
                >
                    <div className="p-2 bg-indigo-200 rounded-full">
                        <PlusCircle size={20} />
                    </div>
                    <span className="text-sm font-semibold">New Entry</span>
                </button>

                <Link
                    to="/reports"
                    className="flex flex-col items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors gap-2"
                >
                    <div className="p-2 bg-emerald-200 rounded-full">
                        <FileText size={20} />
                    </div>
                    <span className="text-sm font-semibold">View Reports</span>
                </Link>

                <Link
                    to="/registers"
                    className="flex flex-col items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors gap-2"
                >
                    <div className="p-2 bg-amber-200 rounded-full">
                        <FileText size={20} />
                    </div>
                    <span className="text-sm font-semibold">Registers</span>
                </Link>

                <Link
                    to="/settings"
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors gap-2"
                >
                    <div className="p-2 bg-gray-200 rounded-full">
                        <Settings size={20} />
                    </div>
                    <span className="text-sm font-semibold">Settings</span>
                </Link>
            </div>
        </div>
    );
}
