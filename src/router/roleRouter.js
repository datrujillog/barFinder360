
import express, { response } from "express";

import RoleService from "../service/roleService.js";


import { authResponse, errorResponse, Responsee } from "../helper/response.js";

// import { valitorUserSignup } from "../middleware/express-validator.js";

function businessRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const roleServ = new RoleService();

    app.use("/api/role", router);

    router.post("/create", async (req, res) => {

        const token = req.cookies.token;
        const response = await roleServ.createRole(req.body, token);
        response.success
            ? Responsee(res, 201, true, "Rol creado correctamente", { user: response.user })
            : errorResponse(res, response.error.message);
    });

}  

export default businessRouter;