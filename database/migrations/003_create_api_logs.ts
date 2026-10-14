import { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('api_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('service_id').notNullable().references('id').inTable('services');
    table.uuid('user_id').nullable().references('id').inTable('users');
    table.string('endpoint', 500).notNullable();
    table.string('method', 10).notNullable();
    table.integer('status_code').notNullable();
    table.integer('latency_ms').notNullable();
    table.integer('request_size').nullable();
    table.integer('response_size').nullable();
    table.specificType('ip_address', 'INET').nullable();
    table.text('user_agent').nullable();
    table.text('error_message').nullable();
    table.timestamptz('created_at').notNullable().defaultTo(knex.fn.now());
    
    table.index(['created_at']);
    table.index(['service_id']);
    table.index(['status_code']);
    table.index(['user_id']);
    table.index(['service_id', 'created_at']);
    table.index(['status_code', 'created_at']);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTableIfExists('api_logs');
}
