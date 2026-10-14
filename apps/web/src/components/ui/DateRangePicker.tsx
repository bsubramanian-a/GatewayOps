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
    <div className="flex items-center gap-4">
      <input
        type="datetime-local"
        value={formatForInput(from)}
        autoComplete="off"
        onChange={(e) => {
          const val = e.target.value ? new Date(e.target.value).toISOString() : '';
          onRangeChange(val, to);
        }}
        className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
      />
      <input
        type="datetime-local"
        value={formatForInput(to)}
        autoComplete="off"
        onChange={(e) => {
          const val = e.target.value ? new Date(e.target.value).toISOString() : '';
          onRangeChange(from, val);
        }}
        className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
      />
      {(from || to) && (
        <button
          type="button"
          onClick={() => onRangeChange('', '')}
          className="px-3 py-2 text-sm bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
