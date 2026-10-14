import redis from '../config/redis';
import { MetricsRepository } from '../repositories/metrics.repository';
import { MetricsSummary, TimeSeriesDataPoint, ServiceDistribution, DetailedMetrics } from '../dto/metrics.dto';

const metricsRepo = new MetricsRepository();

export class MetricsService {
  async getSummary(from?: string, to?: string, forceRefresh = false): Promise<MetricsSummary> {
    const cacheKey = `metrics:summary:${from || 'all'}:${to || 'all'}`;

    if (!forceRefresh) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    const summary = await metricsRepo.getSummary(from, to);
    // Short TTL (10 seconds) so new traffic is reflected quickly without overwhelming the DB
    await redis.setEx(cacheKey, 10, JSON.stringify(summary));

    return summary;
  }

  async invalidateCache(pattern = 'metrics:*'): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }

  async getRequestsOverTime(
    interval: 'hour' | 'day' = 'hour',
    from?: string,
    to?: string,
  ): Promise<TimeSeriesDataPoint[]> {
    return await metricsRepo.getRequestsOverTime(interval, from, to);
  }

  async getErrorTrends(from?: string, to?: string): Promise<TimeSeriesDataPoint[]> {
    return await metricsRepo.getErrorTrends(from, to);
  }

  async getServiceDistribution(from?: string, to?: string): Promise<ServiceDistribution[]> {
    return await metricsRepo.getServiceDistribution(from, to);
  }

  async getDetailedMetrics(): Promise<DetailedMetrics> {
    return await metricsRepo.getDetailedMetrics();
  }
}
