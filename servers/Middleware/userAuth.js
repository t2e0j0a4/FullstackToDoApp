import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

export default async function userAuth(req,res,next) {

    const {token} = req.headers;
    const JWT_SECRET = process.env.JWT_SECRET;
    const tokenAuth = jwt.verify(token,JWT_SECRET);
    req.finalAuth = tokenAuth;
    next();

}