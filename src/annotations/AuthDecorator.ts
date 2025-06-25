import { Request, Response } from "express-serve-static-core";
import { JWT } from "../util/JWT";
import { ESResponse } from "../util/Response";


export const Auth = (permissions?: String[]) => {
  return (fn: any, _: ClassMethodDecoratorContext) => {
    return async (req: Request<any | null>, res: Response) => {
      try {
        if ( !req.headers.authorization )
          return new ESResponse(res).setMsg("Access Denied. Authentication is required").send(403);
        const payload = await JWT.verify(req.headers.authorization)

        if ( typeof payload === "string" ) return new ESResponse(res).setMsg("Access Denied. You don't have permission to perform this action").send(403);
        if ( payload == undefined ) return new ESResponse(res).setMsg("Access Denied. You don't have permission to perform this action").send(403);

        // assuming permission is an object
        if ( permissions?.length ) {
          if ( !payload.permissions || !Object.keys(payload.permissions).length ) {
            return new ESResponse(res).setMsg(`Access Denied. You don't have permission to perform this action: null`).send(403);
          }
          for ( const perm of permissions ) {
            // @ts-ignore
            if (!payload.permissions[ perm ] )
              return new ESResponse(res).setMsg(`Access Denied. You don't have permission to perform this action: ${ perm }`).send(403);
          }
          // permissions.sort();
          // if ( !( payload?.perm?.every((val: string, idx: number) => val === permissions[ idx ]) ) )
          //   return new ESResponse(res).setMsg("Access Denied. You don't have permission to perform this action").send(401);
        }

        if ( !req.body ) req.body = {}
        req.body.user = {
          type: payload.type,
          username: payload.username,
          userId: payload.userId,
        }
        fn(req, res);
      } catch ( e ) {
        console.log(e)
        return new ESResponse(res).setMsg("Access Denied").setData(e).send(401);
      }
    }
  }
}