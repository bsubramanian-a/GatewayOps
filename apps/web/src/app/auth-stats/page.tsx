'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { Spinner } from '../../components/ui/Spinner';
import { api } from '../../lib/api';

export default function AuthStatsPage() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const statsQuery = useQuery({
    queryKey: ['auth', 'stats', dateRange.from, dateRange.to],
    queryFn: async () => {
      const response = await api.get('/auth/stats', {
        params: {
          ...(dateRange.from ? { from: dateRange.from } : {}),
          ...(dateRange.to ? { to: dateRange.to } : {}),
        },
      });
      return response.data.data;
    },
  });

  const stats = statsQuery.data || {};

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Authentication Stats</h1>

      <div className="mb-8">
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onRangeChange={(from, to) => setDateRange({ from, to })}
        />
      </div>

      {statsQuery.isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Successful Logins" value={stats.successful_logins || 0} />
          <MetricCard title="Failed Logins" value={stats.failed_logins || 0} />
          <MetricCard title="Token Invalid" value={stats.token_invalid || 0} />
          <MetricCard title="Token Expired" value={stats.token_expired || 0} />
        </div>
      )}
    </div>
  );
}
