# Easy Server

A lightweight Express.js framework with TypeScript decorators for rapid API development.

## What This Actually Does

Easy Server automatically:
Scans your `controllers/` folder for files and then registers routes using decorators like `@GET`, `@POST`

example:

    @GET('/api/evaluation-schemas')
    @Auth(['12'])
    public async textRoute(req: any, res: any) {
        try {
            
            // do some job

            return (new ESResponse(res)).setData(results.rows).send();
        } catch (e) {
            EasyServe.logger.error(e);
            return (new ESResponse(res)).setStatus("false").setData(e).send();
        }
    }
    
### Authentication and Authorization

EasyServer comes with built in authentication and authorization mechanism.
We use JWT as the default authorization mechanism. For generating a JWT token please check out starter_project.
Authorization is configured using `@Auth()`. `@Auth()` takes an array of 
strings which is treated as permissions. The values should be found in the permission payload of the JWT token before access will be granted to the route.

### Dependency Injection

EasyServer have a dependency injection system that allows you inject objects into your controllers easily using `@Autowire` and `@Inject`.

Example:

    //setup an injectable
    import { Autowire } from "easy_server/src/annotations/Autowire";
    import { Injectable } from "easy_server/src/interfaces";
    import { Pool } from 'pg'
    import { EasyServe } from "easy_server";
    import { AuditEvent } from "@/core/interfaces";
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
            port: 5432,
            max: 20,
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
    
    // Injecting the class
    @Inject("PostgresDB", "postgresDB")
    export class SomeClass {

        private static postgresDB: PostgresDB;

        @GET("/api/some/route")
        public async doSomething(req: any, res: any) {
            try {
                const { classId } = req.params;
                const { date } = req.q
                SomeClass.postgresDB.query(``, [])
                //...
            }catch(e){
                return (new ESResponse(res))
                .setStatus("false")
                .setData({ message: 'Failed to fetch attendance records' })
                .send(500);
            }
        }
    }

## AVAILABLE DECORATORS 

*Express.js routes is that is used*

HTTP Method Decorators (in src/annotations/)
`@GET('/path') `- Handle GET requests

`@POST('/path')` - Handle POST requests

`@PUT('/path')` - Handle PUT requests

`@DELETE('/path')` - Handle DELETE requests

`@PATCH('/path')` - Handle PATCH requests

`@OPTIONS('/path')` - Handle OPTIONS requests

`@HEAD('/path')` - Handle HEAD requests

Authentication Decorator
`@Auth()` - Requires valid JWT token

`@Auth(['admin', 'write']) `- Requires specific permissions

### Dependency Injection

`@Autowire('ServiceName') `- Register class as injectable service

`@Inject('ServiceName', 'propertyName')` - Inject service into static property

### EasyServer Options

    EasyServeConfig {
        port?: string | number,
        controller: ControllerConfig,
        swagger?: SwaggerConfig
        injectables?: { root: string },
        payloadLimit?: string,
        logger?: any,
        key?: string | undefined,
        service: string
        cors: CorsOptions,
        behindProxy?: boolean
    }

📜 LICENSE
ISC License
