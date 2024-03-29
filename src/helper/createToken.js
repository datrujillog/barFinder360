
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const createToken = (user) => {
    try {
        console.log(user)
        const token = jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role
        }, config.jwtSecret, {
            expiresIn: '1h'
        });

        return token;
    } catch (error) {
        console.log(error);
    }
};