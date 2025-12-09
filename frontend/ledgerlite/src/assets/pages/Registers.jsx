import React, { useState, useMemo } from "react";
import { useLedger } from "../../context/LedgerContext";
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Trash2,
    Edit,
    PlusCircle,
    ArrowRight,
    CheckSquare,
    Square,
    Save,
    Download,
} from "lucide-react";

const REGISTER_TYPES = [
    "Sales",
    "Purchase",
    "Cash",
    "Bank",
    "Expense",
    "Asset",
    "Payroll",
];

const STATUS_COLORS = {
    Draft: "bg-gray-100 text-gray-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-blue-100 text-blue-700",
    Posted: "bg-green-100 text-green-700",
};

export default function Registers() {
    const {
        chartOfAccounts,
        registerEntries,
        templates,
        addRegisterEntry,
        updateRegisterEntry,
        deleteRegisterEntry,
        approveEntry,
        approveMultipleEntries,
        deleteMultipleEntries,
        addTemplate,
    } = useLedger();

    const [activeTab, setActiveTab] = useState("Sales");
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        date: new Date().toISOString().split("T")[0],
        type: "Sales",
        description: "",
        entity: "",
        reference: "",
        paymentMethod: "",
        status: "Draft",
        entries: [
            { account: "", debit: "", credit: "" },
            { account: "", debit: "", credit: "" },
        ],
    });
    const [formError, setFormError] = useState("");

    // --- Filtering ---
    const filteredEntries = useMemo(() => {
        return registerEntries.filter((entry) => {
            const matchesTab = entry.type === activeTab;
            const matchesSearch =
                entry.description.toLowerCase().includes(search.toLowerCase()) ||
                entry.entity.toLowerCase().includes(search.toLowerCase()) ||
                entry.id.toLowerCase().includes(search.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [registerEntries, activeTab, search]);

    // --- Batch Handlers ---
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredEntries.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredEntries.map(e => e.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBatchApprove = () => {
        approveMultipleEntries(selectedIds);
        setSelectedIds([]);
    };

    const handleBatchDelete = () => {
        if (window.confirm(`Delete ${selectedIds.length} entries?`)) {
            deleteMultipleEntries(selectedIds);
            setSelectedIds([]);
        }
    };

    // --- Form Handlers ---
    const resetForm = () => {
        setForm({
            date: new Date().toISOString().split("T")[0],
            type: activeTab,
            description: "",
            entity: "",
            reference: "",
            paymentMethod: "",
            status: "Draft",
            entries: [
                { account: "", debit: "", credit: "" },
                { account: "", debit: "", credit: "" },
            ],
        });
        setEditingId(null);
        setFormError("");
        setShowForm(false);
    };

    const handleEntryChange = (index, field, value) => {
        const newEntries = [...form.entries];
        newEntries[index] = { ...newEntries[index], [field]: value };
        if (field === "debit" && value) newEntries[index].credit = "";
        if (field === "credit" && value) newEntries[index].debit = "";
        setForm({ ...form, entries: newEntries });
    };

    const addEntryLine = () => {
        setForm({ ...form, entries: [...form.entries, { account: "", debit: "", credit: "" }] });
    };

    const removeEntryLine = (index) => {
        if (form.entries.length > 2) {
            setForm({ ...form, entries: form.entries.filter((_, i) => i !== index) });
        }
    };

    const calculateTotals = (entries) => {
        const totalDebit = entries.reduce((sum, e) => sum + (Number(e.debit) || 0), 0);
        const totalCredit = entries.reduce((sum, e) => sum + (Number(e.credit) || 0), 0);
        return { totalDebit, totalCredit };
    };

    const handleSave = (status) => {
        setFormError("");
        const { totalDebit, totalCredit } = calculateTotals(form.entries);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            setFormError(`Debits ($${totalDebit.toFixed(2)}) must equal Credits ($${totalCredit.toFixed(2)})`);
            return;
        }
        if (totalDebit === 0) {
            setFormError("Transaction cannot be zero.");
            return;
        }

        const finalEntries = form.entries
            .filter(e => e.account && (e.debit || e.credit))
            .map(e => ({
                account: e.account,
                type: e.debit ? "debit" : "credit",
                amount: Number(e.debit || e.credit)
            }));

        const entryData = {
            ...form,
            status, // Draft or Pending
            entries: finalEntries,
        };

        if (editingId) {
            updateRegisterEntry(editingId, entryData);
        } else {
            addRegisterEntry({
                id: `REG-${Date.now()}`,
                ...entryData,
            });
        }
        resetForm();
    };

    const handleEdit = (entry) => {
        // Transform entries back to form format (debit/credit fields)
        const formEntries = entry.entries.map(e => ({
            account: e.account,
            debit: e.type === 'debit' ? e.amount : "",
            credit: e.type === 'credit' ? e.amount : "",
        }));

        // Ensure at least 2 lines
        while (formEntries.length < 2) {
            formEntries.push({ account: "", debit: "", credit: "" });
        }

        setForm({
            ...entry,
            entries: formEntries,
        });
        setEditingId(entry.id);
        setShowForm(true);
    };

    // --- Template Handlers ---
    const handleSaveTemplate = () => {
        const templateName = prompt("Enter template name:");
        if (templateName) {
            addTemplate({
                id: `TMP-${Date.now()}`,
                name: templateName,
                ...form,
            });
            alert("Template saved!");
        }
    };

    const handleLoadTemplate = (templateId) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setForm({
                ...form,
                type: template.type,
                description: template.description,
                entries: template.entries,
            });
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Registers</h1>
                    <p className="text-gray-500 mt-1">Manage and approve financial transactions.</p>
                </div>
                <div className="flex gap-3">
                    {selectedIds.length > 0 && (
                        <>
                            <button
                                onClick={handleBatchApprove}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm"
                            >
                                <CheckCircle2 size={18} />
                                Approve ({selectedIds.length})
                            </button>
                            <button
                                onClick={handleBatchDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm"
                            >
                                <Trash2 size={18} />
                                Delete ({selectedIds.length})
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-marine-600 text-white rounded-lg hover:bg-marine-700 font-medium transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        New Entry
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200 mb-6 gap-1">
                {REGISTER_TYPES.map((type) => (
                    <button
                        key={type}
                        onClick={() => {
                            setActiveTab(type);
                            setSelectedIds([]); // Clear selection on tab change
                        }}
                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === type
                            ? "border-marine-600 text-marine-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by description, entity, or ID..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-marine-500/20 focus:border-marine-500 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <th className="px-6 py-4 w-10">
                                <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-600">
                                    {selectedIds.length === filteredEntries.length && filteredEntries.length > 0 ? (
                                        <CheckSquare size={20} className="text-marine-600" />
                                    ) : (
                                        <Square size={20} />
                                    )}
                                </button>
                            </th>
                            <th className="px-6 py-4">Date / ID</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Entity</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredEntries.length > 0 ? (
                            filteredEntries.map((entry) => {
                                const totalAmount = entry.entries
                                    .filter(e => e.type === 'debit')
                                    .reduce((sum, e) => sum + Number(e.amount), 0);
                                const isSelected = selectedIds.includes(entry.id);

                                return (
                                    <tr key={entry.id} className={`hover:bg-gray-50/50 transition-colors ${isSelected ? "bg-marine-50/30" : ""}`}>
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleSelect(entry.id)} className="text-gray-400 hover:text-gray-600">
                                                {isSelected ? <CheckSquare size={20} className="text-marine-600" /> : <Square size={20} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{entry.date}</div>
                                            <div className="text-xs text-gray-500">{entry.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {entry.description}
                                            {entry.reference && (
                                                <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                    {entry.reference}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{entry.entity}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            ${totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[entry.status]}`}>
                                                {entry.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {entry.status === "Draft" && (
                                                    <button onClick={() => handleEdit(entry)} className="text-gray-400 hover:text-marine-600" title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                )}
                                                {entry.status === "Pending" && (
                                                    <button
                                                        onClick={() => approveEntry(entry.id)}
                                                        className="text-marine-600 hover:text-marine-800 flex items-center gap-1 text-xs font-medium bg-marine-50 px-2 py-1 rounded"
                                                    >
                                                        Approve <ArrowRight size={12} />
                                                    </button>
                                                )}
                                                {entry.status !== "Posted" && (
                                                    <button onClick={() => deleteRegisterEntry(entry.id)} className="text-gray-400 hover:text-red-600" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                                {entry.status === "Posted" && (
                                                    <span className="text-gray-400 text-xs">Locked</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                    No entries found in {activeTab} register.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                            <h2 className="text-lg font-bold text-gray-900">
                                {editingId ? "Edit Entry" : "New Register Entry"}
                            </h2>
                            <div className="flex items-center gap-2">
                                {templates.length > 0 && (
                                    <select
                                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none"
                                        onChange={(e) => handleLoadTemplate(e.target.value)}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Load Template...</option>
                                        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                )}
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <XCircle size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Header Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine-500/20 focus:border-marine-500 outline-none"
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine-500/20 focus:border-marine-500 outline-none bg-white"
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    >
                                        {REGISTER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. INV-001"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine-500/20 focus:border-marine-500 outline-none"
                                        value={form.reference}
                                        onChange={(e) => setForm({ ...form, reference: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine-500/20 focus:border-marine-500 outline-none"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Entity (Customer/Supplier)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine-500/20 focus:border-marine-500 outline-none"
                                        value={form.entity}
                                        onChange={(e) => setForm({ ...form, entity: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Journal Entries */}
                            <div className="space-y-3 border-t border-gray-100 pt-4">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">Accounting Entries</label>
                                    <button
                                        type="button"
                                        onClick={addEntryLine}
                                        className="text-sm text-marine-600 hover:text-marine-700 font-medium flex items-center gap-1"
                                    >
                                        <PlusCircle size={16} /> Add Line
                                    </button>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    {form.entries.map((entry, idx) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <select
                                                className="flex-[2] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine-500/20 focus:border-marine-500 outline-none bg-white text-sm"
                                                value={entry.account}
                                                onChange={(e) => handleEntryChange(idx, "account", e.target.value)}
                                            >
                                                <option value="">Select Account</option>
                                                {chartOfAccounts.map((acc) => (
                                                    <option key={acc.id} value={acc.name}>
                                                        {acc.id} - {acc.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                placeholder="Debit"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine-500/20 focus:border-marine-500 outline-none text-sm"
                                                value={entry.debit}
                                                onChange={(e) => handleEntryChange(idx, "debit", e.target.value)}
                                                disabled={!!entry.credit}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Credit"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine-500/20 focus:border-marine-500 outline-none text-sm"
                                                value={entry.credit}
                                                onChange={(e) => handleEntryChange(idx, "credit", e.target.value)}
                                                disabled={!!entry.debit}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeEntryLine(idx)}
                                                className="text-gray-400 hover:text-red-500"
                                                disabled={form.entries.length <= 2}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="flex justify-end gap-6 text-sm font-medium text-gray-700 px-2">
                                    <span>Total Debit: ${calculateTotals(form.entries).totalDebit.toFixed(2)}</span>
                                    <span>Total Credit: ${calculateTotals(form.entries).totalCredit.toFixed(2)}</span>
                                </div>
                            </div>

                            {formError && (
                                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                                    <XCircle size={16} /> {formError}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-4 flex gap-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleSaveTemplate}
                                    className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center gap-2"
                                    title="Save as Template"
                                >
                                    <Save size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSave("Draft")}
                                    className="flex-1 px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium transition-colors shadow-sm"
                                >
                                    Save as Draft
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSave("Pending")}
                                    className="flex-1 px-4 py-2.5 bg-marine-600 text-white rounded-lg hover:bg-marine-700 font-medium transition-colors shadow-sm"
                                >
                                    Submit for Approval
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
