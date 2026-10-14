'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { Spinner } from '../../components/ui/Spinner';
import { api } from '../../lib/api';

export default function RateLimitsPage() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const summaryQuery = useQuery({
    queryKey: ['rate-limits', 'summary', dateRange.from, dateRange.to],
    queryFn: async () => {
      const response = await api.get('/rate-limits/summary', {
        params: {
          ...(dateRange.from ? { from: dateRange.from } : {}),
          ...(dateRange.to ? { to: dateRange.to } : {}),
        },
      });
      return response.data.data;
    },
  });

  const summary = summaryQuery.data || {};

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Rate Limits</h1>

      <div className="mb-8">
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onRangeChange={(from, to) => setDateRange({ from, to })}
        />
      </div>

      {summaryQuery.isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="Total Violations" value={summary.total_violations || 0} />
          <MetricCard title="Requests/Min" value={summary.requests_per_minute || 0} />
          <MetricCard title="Peak RPM" value={summary.peak_rpm || 0} />
        </div>
      )}
    </div>
  );
}
