// Simulated database for persistence
const STORAGE_KEYS = {
    SCHEDULED_REPORTS: "ledgerlite_scheduled_reports",
    AUDIT_LOGS: "ledgerlite_audit_logs",
};

export const MockDatabase = {
    getScheduledReports: () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHEDULED_REPORTS) || "[]");
        } catch {
            return [];
        }
    },

    saveScheduledReport: (reportConfig) => {
        const reports = MockDatabase.getScheduledReports();
        const newReport = { ...reportConfig, id: `SCH-${Date.now()}` };
        reports.push(newReport);
        localStorage.setItem(STORAGE_KEYS.SCHEDULED_REPORTS, JSON.stringify(reports));
        return newReport;
    },

    deleteScheduledReport: (id) => {
        const reports = MockDatabase.getScheduledReports().filter(r => r.id !== id);
        localStorage.setItem(STORAGE_KEYS.SCHEDULED_REPORTS, JSON.stringify(reports));
    },

    // Audit logs are primarily in Context, but we can sync here for persistence if needed
    saveAuditLog: (log) => {
        try {
            const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || "[]");
            logs.unshift(log); // Newest first
            if (logs.length > 500) logs.length = 500; // Cap limit
            localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
        } catch (e) {
            console.error("Audit MockDB Error", e);
        }
    }
};
