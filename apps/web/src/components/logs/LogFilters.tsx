import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { DateRangePicker } from '../ui/DateRangePicker';

interface LogFiltersProps {
  onFilterChange: (filters: any) => void;
  services: any[];
}

export function LogFilters({ onFilterChange, services }: LogFiltersProps) {
  const [filters, setFilters] = useState({ service: '', statusCode: '', search: '', from: '', to: '' });

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (from: string, to: string) => {
    const newFilters = { ...filters, from, to };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-slate-300 text-sm mb-2">Service</label>
          <select
            value={filters.service}
            onChange={(e) => handleChange('service', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
          >
            <option value="">All Services</option>
            {services.map((service) => (
              <option key={service.id} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-slate-300 text-sm mb-2">Status Code</label>
          <select
            value={filters.statusCode}
            onChange={(e) => handleChange('statusCode', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
          >
            <option value="">All Statuses</option>
            <option value="2">2xx Success</option>
            <option value="4">4xx Client Error</option>
            <option value="5">5xx Server Error</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-300 text-sm mb-2">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search endpoints..."
            className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
          />
        </div>
      </div>
      <div>
        <label className="block text-slate-300 text-sm mb-2">Date Range</label>
        <DateRangePicker
          from={filters.from}
          to={filters.to}
          onRangeChange={handleDateChange}
        />
      </div>
    </Card>
  );
}
