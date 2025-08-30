import React from "react";

const transactions = [
  { id: 1, date: "2025-08-20", description: "Groceries", amount: -50 },
  { id: 2, date: "2025-08-21", description: "Salary", amount: 1500 },
  { id: 3, date: "2025-08-22", description: "Utilities", amount: -120 },
];

export default function RecentTransactions() {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2">Description</th>
            <th className="text-right py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t">
              <td className="py-2">{tx.date}</td>
              <td className="py-2">{tx.description}</td>
              <td
                className={`py-2 text-right ${
                  tx.amount < 0 ? "text-red-500" : "text-green-600"
                }`}
              >
                {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
