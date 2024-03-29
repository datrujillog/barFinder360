
import express, { response } from "express";

import BusinessService from "../service/businessService.js";
import UserService from "../service/userService.js";


import { authResponse, errorResponse, Responsee } from "../helper/response.js";

// import { valitorUserSignup } from "../middleware/express-validator.js";

function businessRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const businessServ = new BusinessService();
    const userServ = new UserService();

    app.use("/api/user", router);

    router.post("/create", async (req, res) => {

        const token = req.cookies.token;

        const response = await userServ.createUser(req.body, token);
        response.success
            ? Responsee(res, 201, true, "Usuario creado correctamente", { user: response.user })
            : errorResponse(res, response.error.message);
    });


}

export default businessRouter;