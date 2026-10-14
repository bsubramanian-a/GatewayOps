import { db } from '../config/database';
import { AuthEvent } from '../types';
import { PaginationMeta } from '../dto/pagination.dto';

export class AuthRepository {
  async getStats(from?: string, to?: string): Promise<any> {
    let fromDate = from;
    let toDate = to;

    if (fromDate && /^\d{4}-\d{2}-\d{2}$/.test(fromDate)) {
      fromDate = `${fromDate}T00:00:00.000Z`;
    }
    if (toDate && /^\d{4}-\d{2}-\d{2}$/.test(toDate)) {
      toDate = `${toDate}T23:59:59.999Z`;
    }

    let successQuery = db('auth_events').where('event_type', 'login_success');
    if (fromDate && toDate) {
      successQuery = successQuery.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      successQuery = successQuery.where('created_at', '>=', fromDate);
    } else if (toDate) {
      successQuery = successQuery.where('created_at', '<=', toDate);
    }
    const successResult = await successQuery.count('* as count').first() as any;

    let failureQuery = db('auth_events').whereIn('event_type', ['login_failure', 'failed_login']);
    if (fromDate && toDate) {
      failureQuery = failureQuery.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      failureQuery = failureQuery.where('created_at', '>=', fromDate);
    } else if (toDate) {
      failureQuery = failureQuery.where('created_at', '<=', toDate);
    }
    const failureResult = await failureQuery.count('* as count').first() as any;

    let invalidQuery = db('auth_events').where('event_type', 'token_invalid');
    if (fromDate && toDate) {
      invalidQuery = invalidQuery.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      invalidQuery = invalidQuery.where('created_at', '>=', fromDate);
    } else if (toDate) {
      invalidQuery = invalidQuery.where('created_at', '<=', toDate);
    }
    const invalidResult = await invalidQuery.count('* as count').first() as any;

    let expiredQuery = db('auth_events').where('event_type', 'token_expired');
    if (fromDate && toDate) {
      expiredQuery = expiredQuery.where('created_at', '>=', fromDate).where('created_at', '<=', toDate);
    } else if (fromDate) {
      expiredQuery = expiredQuery.where('created_at', '>=', fromDate);
    } else if (toDate) {
      expiredQuery = expiredQuery.where('created_at', '<=', toDate);
    }
    const expiredResult = await expiredQuery.count('* as count').first() as any;

    return {
      successful_logins: parseInt(successResult?.count || '0', 10),
      failed_logins: parseInt(failureResult?.count || '0', 10),
      token_invalid: parseInt(invalidResult?.count || '0', 10),
      token_expired: parseInt(expiredResult?.count || '0', 10),
    };
  }

  async getEvents(page: number, limit: number): Promise<{
    events: AuthEvent[];
    meta: PaginationMeta;
  }> {
    const offset = (page - 1) * limit;
    const total = await db('auth_events').count('*').first() as any;
    
    const events = await db('auth_events')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      events: events as AuthEvent[],
      meta: {
        page,
        limit,
        total: total.count,
        pages: Math.ceil(total.count / limit),
      },
    };
  }
}
