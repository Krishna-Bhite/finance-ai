"use client";

import {Progress}  from "@/components/ui/progress";

interface Props {
  budgetId: string;
  amount: number;
  startDate: string | Date;
  endDate: string | Date;
}

export default function BudgetProgress({ amount, startDate, endDate }: Props) {
  // for now we’ll just show a placeholder progress
  const percent = 30;

  return (
    <div>
      <Progress value={percent} />
      <p className="text-sm mt-2 opacity-80">
        ${((percent / 100) * amount).toFixed(2)} spent of ${amount.toFixed(2)} ({percent}%)
      </p>
    </div>
  );
}
