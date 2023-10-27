import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class Middleware {

  validateToken(req: any, res: any, next: any) {
    const token = req.cookies.token;
    console.log('token: ', token);

    if (!token) {
      res.status(401).send("Unauthorized: No token provided");
    } else {
      jwt.verify(token, process.env.SECRET_KEY, (err: any, decoded: any) => {
        if (err) {
          res.status(401).send("Unauthorized: Invalid token");
        } else {
          req.email = decoded.email;
          next();
        }
      });
    }
  }
}

export default Middleware;
