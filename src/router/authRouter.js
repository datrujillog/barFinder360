import express, { response } from "express";

import AuthService from "../service/authService.js";
import { authResponse, errorResponse, Responsee } from "../helper/response.js";

// import { errorResponse, authResponse, Responsee } from "../helpers/response.js";
// import { valitorUserSignup } from "../middleware/express-validator.js";


function authRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const authServ = new AuthService();

    app.use("/api/auth", router);

    router.post("/login", async (req, res) => {
        // const data = req.body;
        const response = await authServ.login(req.body);

        response.success
            ? res.cookie("token", response.token, {
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
                secure: false,
            }) &&
            authResponse(res, 201, true, "loggud", {
                payload: response.result,
                token: response.token,
            })
            : errorResponse(res, response.error);
    });

    router.post("/signup", async (req, res) => {
        const data = req.body;
        // console.log(data)
        const response = await authServ.signup(data);

        response.success
            ? Responsee(res, 201, true, "User created", {
                payload: response.data,
                token: response.token,
            })
            : errorResponse(res, response.error);
    });





        

}

export default authRouter;