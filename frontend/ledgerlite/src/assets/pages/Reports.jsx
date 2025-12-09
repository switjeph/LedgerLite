import React, { useState, useMemo } from "react";
import { useLedger } from "../../context/LedgerContext";
import { ReportService } from "../../services/reportService";
import { ExportService } from "../../services/exportService";
import ReportLayout from "../components/reports/ReportLayout";
import ReportDashboard from "../components/reports/ReportDashboard";
import FinancialStatementTable from "../components/reports/FinancialStatementTable";
import AgingTable from "../components/reports/AgingTable";
import FinancialRatiosPanel from "../components/reports/FinancialRatiosPanel";
import DrillDownModal from "../components/reports/DrillDownModal";

export default function Reports() {
  const { transactions, chartOfAccounts, registerEntries, auditLog } = useLedger();
  const [activeReport, setActiveReport] = useState("dashboard");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // --- Advanced Features State ---
  const [isComparative, setIsComparative] = useState(false);
  const [drillDownAccount, setDrillDownAccount] = useState(null);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // --- Computed Data ---
  const dashboardKPIs = useMemo(() =>
    ReportService.getDashboardKPIs(transactions, chartOfAccounts),
    [transactions, chartOfAccounts]);

  // Helper to merge current and previous data
  const mergeWithPrevious = (currentList, previousList) => {
    return currentList.map(curr => {
      const prev = previousList.find(p => p.account === curr.account);
      const prevAmount = prev ? prev.amount : 0;
      const variance = prevAmount !== 0 ? ((curr.amount - prevAmount) / prevAmount) * 100 : 0;
      return { ...curr, previousAmount: prevAmount, variance };
    });
  };

  const balanceSheet = useMemo(() => {
    const current = ReportService.getBalanceSheet(transactions, chartOfAccounts, dateRange.end);

    if (isComparative) {
      // Previous month
      const prevDate = new Date(dateRange.end);
      prevDate.setMonth(prevDate.getMonth() - 1);
      const prev = ReportService.getBalanceSheet(transactions, chartOfAccounts, prevDate.toISOString().split('T')[0]);

      return {
        ...current,
        assets: mergeWithPrevious(current.assets, prev.assets),
        liabilities: mergeWithPrevious(current.liabilities, prev.liabilities),
        equity: mergeWithPrevious(current.equity, prev.equity)
      };
    }
    return current;
  }, [transactions, chartOfAccounts, dateRange.end, isComparative]);

  const profitLoss = useMemo(() => {
    const current = ReportService.getProfitAndLoss(transactions, chartOfAccounts, dateRange.start, dateRange.end);

    if (isComparative) {
      // Previous month same duration
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      const duration = end - start;

      const prevEnd = new Date(start.getTime() - 24 * 60 * 60 * 1000);
      const prevStart = new Date(prevEnd.getTime() - duration);

      const prev = ReportService.getProfitAndLoss(transactions, chartOfAccounts, prevStart.toISOString().split('T')[0], prevEnd.toISOString().split('T')[0]);

      return {
        ...current,
        revenue: mergeWithPrevious(current.revenue, prev.revenue),
        expense: mergeWithPrevious(current.expense, prev.expense)
      };
    }
    return current;
  }, [transactions, chartOfAccounts, dateRange, isComparative]);

  const trialBalance = useMemo(() =>
    ReportService.getTrialBalance(transactions, chartOfAccounts, dateRange.end),
    [transactions, chartOfAccounts, dateRange.end]);

  const arAging = useMemo(() =>
    ReportService.getAgingReport(registerEntries, "Sales"),
    [registerEntries]);

  const apAging = useMemo(() =>
    ReportService.getAgingReport(registerEntries, "Purchase"),
    [registerEntries]);

  // Check for existence of new service functions
  const financialRatios = useMemo(() => {
    if (ReportService.getFinancialRatios) {
      return ReportService.getFinancialRatios(transactions, chartOfAccounts);
    }
    return { currentRatio: 0, profitMargin: 0, debtToEquity: 0 };
  }, [transactions, chartOfAccounts]);

  const cashFlowIndirect = useMemo(() => {
    if (ReportService.getCashFlowIndirect) {
      return ReportService.getCashFlowIndirect(transactions, chartOfAccounts, dateRange.start, dateRange.end);
    }
    return null;
  }, [transactions, chartOfAccounts, dateRange]);


  // --- Handlers ---
  const handleExport = () => {
    alert("Generating PDF...");
    const title = activeReport === "profit-loss" ? "Profit & Loss" : "Report";

    // Mock data extraction for generic export
    let data = [];
    let headers = ["Account", "Amount"];

    if (activeReport === "profit-loss") {
      data = [...profitLoss.revenue, ...profitLoss.expense].map(i => ({ account: i.account, amount: formatCurrency(i.amount) }));
    } else if (activeReport === "balance-sheet") {
      data = [...balanceSheet.assets, ...balanceSheet.liabilities].map(i => ({ account: i.account, amount: formatCurrency(i.amount) }));
    }

    ExportService.exportToPDF(title, headers, data);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDrillDown = (accountName) => {
    setDrillDownAccount(accountName);
  };

  // --- Controls ---
  const extraControls = (
    <button
      onClick={() => setIsComparative(!isComparative)}
      className={`px-3 py-1.5 text-xs font-medium rounded border ${isComparative
          ? "bg-marine-100 text-marine-700 border-marine-200"
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        }`}
    >
      {isComparative ? "Comparing (Last Month)" : "Compare Mode"}
    </button>
  );

  // --- Render Content ---
  const renderContent = () => {
    switch (activeReport) {
      case "dashboard":
        return <ReportDashboard kpis={dashboardKPIs} plData={profitLoss} />;

      case "balance-sheet":
        return (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Balance Sheet</h2>
              <p className="text-gray-500">As of {dateRange.end}</p>
            </div>
            <FinancialRatiosPanel ratios={financialRatios} />
            <FinancialStatementTable
              title="Assets"
              data={balanceSheet.assets}
              totalLabel="Total Assets"
              formatCurrency={formatCurrency}
              onRowClick={handleDrillDown}
              isComparative={isComparative}
            />
            <FinancialStatementTable
              title="Liabilities"
              data={balanceSheet.liabilities}
              totalLabel="Total Liabilities"
              formatCurrency={formatCurrency}
              onRowClick={handleDrillDown}
              isComparative={isComparative}
            />
            <FinancialStatementTable
              title="Equity"
              data={balanceSheet.equity}
              totalLabel="Total Equity"
              formatCurrency={formatCurrency}
              onRowClick={handleDrillDown}
              isComparative={isComparative}
            />
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg font-bold text-gray-900">
              <span>Total Liabilities & Equity</span>
              <span>{formatCurrency(balanceSheet.totalLiabilities + balanceSheet.totalEquity)}</span>
            </div>
          </div>
        );

      case "profit-loss":
        return (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Profit & Loss Statement</h2>
              <p className="text-gray-500">From {dateRange.start} to {dateRange.end}</p>
            </div>
            <FinancialStatementTable
              title="Revenue"
              data={profitLoss.revenue}
              totalLabel="Total Revenue"
              formatCurrency={formatCurrency}
              onRowClick={handleDrillDown}
              isComparative={isComparative}
            />
            <FinancialStatementTable
              title="Expenses"
              data={profitLoss.expense}
              totalLabel="Total Expenses"
              formatCurrency={formatCurrency}
              onRowClick={handleDrillDown}
              isComparative={isComparative}
            />
            <div className={`flex justify-between items-center p-4 rounded-lg font-bold text-lg ${profitLoss.netProfit >= 0 ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}>
              <span>Net Profit</span>
              <span>{formatCurrency(profitLoss.netProfit)}</span>
            </div>
          </div>
        );

      case "cash-flow":
        if (!cashFlowIndirect) return <div className="p-8 text-center text-gray-400">Loading Cash Flow data...</div>;
        return (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Statement of Cash Flows</h2>
              <p className="text-gray-500">Indirect Method (Operating Activities)</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">Operating Activities</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between font-medium">
                  <span>Net Income</span>
                  <span>{formatCurrency(cashFlowIndirect.netIncome)}</span>
                </div>
                <div className="flex justify-between text-gray-600 pl-4">
                  <span>+ Depreciation</span>
                  <span>{formatCurrency(cashFlowIndirect.adjustments.depreciation)}</span>
                </div>
                <div className="flex justify-between text-gray-600 pl-4">
                  <span>(Increase)/Decrease in A/R</span>
                  <span>{formatCurrency(cashFlowIndirect.adjustments.changeInAR)}</span>
                </div>
                <div className="flex justify-between text-gray-600 pl-4">
                  <span>Increase/(Decrease) in A/P</span>
                  <span>{formatCurrency(cashFlowIndirect.adjustments.changeInAP)}</span>
                </div>
                <div className="flex justify-between text-gray-600 pl-4">
                  <span>(Increase)/Decrease in Inventory</span>
                  <span>{formatCurrency(cashFlowIndirect.adjustments.changeInInventory)}</span>
                </div>
                <div className="flex justify-between font-bold text-marine-700 border-t pt-2 mt-2">
                  <span>Net Cash from Operations</span>
                  <span>{formatCurrency(cashFlowIndirect.operatingCashFlow)}</span>
                </div>
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-500 italic">
              Investing and Financing activities to be implemented with asset tracking updates.
            </div>
          </div>
        );

      case "trial-balance":
        return (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Trial Balance</h2>
              <p className="text-gray-500">As of {dateRange.end}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 font-semibold text-gray-900 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Account</th>
                    <th className="px-6 py-3 text-right">Debit</th>
                    <th className="px-6 py-3 text-right">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {trialBalance.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-700">{row.account}</td>
                      <td className="px-6 py-3 text-right text-gray-600">
                        {row.debit > 0 ? formatCurrency(row.debit) : "-"}
                      </td>
                      <td className="px-6 py-3 text-right text-gray-600">
                        {row.credit > 0 ? formatCurrency(row.credit) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-bold text-gray-900 border-t border-gray-200">
                  <tr>
                    <td className="px-6 py-3">Total</td>
                    <td className="px-6 py-3 text-right">{formatCurrency(trialBalance.totalDebit)}</td>
                    <td className="px-6 py-3 text-right">{formatCurrency(trialBalance.totalCredit)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        );

      case "aging":
        return (
          <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Aging Reports</h2>
              <p className="text-gray-500">Receivables & Payables</p>
            </div>
            <AgingTable title="Accounts Receivable (Simulated)" data={arAging} />
            <AgingTable title="Accounts Payable (Simulated)" data={apAging} />
          </div>
        );

      case "audit-log":
        return (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">System Audit Logs</h2>
              <p className="text-gray-500">Track user activities and system events</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 font-semibold text-gray-900 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Timestamp</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Action</th>
                    <th className="px-6 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(auditLog || []).map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 text-gray-500 text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-700">{log.user}</td>
                      <td className="px-6 py-3 text-gray-900">{log.action}</td>
                      <td className="px-6 py-3 text-gray-500 italic truncate max-w-xs">{JSON.stringify(log.details)}</td>
                    </tr>
                  ))}
                  {(!auditLog || auditLog.length === 0) && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">
                        No audit records found. Try performing some actions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div>Select a report</div>;
    }
  };

  return (
    <ReportLayout
      activeReport={activeReport}
      setActiveReport={setActiveReport}
      dateRange={dateRange}
      setDateRange={setDateRange}
      onExport={handleExport}
      onPrint={handlePrint}
      extraControls={extraControls}
    >
      {renderContent()}

      <DrillDownModal
        isOpen={!!drillDownAccount}
        onClose={() => setDrillDownAccount(null)}
        accountName={drillDownAccount}
        transactions={transactions}
        formatCurrency={formatCurrency}
      />
    </ReportLayout>
  );
}
