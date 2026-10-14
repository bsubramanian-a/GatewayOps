import { db } from '../config/database';
import { normalizeDateRange } from '../utils/date.utils';
import { ApiLog } from '../types';
import { LogsQueryParams } from '../dto/logs.dto';
import { PaginationMeta } from '../dto/pagination.dto';

export class LogsRepository {
  async findAll(params: LogsQueryParams & { page: number; limit: number }) {
    const { page = 1, limit = 10, service, statusCode, from, to, search } = params;

    let query = db('api_logs')
      .leftJoin('services', 'api_logs.service_id', 'services.id');

    if (service) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(service);
      query = query.where((builder) => {
        builder.where('services.slug', service).orWhere('services.name', service);
        if (isUuid) {
          builder.orWhere('services.id', service);
        }
      });
    }

    if (statusCode) {
      let code = parseInt(statusCode.toString(), 10);
      if (code % 100 === 0 && code >= 100 && code <= 900) {
        code = Math.floor(code / 100);
      }
      if (code >= 1 && code <= 9) {
        query = query
          .where('api_logs.status_code', '>=', code * 100)
          .where('api_logs.status_code', '<', (code + 1) * 100);
      } else {
        query = query.where('api_logs.status_code', code);
      }
    }

    const { fromDate, toDate } = normalizeDateRange(from, to);

    if (fromDate && toDate) {
      query = query.where('api_logs.created_at', '>=', fromDate).where('api_logs.created_at', '<=', toDate);
    } else if (fromDate) {
      query = query.where('api_logs.created_at', '>=', fromDate);
    } else if (toDate) {
      query = query.where('api_logs.created_at', '<=', toDate);
    }

    if (search) {
      query = query.whereILike('api_logs.endpoint', `%${search}%`);
    }

    const total = await query.clone().count('api_logs.id as count').first() as any;
    const totalCount = parseInt(total?.count || '0', 10);

    const pageNumber = Math.max(1, page || 1);
    const limitNumber = Math.max(1, limit || 10);
    const offset = (pageNumber - 1) * limitNumber;

    const logs = await query
      .select('api_logs.*', 'services.name as service_name')
      .orderBy('api_logs.created_at', 'desc')
      .limit(limitNumber)
      .offset(offset);

    return {
      logs: logs as ApiLog[],
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNumber) || 1,
      } as PaginationMeta,
    };
  }

  async findById(id: string): Promise<ApiLog | null> {
    return await db('api_logs')
      .leftJoin('services', 'api_logs.service_id', 'services.id')
      .select('api_logs.*', 'services.name as service_name')
      .where('api_logs.id', id)
      .first();
  }
}
