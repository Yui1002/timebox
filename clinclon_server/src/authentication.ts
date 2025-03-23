import jwt, { VerifyOptions } from "jsonwebtoken";
import dotenv from 'dotenv';
import * as express from "express";
dotenv.config();

const options = {
  algorithms: ['HS256']
}


export function expressAuthentication (request: express.Request): Promise<any> {
  let token = request.headers["authorization"];
  //strip `Bearer` [token]
  token = token.replace(/^Bearer\s+/, "");

  return doAuth(token);
}

function doAuth(token: string) {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(false);
    }

    jwt.verify(token, process.env.JWT_SECRET, options as VerifyOptions, (err: any, decoded: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}