import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { title: "Total Balance", value: "$25,400" },
  { title: "Income", value: "$12,500" },
  { title: "Expenses", value: "$8,200" },
  { title: "Transactions", value: "145" },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <h3 className="text-gray-500 text-sm">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
