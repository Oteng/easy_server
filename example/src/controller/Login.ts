import { UserPayload } from './../core/interfaces';
import { Inject } from "easy_server/src/annotations/Inject";
import { POST } from "easy_server/src/annotations/post";
import { Validator } from "easy_server/src/util/Validator";
import { ESResponse } from "easy_server/src/util/Response";
import * as Bcrypt from "bcrypt";
import { JWT } from "easy_server/src/util/JWT";
import { EasyServe } from "easy_server";

@Inject("PostgresDB", "postgresDB")
export class Login {

    static postgresDB: any;

    @POST("/api/login")
    public async index(req: any, res: any) {
        try {
            await Validator.validate(req.body, [{
                fieldName: 'username',
                displayName: 'User Name',
                rules: ['required']
            }, {
                fieldName: 'password',
                displayName: 'Password',
                rules: ['required', 'minLength:8']
            }]);
        } catch (e) {
            EasyServe.logger.warn(JSON.stringify(e));
            return (new ESResponse(res)).setStatus("false").setData(e).send();
        }

        let queryResult = await Login.postgresDB.query('SELECT id, username, password, type FROM tl_user WHERE username=$1', [req.body.username]);

        if (queryResult.rowCount != 1) {
            EasyServe.logger.warn(`wrong username login attempt username: ${req.body.username} from IP: ${req.ip}`, ['security', 'login']);
            return (new ESResponse(res)).setStatus("false").setMsg("Invalid username or password").send();
        }

        if (!await Bcrypt.compare(req.body.password, queryResult.rows[0].password)) {
            EasyServe.logger.warn(`wrong password login attempt username: ${req.body.username} from IP: ${req.ip}`, ['security', 'login']);
            return (new ESResponse(res)).setStatus("false").setMsg("Invalid username or password").send();
        }

        try {
            const token = await JWT.generate<UserPayload>({
                type: queryResult.rows[0].type,
                username: req.body.username,
                userId: queryResult.rows[0].id,
            })

            EasyServe.logger.warn(`successful login: ${req.body.username} from IP: ${req.ip}`, ['security', 'login']);
            return (new ESResponse(res)).setMsg("Login successful").setData(token).send();

        } catch (e) {
            EasyServe.logger.error(e);
            return (new ESResponse(res)).setStatus("false").sendError('System error please contact support');
        }
    }
}