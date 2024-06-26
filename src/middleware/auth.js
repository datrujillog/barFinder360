import jwt from "jsonwebtoken";
import res from "express";

import { NotFound, BadRequest } from "./errors.js";

import config from "../config/config.js";

import { extractDataFromToken } from "../helper/extractData.js";

const auth = async (businessId, dataToken) => {

    // const token = req.cookies.token;
    if (!dataToken) {
        throw new NotFound("Token is required");
    }
    try {
        const { token } = dataToken;
        const verify = await verifyToken(token);
        const data = await extractDataFromToken(token);
        console.log(data)

        if (data.businessId !== businessId) throw new BadRequest("No tienes permisos para acceder a esta información");

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
    try {
        if (!token) {
            throw new BadRequest("Token is required");
        }
        jwt.verify(token, config.jwtSecret, (error, user) => {
            if (error) {
                throw new BadRequest("Invalid token");
            }
            return user;
        });

    } catch (error) {
        return { success: false, error: error };
    }



};


export { auth, verifyToken, createAccessToken }