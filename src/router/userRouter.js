
import express, { query, response } from "express";

import BusinessService from "../service/businessService.js";
import UserService from "../service/userService.js";


import { authResponse, errorResponse, Responsee } from "../helper/response.js";
import { BadRequest, NotFound } from "../middleware/errors.js";
// import { extractDataFromToken } from "../helper/auth.js";
import { auth } from "../middleware/auth.js";

// import { valitorUserSignup } from "../middleware/express-validator.js";

function businessRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const businessServ = new BusinessService();
    const userServ = new UserService();

    app.use("/api/v1/users", router);

    //! validar si si el usuario que cea el usuario tine permisos para crearlo
    router.post("/create", async (req, res) => {

        try {
            const businessId = req.headers.businessid;
            const body = req.body;
            const token = req.cookies.token;
            const result = await auth(businessId, token)
            if (!result.success) throw new BadRequest(result.error.message);

            const response = await userServ.createUser(businessId, body);
            if (!response.success) throw new BadRequest(response.error.message); 

            const { user } = response;
            authResponse(res, 201, true, "User created", {
                payload: user,
                token: token,
            });

        } catch (error) {
            errorResponse(res, error.message);
        }

    });

    router.get("/one/:id", async (req, res) => {
        const businessId = req.headers.businessid;
        const userId = req.params.id;
        const token = req.cookies.token;
        const dataToken = await extractDataFromToken(token)
        const response = await userServ.userByOne(businessId, userId);
        response.success
            ? Responsee(res, 200, true, "Usuario encontrado", { user: response.user })
            : errorResponse(res, response.error.message);
    });

}

export default businessRouter;