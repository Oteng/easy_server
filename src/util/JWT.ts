import * as jwt from "jsonwebtoken"
import { JWTPayload } from "../interfaces";
import { EasyServe } from "../../index";

export class JWT {
  // private static secret:
  public static async generate(payload: JWTPayload): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(payload, EasyServe.key,
        {
          algorithm: 'HS256',
          expiresIn: '1d',
          // notBefore: '1s'
        }, (err, token) => {
          if ( err ) {
            reject(err);
          } else {
            if ( token == null )
              reject("Can not generate token. Please try again")
            else
              resolve(token);
          }
        });
    })
  }

  public static async verify(token: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        jwt.verify(token, EasyServe.key,
          (err, decoded) => {
            if ( err ) {
              reject(err);
            } else {
              if ( decoded == null )
                reject("Token is invalid");

              resolve(decoded);
            }
          })
      } catch ( e ) {
        EasyServe.logger.error(e);
      }
    })
  }
}