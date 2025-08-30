const transactions = [
  {
    id: 1,
    description: "Payment from Client A",
    amount: "+$500",
    date: "2025-08-01",
  },
  {
    id: 2,
    description: "Office Supplies",
    amount: "-$120",
    date: "2025-08-03",
  },
  {
    id: 3,
    description: "Salary Payment",
    amount: "-$2000",
    date: "2025-08-05",
  },
];

export default function RecentTransactions() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Description</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{tx.description}</td>
              <td
                className={`py-2 font-semibold ${
                  tx.amount.startsWith("+") ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.amount}
              </td>
              <td className="py-2">{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
