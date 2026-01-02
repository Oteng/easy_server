import { GET } from "easy_server/src/annotations/get";
import { Inject } from "easy_server/src/annotations/Inject";
import { ESResponse } from "easy_server/src/util/Response";
import { EasyServe } from "easy_server";
import { Auth } from "easy_server/src/annotations/AuthDecorator";


@Inject("PostgresDB", "postgresDB")
export class User {

    static postgresDB: any;

    @GET("/api/user/all")
    @Auth()
    public async index(_: any, res: any) {
        try {
            const result = await User.postgresDB.query(`SELECT * FROM tl_user`);

            if (result.rows.length === 0) {
                return (new ESResponse(res)).setStatus("false").setData({ message: "No users found" }).send();
            }

            return (new ESResponse(res)).setData(result.rows[0]).send();
        } catch (e) {
            EasyServe.logger.error(e);
            return (new ESResponse(res)).setStatus("false").setData(e).send();
        }

    }
}