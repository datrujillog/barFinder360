import jwt from "jsonwebtoken";
import res from "express";

import { NotFound, BadRequest } from "./errors.js";

import config from "../config/config.js";

import { extractDataFromToken } from "../helper/extractData.js";

const auth = async (businessId, token) => {

    // const token = req.cookies.token;
    if (!token) {
        throw new NotFound("Token is required");
    }
    try {
        
        const verify = await verifyToken(token);
        // throw new BadRequest(verify.error.message);


        const data = await extractDataFromToken(token);
        // req.user = data;

        return {
            success: true,
            data: data,
            message: `Authenticated user ${data.email}`,
        }
    } catch (error) {
        return { success: false, error: error };
    }
};

const createAccessToken = user => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}
// verifar si el token es valido
const verifyToken = (token) => {

    if (!token) {
        throw new BadRequest("Token is required");
    }
    jwt.verify(token, config.jwtSecret, (error, user) => {
        if (error) {
            throw new BadRequest("Invalid token");
        }
        return user;
    });




};


export { auth, verifyToken, createAccessToken }