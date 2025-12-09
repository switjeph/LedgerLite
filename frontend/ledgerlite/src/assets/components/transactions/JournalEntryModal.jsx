import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Save, AlertCircle } from "lucide-react";
import { useLedger } from "../../../context/LedgerContext";

export default function JournalEntryModal({ isOpen, onClose }) {
    const { chartOfAccounts, addTransaction } = useLedger();

    // Form State
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reference, setReference] = useState(`JE-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`);
    const [memo, setMemo] = useState("");

    // Grid State
    const [lines, setLines] = useState([
        { account: "", description: "", debit: "", credit: "" },
        { account: "", description: "", debit: "", credit: "" } // Start with 2 lines
    ]);

    // Validation State
    const [totals, setTotals] = useState({ debit: 0, credit: 0, diff: 0 });
    const [errors, setErrors] = useState([]);

    // Refs for keyboard nav
    const modalRef = useRef(null);

    // --- Calculations ---
    useEffect(() => {
        let d = 0, c = 0;
        lines.forEach(line => {
            d += Number(line.debit) || 0;
            c += Number(line.credit) || 0;
        });
        setTotals({ debit: d, credit: c, diff: d - c });
    }, [lines]);

    useEffect(() => {
        if (isOpen) {
            // Reset form on open
            setLines([
                { account: "", description: "", debit: "", credit: "" },
                { account: "", description: "", debit: "", credit: "" }
            ]);
            setMemo("");
            setErrors([]);
        }
    }, [isOpen]);

    // --- Handlers ---
    const handleLineChange = (index, field, value) => {
        const newLines = [...lines];
        newLines[index][field] = value;

        // Auto-clear opposite field if Amount is entered
        if (field === "debit" && value) newLines[index].credit = "";
        if (field === "credit" && value) newLines[index].debit = "";

        setLines(newLines);
    };

    const addLine = () => {
        setLines([...lines, { account: "", description: "", debit: "", credit: "" }]);
    };

    const removeLine = (index) => {
        if (lines.length > 2) {
            const newLines = lines.filter((_, idx) => idx !== index);
            setLines(newLines);
        }
    };

    const handleSave = () => {
        // Validation
        const newErrors = [];
        if (!date) newErrors.push("Date is required");
        if (Math.abs(totals.diff) > 0.01) newErrors.push("Values must balance (Debits = Credits)");

        const validLines = lines.filter(l => l.account && (Number(l.debit) > 0 || Number(l.credit) > 0));
        if (validLines.length < 2) newErrors.push("At least 2 valid lines required");

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        // Format for Context
        const transaction = {
            date,
            description: memo || `Manual Entry ${reference}`,
            entries: validLines.map(l => ({
                account: l.account,
                type: Number(l.debit) > 0 ? 'debit' : 'credit',
                amount: Number(l.debit) || Number(l.credit)
            }))
        };

        addTransaction(transaction);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div ref={modalRef} className="bg-white w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">New Journal Entry</h2>
                        <p className="text-sm text-gray-500">Record manual adjustments</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Meta Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-marine-500/20 focus:border-marine-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Reference #</label>
                            <input
                                type="text"
                                value={reference}
                                onChange={e => setReference(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-marine-500/20 focus:border-marine-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Memo</label>
                            <input
                                type="text"
                                value={memo}
                                onChange={e => setMemo(e.target.value)}
                                placeholder="Adjustment purpose..."
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-marine-500/20 focus:border-marine-500"
                            />
                        </div>
                    </div>

                    {/* Alert */}
                    {errors.length > 0 && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg flex items-start gap-2 text-sm">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold">Unable to Post</p>
                                <ul className="list-disc list-inside mt-1 space-y-0.5 text-rose-600">
                                    {errors.map((err, i) => <li key={i}>{err}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-2 w-10 text-center">#</th>
                                    <th className="px-4 py-2 w-64">Account</th>
                                    <th className="px-4 py-2">Description</th>
                                    <th className="px-4 py-2 w-32 text-right">Debit</th>
                                    <th className="px-4 py-2 w-32 text-right">Credit</th>
                                    <th className="px-4 py-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {lines.map((line, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50/50">
                                        <td className="px-4 py-2 text-center text-gray-400 text-xs">{idx + 1}</td>
                                        <td className="px-4 py-2">
                                            <select
                                                value={line.account}
                                                onChange={e => handleLineChange(idx, 'account', e.target.value)}
                                                className="w-full bg-transparent border-none p-1 focus:ring-0 text-gray-900 font-medium"
                                            >
                                                <option value="">Select Account...</option>
                                                {chartOfAccounts.map(acc => (
                                                    <option key={acc.id} value={acc.name}>{acc.name} ({acc.type})</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={line.description}
                                                onChange={e => handleLineChange(idx, 'description', e.target.value)}
                                                className="w-full bg-transparent border-none p-1 focus:ring-0 text-gray-600"
                                                placeholder="Line description..."
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={line.debit}
                                                onChange={e => handleLineChange(idx, 'debit', e.target.value)}
                                                className="w-full bg-transparent border-none p-1 focus:ring-0 text-right font-mono"
                                                placeholder="0.00"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={line.credit}
                                                onChange={e => handleLineChange(idx, 'credit', e.target.value)}
                                                className="w-full bg-transparent border-none p-1 focus:ring-0 text-right font-mono"
                                                placeholder="0.00"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => removeLine(idx)}
                                                className="text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                                tabIndex={-1}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 border-t border-gray-200">
                                <tr>
                                    <td colSpan="6" className="px-4 py-2">
                                        <button
                                            onClick={addLine}
                                            className="flex items-center gap-2 text-sm text-marine-600 font-medium hover:text-marine-700"
                                        >
                                            <Plus size={16} /> Add Line
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-5 bg-gray-50 rounded-b-xl flex justify-between items-center">
                    <div className="flex gap-8 text-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase font-semibold">Total Debits</span>
                            <span className="font-mono font-bold text-gray-900">${totals.debit.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase font-semibold">Total Credits</span>
                            <span className="font-mono font-bold text-gray-900">${totals.credit.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase font-semibold">Difference</span>
                            <span className={`font-mono font-bold ${totals.diff === 0 ? "text-emerald-600" : "text-rose-600"
                                }`}>
                                ${Math.abs(totals.diff).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={Math.abs(totals.diff) > 0.01}
                            className="flex items-center gap-2 px-5 py-2.5 bg-marine-600 text-white text-sm font-medium rounded-lg hover:bg-marine-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Save size={18} />
                            Post Entry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
