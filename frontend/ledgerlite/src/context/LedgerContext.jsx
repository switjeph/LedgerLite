import React, { createContext, useContext, useState, useEffect } from "react";

const LedgerContext = createContext();

export const useLedger = () => useContext(LedgerContext);

const INITIAL_CHART_OF_ACCOUNTS = [
    { id: "101", name: "Cash", type: "Asset" },
    { id: "102", name: "Bank", type: "Asset" },
    { id: "110", name: "Accounts Receivable", type: "Asset" },
    { id: "201", name: "Accounts Payable", type: "Liability" },
    { id: "301", name: "Owner Capital", type: "Equity" },
    { id: "401", name: "Sales Revenue", type: "Revenue" },
    { id: "402", name: "Service Revenue", type: "Revenue" },
    { id: "501", name: "Office Supplies Expense", type: "Expense" },
    { id: "502", name: "Electricity Expense", type: "Expense" },
    { id: "503", name: "Rent Expense", type: "Expense" },
    { id: "504", name: "Salaries Expense", type: "Expense" },
];

const INITIAL_TRANSACTIONS = [
    {
        id: "TXN-2025-001",
        date: "2025-12-04",
        description: "Received cash for services rendered",
        entries: [
            { account: "Cash", type: "debit", amount: 500.00 },
            { account: "Service Revenue", type: "credit", amount: 500.00 },
        ],
    },
];

const INITIAL_REGISTER_ENTRIES = [
    {
        id: "REG-001",
        date: "2025-12-05",
        type: "Sales",
        description: "Consulting Service for Client A",
        entity: "Client A",
        reference: "INV-1001",
        paymentMethod: "Bank Transfer",
        status: "Draft",
        entries: [
            { account: "Accounts Receivable", type: "debit", amount: 1200 },
            { account: "Service Revenue", type: "credit", amount: 1200 },
        ],
    },
];

export const LedgerProvider = ({ children }) => {
    const [chartOfAccounts, setChartOfAccounts] = useState(INITIAL_CHART_OF_ACCOUNTS);
    const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
    const [registerEntries, setRegisterEntries] = useState(INITIAL_REGISTER_ENTRIES);
    const [templates, setTemplates] = useState([]);
    const [auditLog, setAuditLog] = useState([]);

    const logAction = (action, details) => {
        const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            action,
            details,
            user: "Admin", // Mock user
        };
        setAuditLog(prev => [logEntry, ...prev]);
    };

    // --- Chart of Accounts Actions ---

    const addAccount = (account) => {
        setChartOfAccounts((prev) => [...prev, { ...account, id: Date.now().toString() }]);
        logAction("Create Account", `Created account ${account.name} (${account.type})`);
    };

    const deleteAccount = (id) => {
        const account = chartOfAccounts.find(a => a.id === id);
        if (account) {
            setChartOfAccounts((prev) => prev.filter((a) => a.id !== id));
            logAction("Delete Account", `Deleted account ${account.name}`);
        }
    };

    // --- Data Management ---

    const importData = (data) => {
        try {
            if (data.chartOfAccounts) setChartOfAccounts(data.chartOfAccounts);
            if (data.transactions) setTransactions(data.transactions);
            if (data.registerEntries) setRegisterEntries(data.registerEntries);
            if (data.templates) setTemplates(data.templates);
            logAction("Import Data", "Restored data from backup file");
            return { success: true };
        } catch (error) {
            console.error("Import failed:", error);
            return { success: false, error: error.message };
        }
    };

    // --- Settings / Preferences ---
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem("ledger_settings");
        return saved ? JSON.parse(saved) : {
            currency: "USD",
            theme: "light",
            companyName: "My Company",
            notifications: true
        };
    });

    useEffect(() => {
        localStorage.setItem("ledger_settings", JSON.stringify(settings));

        // Apply theme to document
        if (settings.theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [settings]);

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
        logAction("Update Settings", "Updated application preferences");
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: settings.currency,
        }).format(amount);
    };

    const addTransaction = (transaction) => {
        const newTx = {
            id: `TXN-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
            ...transaction,
        };
        setTransactions((prev) => [newTx, ...prev]);
        logAction("Create Transaction", `Created transaction ${newTx.id}`);
    };

    // --- Register Actions ---

    const addRegisterEntry = (entry) => {
        setRegisterEntries((prev) => [entry, ...prev]);
    };

    const updateRegisterEntry = (id, updatedFields) => {
        setRegisterEntries((prev) =>
            prev.map((entry) => (entry.id === id ? { ...entry, ...updatedFields } : entry))
        );
    };

    const deleteRegisterEntry = (id) => {
        setRegisterEntries((prev) => prev.filter((entry) => entry.id !== id));
    };

    const approveEntry = (id) => {
        const entryToApprove = registerEntries.find((e) => e.id === id);
        if (!entryToApprove) return;

        // 1. Update status to Posted
        updateRegisterEntry(id, { status: "Posted" });

        // 2. Create General Ledger Transaction
        const newTx = {
            id: `TXN-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`, // Generate a new TXN ID
            date: entryToApprove.date,
            description: `${entryToApprove.type}: ${entryToApprove.description} (${entryToApprove.entity})`,
            entries: entryToApprove.entries,
        };

        // 3. Add to Ledger
        setTransactions((prev) => [newTx, ...prev]);
    };

    // --- Batch Actions ---

    const approveMultipleEntries = (ids) => {
        ids.forEach(id => approveEntry(id));
    };

    const deleteMultipleEntries = (ids) => {
        setRegisterEntries((prev) => prev.filter((entry) => !ids.includes(entry.id)));
    };

    // --- Template Actions ---

    const addTemplate = (template) => {
        setTemplates((prev) => [...prev, template]);
    };

    const deleteTemplate = (id) => {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <LedgerContext.Provider
            value={{
                chartOfAccounts,
                transactions,
                registerEntries,
                templates,
                addRegisterEntry,
                updateRegisterEntry,
                deleteRegisterEntry,
                approveEntry,
                approveMultipleEntries,
                deleteMultipleEntries,
                addTemplate,
                deleteTemplate,
                auditLog,
                logAction,
                addTransaction,
                addAccount,
                deleteAccount,
                importData,
                settings,
                updateSettings,
                formatCurrency,
            }}
        >
            {children}
        </LedgerContext.Provider>
    );
};
