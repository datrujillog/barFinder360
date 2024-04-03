import express, { response } from "express";

import AuthService from "../service/authService.js";
import { authResponse, errorResponse, Responsee } from "../helper/response.js";

// import { errorResponse, authResponse, Responsee } from "../helpers/response.js";
// import { valitorUserSignup } from "../middleware/express-validator.js";


function authRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const authServ = new AuthService();

    app.use("/api/v1/auth", router);

    router.post("/login", async (req, res) => {

        try {

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
        } catch (error) {
            errorResponse(res, error.message);
        }
    });

    router.post("/signup", async (req, res) => {

        try {

            const body = req.body;
            const response = await authServ.signup(body);
            if (!response.success) throw new BadRequest(response.error.message);

            const { data,token } = response;
            Responsee(res, 200, true, "Business create ", {
                payload: data,
                token,
            });

        } catch (error) {
            errorResponse(res, error.message);
        }
    });







}

export default authRouter;