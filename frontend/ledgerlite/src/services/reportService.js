
export const ReportService = {
    // Helper: Filter transactions by date
    filterTransactions: (transactions, startDate, endDate) => {
        return transactions.filter((tx) => {
            return (
                (!startDate || tx.date >= startDate) && (!endDate || tx.date <= endDate)
            );
        });
    },

    // Helper: Get account balance from transactions
    getAccountBalance: (transactions, accountName) => {
        return transactions.reduce((balance, tx) => {
            const debitEntry = tx.entries.find(
                (e) => e.account === accountName && e.type === "debit"
            );
            const creditEntry = tx.entries.find(
                (e) => e.account === accountName && e.type === "credit"
            );

            if (debitEntry) balance += Number(debitEntry.amount);
            if (creditEntry) balance -= Number(creditEntry.amount);

            return balance;
        }, 0);
    },

    // --- Financial Statements ---

    getProfitAndLoss: (transactions, chartOfAccounts, startDate, endDate) => {
        const filtered = ReportService.filterTransactions(
            transactions,
            startDate,
            endDate
        );
        const report = {
            revenue: [],
            expense: [],
            totalRevenue: 0,
            totalExpense: 0,
            netProfit: 0,
        };

        chartOfAccounts.forEach((acc) => {
            if (acc.type === "Revenue" || acc.type === "Expense") {
                const balance = ReportService.getAccountBalance(filtered, acc.name);
                // Returns absolute value for display, but logic handles negation
                const absBalance = Math.abs(balance);

                if (absBalance > 0) {
                    if (acc.type === "Revenue") {
                        // Revenue is Credit normal, so negative balance means revenue.
                        // However, our helper assumes Debit +, Credit -.
                        // So -100 balance means 100 Revenue.
                        report.revenue.push({ account: acc.name, amount: absBalance });
                        report.totalRevenue += absBalance;
                    } else {
                        // Expense is Debit normal, so positive balance.
                        report.expense.push({ account: acc.name, amount: absBalance });
                        report.totalExpense += absBalance;
                    }
                }
            }
        });

        report.netProfit = report.totalRevenue - report.totalExpense;
        return report;
    },

    getBalanceSheet: (transactions, chartOfAccounts, asOfDate) => {
        // Balance Sheet is cumulative, filter only by end date (As Of)
        const filtered = ReportService.filterTransactions(
            transactions,
            null,
            asOfDate
        );
        const report = {
            assets: [],
            liabilities: [],
            equity: [],
            totalAssets: 0,
            totalLiabilities: 0,
            totalEquity: 0,
        };

        chartOfAccounts.forEach((acc) => {
            const balance = ReportService.getAccountBalance(filtered, acc.name);
            // Debit Normal: Assets
            // Credit Normal: Liabilities, Equity

            if (Math.abs(balance) > 0) {
                if (acc.type === "Asset") {
                    report.assets.push({ account: acc.name, amount: balance }); // Pos balance
                    report.totalAssets += balance;
                } else if (acc.type === "Liability") {
                    const creditBal = -balance; // Convert to positive for display
                    report.liabilities.push({ account: acc.name, amount: creditBal });
                    report.totalLiabilities += creditBal;
                } else if (acc.type === "Equity") {
                    const creditBal = -balance;
                    report.equity.push({ account: acc.name, amount: creditBal });
                    report.totalEquity += creditBal;
                }
            }
        });

        // Calculated Retained Earnings (Revenue - Expenses)
        // Simplified: Calculate Net Profit for all time up to asOfDate.
        const pl = ReportService.getProfitAndLoss(transactions, chartOfAccounts, null, asOfDate);
        if (pl.netProfit !== 0) {
            report.equity.push({ account: "Retained Earnings (Calculated)", amount: pl.netProfit });
            report.totalEquity += pl.netProfit;
        }

        return report;
    },

    getTrialBalance: (transactions, chartOfAccounts, asOfDate) => {
        const filtered = ReportService.filterTransactions(transactions, null, asOfDate);
        const report = [];
        let totalDebit = 0;
        let totalCredit = 0;

        chartOfAccounts.forEach(acc => {
            const balance = ReportService.getAccountBalance(filtered, acc.name);
            if (balance !== 0) {
                const row = {
                    account: acc.name,
                    debit: balance > 0 ? balance : 0,
                    credit: balance < 0 ? -balance : 0
                };
                report.push(row);
                totalDebit += row.debit;
                totalCredit += row.credit;
            }
        });

        return { rows: report, totalDebit, totalCredit };
    },

    // --- Dashboard KPIs ---
    getDashboardKPIs: (transactions, chartOfAccounts) => {
        const today = new Date().toISOString().split('T')[0];
        const monthStart = today.slice(0, 7) + '-01';

        const pl = ReportService.getProfitAndLoss(transactions, chartOfAccounts, monthStart, today);

        // Calculate Cash Balance (Sum of all Asset accounts with 'Cash' or 'Bank' in name)
        const cashAccounts = chartOfAccounts.filter(a => a.name.includes("Cash") || a.name.includes("Bank"));
        let cashBalance = 0;
        cashAccounts.forEach(acc => {
            cashBalance += ReportService.getAccountBalance(transactions, acc.name);
        });

        return {
            revenue: pl.totalRevenue,
            expense: pl.totalExpense,
            netProfit: pl.netProfit,
            cashBalance: cashBalance
        };
    },

    // --- Aging Report ---
    getAgingReport: (registerEntries, type) => {
        // type: "Sales" (AR) or "Purchase" (AP)
        const today = new Date();
        const report = [];

        const filtered = registerEntries.filter(e => e.type === type && e.status !== "Draft");

        filtered.forEach(entry => {
            const entryDate = new Date(entry.date);
            const diffTime = Math.abs(today - entryDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let bucket = "Current";
            if (diffDays > 90) bucket = "> 90 Days";
            else if (diffDays > 60) bucket = "61-90 Days";
            else if (diffDays > 30) bucket = "31-60 Days";
            else if (diffDays > 0) bucket = "1-30 Days";

            // Calculate total amount
            const total = entry.entries.reduce((sum, e) => {
                return sum + Number(e.amount || 0);
            }, 0) / 2; // Divide by 2 because entries are double entry (debit=credit)

            report.push({
                entity: entry.entity,
                reference: entry.reference,
                date: entry.date,
                amount: total,
                days: diffDays,
                bucket
            });
        });

        return report;
    },

    // --- Advanced Reporting ---

    getFinancialRatios: (transactions, chartOfAccounts) => {
        const today = new Date().toISOString().split('T')[0];
        const bs = ReportService.getBalanceSheet(transactions, chartOfAccounts, today);
        const pl = ReportService.getProfitAndLoss(transactions, chartOfAccounts, null, today);

        // 1. Current Ratio (Current Assets / Current Liabilities)
        // Assuming all Assets/Likabilities are "Current" for this simplified ledger
        const currentAssets = bs.totalAssets;
        const currentLiabilities = bs.totalLiabilities;
        const currentRatio = currentLiabilities ? (currentAssets / currentLiabilities) : 0;

        // 2. Net Profit Margin (Net Profit / Revenue)
        const profitMargin = pl.totalRevenue ? (pl.netProfit / pl.totalRevenue) * 100 : 0;

        // 3. Debt to Equity (Total Liabilities / Total Equity)
        const debtToEquity = bs.totalEquity ? (bs.totalLiabilities / bs.totalEquity) : 0;

        return {
            currentRatio: currentRatio.toFixed(2),
            profitMargin: profitMargin.toFixed(1),
            debtToEquity: debtToEquity.toFixed(2)
        };
    },

    getCashFlowIndirect: (transactions, chartOfAccounts, startDate, endDate) => {
        // 1. Start with Net Income
        const pl = ReportService.getProfitAndLoss(transactions, chartOfAccounts, startDate, endDate);
        const netIncome = pl.netProfit;

        // 2. Add Depreciation (Non-cash expense)
        // Look for "Depreciation Expense" and add it back
        const depreciationAcc = chartOfAccounts.find(a => a.name.includes("Depreciation"));
        let depreciation = 0;
        if (depreciationAcc) {
            // It's an expense, so it reduced Net Income. We add it back (positive value).
            // expense array has { account, amount (abs) }
            const depEntry = pl.expense.find(e => e.account === depreciationAcc.name);
            if (depEntry) depreciation = depEntry.amount;
        }

        // 3. Changes in Working Capital (Assets and Liabilities)
        // Calculate change in AR, Inventory, AP between start and end date
        // This requires "Balance at Start" and "Balance at End"
        // Simplified: Just taking net movement in period for specific types

        const filtered = ReportService.filterTransactions(transactions, startDate, endDate);

        let changeInAR = 0; // Asset increase = Cash decrease
        let changeInAP = 0; // Liability increase = Cash increase
        let changeInInventory = 0; // Asset increase = Cash decrease

        chartOfAccounts.forEach(acc => {
            const balanceChange = ReportService.getAccountBalance(filtered, acc.name);

            if (acc.name.includes("Receivable")) {
                changeInAR += balanceChange;
            } else if (acc.name.includes("Payable")) {
                changeInAP += -balanceChange; // Credit normal, so negative balance is increase. Convert to positive magnitude.
            } else if (acc.name.includes("Inventory")) {
                changeInInventory += balanceChange;
            }
        });

        // Cash Flow from Operations
        const operatingCashFlow = netIncome + depreciation - changeInAR + changeInAP - changeInInventory;

        return {
            netIncome,
            adjustments: {
                depreciation,
                changeInAR: -changeInAR, // Display impact on cash
                changeInAP: changeInAP,
                changeInInventory: -changeInInventory
            },
            operatingCashFlow
        };
    }
};
