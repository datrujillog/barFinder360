// import extractDataFromToken from "../helper/extractData.js";


import config from "../config/config.js";
import { extractDataFromToken } from "../helper/extractData.js";


const auth = async (req, res, next) => {
    const token = req;
    // const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const data = await extractDataFromToken(token);
        // req.user = data;
        console.log(data);

        return data;
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

const createAccessToken = user => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}
// verifar si el token es valido
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, config.jwtSecret, (error, user) => {
        if (error) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = user;
        next();
    });
};


export { auth, verifyToken, createAccessToken}