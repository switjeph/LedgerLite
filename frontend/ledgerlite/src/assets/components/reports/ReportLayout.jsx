import React from "react";
import {
    LayoutDashboard,
    FileText,
    PieChart,
    TrendingUp,
    Clock,
    Download,
    Printer,
    Calendar,
    Filter,
    Scale,
    ArrowRightLeft,
    Sheet
} from "lucide-react";

export default function ReportLayout({
    children,
    activeReport,
    setActiveReport,
    dateRange,
    setDateRange,
    onExport,
    onPrint,
    extraControls
}) {
    const reports = [
        { id: "dashboard", label: "Overview", icon: <LayoutDashboard size={18} /> },
        { id: "balance-sheet", label: "Balance Sheet", icon: <Scale size={18} /> },
        { id: "profit-loss", label: "Profit & Loss", icon: <TrendingUp size={18} /> },
        { id: "cash-flow", label: "Cash Flow", icon: <ArrowRightLeft size={18} /> },
        { id: "trial-balance", label: "Trial Balance", icon: <Sheet size={18} /> },
        { id: "aging", label: "AR/AP Aging", icon: <Clock size={18} /> },
        { id: "audit-log", label: "Audit Logs", icon: <FileText size={18} /> },
    ];

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-semibold text-gray-700">Financial Reports</h2>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {reports.map((report) => (
                        <button
                            key={report.id}
                            onClick={() => setActiveReport(report.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeReport === report.id
                                ? "bg-marine-50 text-marine-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            {report.icon}
                            {report.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Filter & Action Bar */}
                <div className="bg-white border-b border-gray-100 p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <Calendar size={16} className="text-gray-500" />
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="bg-transparent border-none p-0 text-sm focus:ring-0 w-32 text-gray-700 outline-none"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="bg-transparent border-none p-0 text-sm focus:ring-0 w-32 text-gray-700 outline-none"
                            />
                        </div>
                        {/* Extra Controls (Like Comparative Toggle) */}
                        {extraControls}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onExport}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-marine-600 border border-marine-200 bg-marine-50 rounded-lg hover:bg-marine-100 transition-colors"
                        >
                            <Download size={16} /> Export
                        </button>
                        <button
                            onClick={onPrint}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Printer size={16} /> Print
                        </button>
                    </div>
                </div>

                {/* Report View */}
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
