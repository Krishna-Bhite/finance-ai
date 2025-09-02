"use client";
import { useState } from "react";
import  Input from "@/components/ui/input";
import  Button  from "@/components/ui/button";

type Props = {
  start?: string;
  end?: string;
  onApply: (range: { startDate?: string; endDate?: string }) => void;
};

export default function DateFilters({ start, end, onApply }: Props) {
  const [s, setS] = useState(start ?? "");
  const [e, setE] = useState(end ?? "");
  return (
    <div className="glass p-3 grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
      <div>
        <label className="text-sm opacity-80">Start date</label>
        <Input type="date" value={s} onChange={(ev) => setS(ev.target.value)} />
      </div>
      <div>
        <label className="text-sm opacity-80">End date</label>
        <Input type="date" value={e} onChange={(ev) => setE(ev.target.value)} />
      </div>
      <Button onClick={() => onApply({ startDate: s || undefined, endDate: e || undefined })}>
        Apply
      </Button>
    </div>
  );
}
