import { Autowire } from "easy_server/src/annotations/Autowire";
import { Injectable } from "easy_server/src/interfaces";
import { Pool } from 'pg';
import { EasyServe } from "easy_server";
import { AuditEvent } from "../core/interfaces";
import * as process from "node:process";

@Autowire("PostgresDB")
export class PostgresDB implements Injectable {

  private readonly pool: Pool;

  static configure(): any {
    return new PostgresDB();
  }

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      max: process.env.DB_MAX_CONN ? parseInt(process.env.DB_MAX_CONN) : 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 20000,
    })
  }

  getPool(): Pool {
    return this.pool;
  }

  async query(text: string, params: Array<any>, event?: AuditEvent) {
    let res: any;
    if (process.env.NODE_ENV === 'development') {
      const start = Date.now()
      res = await this.pool.query(text, params)
      const duration = `${Date.now() - start}ms`;
      EasyServe.logger.info(JSON.stringify({ sql: (text.replace(/\s+/g, ' ').trim()), duration, rows: res.rowCount }));
    } else {
      res = await this.pool.query(text, params)
    }

    if (event)
      this.pool.query(`INSERT INTO tl_audit_log (event_type, event, tl_school_id, tl_user_id)
                       VALUES ($1, $2, $3,
                               $4)`, [event.event_type, event.event, event.tl_school_id, event.tl_user_id]).then(() => {
      }).catch(e => {
        EasyServe.logger.error(JSON.stringify(e))
      })

    return res
  }

  async initTransaction(fun: Function) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN')
      await fun(client)
      await client.query('COMMIT')
    } catch (e: any) {
      await client.query('ROLLBACK')
      EasyServe.logger.error(e)
      throw new Error(`${e.message}||${e.detail}||${e.code}||${e.table}`)
    } finally {
      client.release()
    }
  }
}