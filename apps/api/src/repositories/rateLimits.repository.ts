import { db } from '../config/database';
import { normalizeDateRange } from '../utils/date.utils';
import { RateLimitViolation } from '../types';

export class RateLimitsRepository {
  async getSummary(from?: string, to?: string): Promise<any> {
    const { fromDate, toDate } = normalizeDateRange(from, to);

    let query = db('rate_limit_violations');
    if (fromDate && toDate) {
      query = query.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      query = query.where('created_at', '>=', fromDate);
    } else if (toDate) {
      query = query.where('created_at', '<=', toDate);
    }

    const totalViolations = await query.clone().count('* as count').first() as any;

    let requestsQuery = db('rate_limit_violations');
    if (fromDate && toDate) {
      requestsQuery = requestsQuery.where('window_start', '>=', fromDate).where('window_start', '<=', toDate);
    } else if (fromDate) {
      requestsQuery = requestsQuery.where('window_start', '>=', fromDate);
    } else if (toDate) {
      requestsQuery = requestsQuery.where('window_start', '<=', toDate);
    }
    const requestsResult = await requestsQuery.clone().sum('request_count as sum').first() as any;
    const totalRequests = Number(requestsResult?.sum || 0);

    const peakResult = await requestsQuery.clone().max('request_count as max_requests').first() as any;
    const peakRpm = Number(peakResult?.max_requests || 0);

    const windowSeconds = fromDate && toDate 
      ? Math.max(1, (new Date(toDate).getTime() - new Date(fromDate).getTime()) / 1000)
      : 3600;
    const totalMinutes = windowSeconds / 60;
    const rpm = totalMinutes > 0 ? Math.round((totalRequests / totalMinutes) * 100) / 100 : 0;

    return {
      total_violations: parseInt(totalViolations?.count || '0', 10),
      requests_per_minute: rpm,
      peak_rpm: peakRpm,
    };
  }

  async getViolations(from?: string, to?: string): Promise<RateLimitViolation[]> {
    const { fromDate, toDate } = normalizeDateRange(from, to);

    let query = db('rate_limit_violations');
    if (fromDate && toDate) {
      query = query.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      query = query.where('created_at', '>=', fromDate);
    } else if (toDate) {
      query = query.where('created_at', '<=', toDate);
    }
    return await query.orderBy('created_at', 'desc');
  }

  async getTopOffenders(): Promise<any[]> {
    return await db('rate_limit_violations')
      .select('user_id', 'service_id')
      .count('* as violation_count')
      .sum('request_count')
      .groupBy('user_id', 'service_id')
      .orderBy('violation_count', 'desc')
      .limit(10);
  }
}
