
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const createToken = (user) => {
    try {
        // console.log(user)
        const token = jwt.sign({
            id: user._id,
            email: user.email,
            businessId: user.businessId,
            rol: user.rolId
        }, config.jwtSecret, {
            expiresIn: '1h'
        });

        return token;
    } catch (error) {
        console.log(error);
    }
};