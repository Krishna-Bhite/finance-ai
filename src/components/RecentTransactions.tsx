"use client";

type Expense = {
  id: string;
  date: string;
  amount: number;
  category: string;
  description?: string;
};

type Props = {
  data: Expense[];
};

export default function RecentTransactions({ data }: Props) {
  const recent = [...data]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="glass p-4">
      <div className="text-sm font-medium mb-3">Recent Transactions</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left opacity-70">
              <th className="py-2">Date</th>
              <th>Category</th>
              <th>Description</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((tx) => (
              <tr
                key={tx.id}
                className="border-t border-white/10 text-sm hover:bg-white/5"
              >
                <td className="py-2">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td>{tx.category}</td>
                <td>{tx.description || "-"}</td>
                <td
                  className={`text-right font-medium ${
                    tx.category.toLowerCase() === "income"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {tx.category.toLowerCase() === "income" ? "+" : "-"}₹
                  {Math.abs(tx.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
