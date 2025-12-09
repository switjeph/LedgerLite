import React from "react";
import { useLedger } from "../../../context/LedgerContext";
import { Shield, Clock } from "lucide-react";

export default function SecurityLogs() {
    const { auditLog } = useLedger();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Security & Activity Logs</h2>
                <p className="text-sm text-gray-500">Audit trail of system modifications.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {auditLog.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No activity recorded yet.</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {auditLog.map((log) => (
                            <li key={log.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                                <div className="p-2 bg-gray-100 rounded-full text-gray-500 mt-1">
                                    <Shield size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">{log.action}</p>
                                    <p className="text-sm text-gray-600">{log.details}</p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                        <Clock size={12} />
                                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                                        <span>•</span>
                                        <span>User: {log.user}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
