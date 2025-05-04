import * as jwt from "jsonwebtoken"
import { JWTPayload } from "../interfaces";

export class JWT {
  // private static secret:
  public static async generate(payload: JWTPayload): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(payload, `MIICWwIBAAKBgE8I0cRtfSYdCE2Fz6obj2zsJ6xqJbabEuJUjUMl7SA62MZX07ft6S+f5pRqdORhUEVPG99EBbMfdXWj8veDHXE+5Utm7zrK/DNl1/Pax1yF0mP7fCnB7kCAgEvdGqiKtKTZfMQfjQkK8H/Fu48jVS92cKJUuFRoKz5XY7nqQeN5AgMBAAECgYBAUXcUmd3dJIdbP2hukRs5kz3+LCwg3TaTBign2zeMoRdE4rij2HOKlGB7q98Q9Lj0jpqqKZtR2GoooJHcJ9HPLLGkzlPA0loTiC78IBp8cHkA30mGUNR5Uv3Fr/lBgFAGfmU6LYXve1Y5kKnukdu5HGdTDHY4YESPmvqhhmWQ+QJBAJz7SjMgzCshwcn4z1f6rkVeV2x72Yf82wxNfoMto5olur+eEmdODl4yE9QJ3CvD5kmAfOR7Ds2gdwt+5FUjbQ8CQQCA4vX2B0llRUCq3TsTNSTaiy2l4qu9g97bRtV24ljElV8N610Bu4hmu7q3amn/11nIYJK0jju2pWPVlXXHxbb3AkBQJHJDG/Ff68H1jNK+BbrGq11SgwARTuO9qip2aexmG/D1NowKtWzcZhB9ZfNDXKXKzI/2TWTHUa607blARe+9AkAIoitjrZ1HAVqRl3wrjzXGxefq4sIqUbkN6zLFYegcUv0pC4kRYqSCbTTWsHQlRSGogH+TRKvPUkjbt8VJ+n6FAkEAm4w+SrCYW0jjYYARZIkPJ/SIy5trIOBYbGN9hYXdliU21ZrOrDF0ERz1lc3FqTJ9c29wY06dM1mvYiYa7e6sYA==`,
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
      jwt.verify(token, `MIICWwIBAAKBgE8I0cRtfSYdCE2Fz6obj2zsJ6xqJbabEuJUjUMl7SA62MZX07ft6S+f5pRqdORhUEVPG99EBbMfdXWj8veDHXE+5Utm7zrK/DNl1/Pax1yF0mP7fCnB7kCAgEvdGqiKtKTZfMQfjQkK8H/Fu48jVS92cKJUuFRoKz5XY7nqQeN5AgMBAAECgYBAUXcUmd3dJIdbP2hukRs5kz3+LCwg3TaTBign2zeMoRdE4rij2HOKlGB7q98Q9Lj0jpqqKZtR2GoooJHcJ9HPLLGkzlPA0loTiC78IBp8cHkA30mGUNR5Uv3Fr/lBgFAGfmU6LYXve1Y5kKnukdu5HGdTDHY4YESPmvqhhmWQ+QJBAJz7SjMgzCshwcn4z1f6rkVeV2x72Yf82wxNfoMto5olur+eEmdODl4yE9QJ3CvD5kmAfOR7Ds2gdwt+5FUjbQ8CQQCA4vX2B0llRUCq3TsTNSTaiy2l4qu9g97bRtV24ljElV8N610Bu4hmu7q3amn/11nIYJK0jju2pWPVlXXHxbb3AkBQJHJDG/Ff68H1jNK+BbrGq11SgwARTuO9qip2aexmG/D1NowKtWzcZhB9ZfNDXKXKzI/2TWTHUa607blARe+9AkAIoitjrZ1HAVqRl3wrjzXGxefq4sIqUbkN6zLFYegcUv0pC4kRYqSCbTTWsHQlRSGogH+TRKvPUkjbt8VJ+n6FAkEAm4w+SrCYW0jjYYARZIkPJ/SIy5trIOBYbGN9hYXdliU21ZrOrDF0ERz1lc3FqTJ9c29wY06dM1mvYiYa7e6sYA==`,
        (err, decoded) => {
          if ( err ) {
            reject(err);
          } else {
            if ( decoded == null )
              reject("Token is invalid");

            resolve(decoded);
          }
        })
    })
  }
}