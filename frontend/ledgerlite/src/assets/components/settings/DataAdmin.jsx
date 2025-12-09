import React, { useRef, useState } from "react";
import { useLedger } from "../../../context/LedgerContext";
import { Download, Upload, AlertTriangle, CheckCircle } from "lucide-react";

export default function DataAdmin() {
    const { transactions, chartOfAccounts, registerEntries, templates, importData } = useLedger();
    const fileInputRef = useRef(null);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

    const handleExport = () => {
        const data = {
            transactions,
            chartOfAccounts,
            registerEntries,
            templates,
            exportDate: new Date().toISOString(),
            version: "1.0"
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ledger_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setStatus({ type: 'success', message: 'Backup file downloaded successfully.' });
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                const result = importData(json);
                if (result.success) {
                    setStatus({ type: 'success', message: 'Data restored successfully.' });
                } else {
                    setStatus({ type: 'error', message: `Import failed: ${result.error}` });
                }
            } catch (err) {
                setStatus({ type: 'error', message: 'Invalid JSON file.' });
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = null;
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
                <p className="text-sm text-gray-500">Backup and restore your ERP data.</p>
            </div>

            {status && (
                <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                    {status.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                    {status.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-indigo-50 w-fit rounded-lg text-indigo-600 mb-4">
                        <Download size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Export Data</h3>
                    <p className="text-gray-600 text-sm mb-6">
                        Download a JSON snapshot of all transactions, accounts, and settings.
                        Keep this file safe for disaster recovery.
                    </p>
                    <button
                        onClick={handleExport}
                        className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Download Backup
                    </button>
                </div>

                {/* Import Card */}
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-rose-50 w-fit rounded-lg text-rose-600 mb-4">
                        <Upload size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Restore Data</h3>
                    <p className="text-gray-600 text-sm mb-6">
                        Upload a previously exported JSON file.
                        <br />
                        <span className="font-bold text-rose-600">Warning: This will overwrite detailed current data.</span>
                    </p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImport}
                        accept=".json"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="w-full py-2.5 bg-rose-50 border border-rose-200 text-rose-700 font-medium rounded-lg hover:bg-rose-100 transition-colors"
                    >
                        Upload Backup File
                    </button>
                </div>
            </div>
        </div>
    );
}
