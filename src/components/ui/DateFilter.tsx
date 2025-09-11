"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dateOptions = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "7days" },
  { label: "Last 30 days", value: "30days" },
  { label: "This month", value: "thisMonth" },
  { label: "Last month", value: "lastMonth" },
] as const;

interface DateFilterProps {
  onDateChange: (value: string) => void;
  className?: string;
}

export function DateFilter({ onDateChange, className }: DateFilterProps) {
  return (
    <Select defaultValue="today" onValueChange={onDateChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select date range" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {dateOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}