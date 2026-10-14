import React from 'react';

interface DateRangePickerProps {
  from: string;
  to: string;
  onRangeChange: (from: string, to: string) => void;
}

export function DateRangePicker({ from, to, onRangeChange }: DateRangePickerProps) {
  const formatForInput = (val: string) => {
    if (!val) return '';
    return val.includes('T') ? val.slice(0, 16) : val;
  };

  return (
    <div className="flex gap-4">
      <input
        type="datetime-local"
        value={formatForInput(from)}
        onChange={(e) => {
          const val = e.target.value ? new Date(e.target.value).toISOString() : e.target.value;
          onRangeChange(val, to);
        }}
        className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
      />
      <input
        type="datetime-local"
        value={formatForInput(to)}
        onChange={(e) => {
          const val = e.target.value ? new Date(e.target.value).toISOString() : e.target.value;
          onRangeChange(from, val);
        }}
        className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
      />
    </div>
  );
}
