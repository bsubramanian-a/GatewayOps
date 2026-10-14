import { db } from '../config/database';
import { normalizeDateRange } from '../utils/date.utils';
import { MetricsSummary, TimeSeriesDataPoint, ServiceDistribution } from '../dto/metrics.dto';

export class MetricsRepository {
  async getSummary(from?: string, to?: string): Promise<MetricsSummary> {
    const { fromDate, toDate } = normalizeDateRange(from, to);

    let query = db('api_logs');
    if (fromDate && toDate) {
      query = query.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      query = query.where('created_at', '>=', fromDate);
    } else if (toDate) {
      query = query.where('created_at', '<=', toDate);
    }

    const countResult = await query.clone().count('* as count').first() as any;
    const totalRequests = parseInt(countResult?.count || '0', 10);

    let failedQuery = db('api_logs').where('status_code', '>=', 400);
    if (fromDate && toDate) {
      failedQuery = failedQuery.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      failedQuery = failedQuery.where('created_at', '>=', fromDate);
    } else if (toDate) {
      failedQuery = failedQuery.where('created_at', '<=', toDate);
    }
    const failedResult = await failedQuery.count('* as count').first() as any;
    const failedRequests = parseInt(failedResult?.count || '0', 10);

    const successRate = totalRequests > 0 
      ? Math.round(((totalRequests - failedRequests) / totalRequests) * 100)
      : 100;

    let authFailuresQuery = db('auth_events')
      .whereIn('event_type', ['login_failure', 'failed_login']);
    if (fromDate && toDate) {
      authFailuresQuery = authFailuresQuery.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      authFailuresQuery = authFailuresQuery.where('created_at', '>=', fromDate);
    } else if (toDate) {
      authFailuresQuery = authFailuresQuery.where('created_at', '<=', toDate);
    }
    const authFailures = await authFailuresQuery.count('* as count').first() as any;

    let latencyQuery = db('api_logs');
    if (fromDate && toDate) {
      latencyQuery = latencyQuery.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      latencyQuery = latencyQuery.where('created_at', '>=', fromDate);
    } else if (toDate) {
      latencyQuery = latencyQuery.where('created_at', '<=', toDate);
    }
    const latencyResult = await latencyQuery.avg('latency_ms as avg').first() as any;
    const avgResponseTime = Math.round(Number(latencyResult?.avg) || 0);

    let violationsQuery = db('rate_limit_violations');
    if (fromDate && toDate) {
      violationsQuery = violationsQuery.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      violationsQuery = violationsQuery.where('created_at', '>=', fromDate);
    } else if (toDate) {
      violationsQuery = violationsQuery.where('created_at', '<=', toDate);
    }
    const violations = await violationsQuery.count('* as count').first() as any;

    return {
      total_requests: totalRequests,
      failed_requests: failedRequests,
      success_rate: successRate,
      auth_failures: parseInt(authFailures?.count || '0', 10),
      avg_response_time: avgResponseTime,
      rate_limit_violations: parseInt(violations?.count || '0', 10),
    };
  }

  async getRequestsOverTime(
    interval: 'hour' | 'day' = 'hour',
    from?: string,
    to?: string,
  ): Promise<TimeSeriesDataPoint[]> {
    const { fromDate, toDate } = normalizeDateRange(from, to);
    const truncInterval = interval === 'day' ? 'day' : 'hour';
    let query = db('api_logs')
      .select(db.raw(`DATE_TRUNC('${truncInterval}', created_at) as timestamp`))
      .count('* as value');

    if (fromDate && toDate) {
      query = query.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      query = query.where('created_at', '>=', fromDate);
    } else if (toDate) {
      query = query.where('created_at', '<=', toDate);
    }

    const result = await query
      .groupByRaw(`DATE_TRUNC('${truncInterval}', created_at)`)
      .orderBy('timestamp', 'asc');

    return (result as any[]).map((row: any) => ({
      timestamp: new Date(row.timestamp).toISOString(),
      value: parseInt(row.value.toString(), 10),
    }));
  }

  async getErrorTrends(from?: string, to?: string): Promise<TimeSeriesDataPoint[]> {
    const { fromDate, toDate } = normalizeDateRange(from, to);
    let query = db('api_logs')
      .select(db.raw(`DATE_TRUNC('hour', created_at) as timestamp`))
      .count('* as value')
      .where('status_code', '>=', 400);

    if (fromDate && toDate) {
      query = query.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      query = query.where('created_at', '>=', fromDate);
    } else if (toDate) {
      query = query.where('created_at', '<=', toDate);
    }

    const result = await query
      .groupByRaw(`DATE_TRUNC('hour', created_at)`)
      .orderBy('timestamp', 'asc');

    return (result as any[]).map((row: any) => ({
      timestamp: new Date(row.timestamp).toISOString(),
      value: parseInt(row.value.toString(), 10),
    }));
  }

  async getServiceDistribution(from?: string, to?: string): Promise<ServiceDistribution[]> {
    const { fromDate, toDate } = normalizeDateRange(from, to);
    let query = db('api_logs')
      .join('services', 'api_logs.service_id', 'services.id')
      .select('services.name')
      .count('api_logs.id as request_count')
      .groupBy('services.name');

    if (fromDate && toDate) {
      query = query.where('api_logs.created_at', '>=', fromDate).where('api_logs.created_at', '<=', toDate);
    } else if (fromDate) {
      query = query.where('api_logs.created_at', '>=', fromDate);
    } else if (toDate) {
      query = query.where('api_logs.created_at', '<=', toDate);
    }

    const results = await query.orderBy('request_count', 'desc');

    const total = results.reduce((sum, r) => sum + (typeof r.request_count === 'string' ? parseInt(r.request_count, 10) : r.request_count), 0);

    return results.map((row: any) => {
      const count = typeof row.request_count === 'string' ? parseInt(row.request_count, 10) : row.request_count;
      return {
        service: row.name,
        request_count: count,
        percentage: Math.round((count / total) * 100),
      };
    });
  }

  async getDetailedMetrics(): Promise<any> {
    const result2xx = await db('api_logs')
      .where('status_code', '>=', 200)
      .where('status_code', '<', 300)
      .count('* as count')
      .first() as any;

    const result4xx = await db('api_logs')
      .where('status_code', '>=', 400)
      .where('status_code', '<', 500)
      .count('* as count')
      .first() as any;

    const result5xx = await db('api_logs')
      .where('status_code', '>=', 500)
      .count('* as count')
      .first() as any;

    const slowest = await db('api_logs')
      .select('endpoint')
      .avg('latency_ms as avg_latency')
      .groupBy('endpoint')
      .orderBy('avg_latency', 'desc')
      .first() as any;

    const busiest = await db('api_logs')
      .join('services', 'api_logs.service_id', 'services.id')
      .select('services.name')
      .count('api_logs.id as request_count')
      .groupBy('services.id', 'services.name')
      .orderBy('request_count', 'desc')
      .first() as any;

    return {
      total_requests_2xx: result2xx.count,
      total_requests_4xx: result4xx.count,
      total_requests_5xx: result5xx.count,
      peak_rpm: 0,
      slowest_endpoint: {
        endpoint: slowest?.endpoint || '',
        avg_latency: Math.round(slowest?.avg_latency || 0),
      },
      busiest_service: {
        name: busiest?.name || '',
        request_count: parseInt(busiest?.request_count || 0, 10),
      },
    };
  }
}
