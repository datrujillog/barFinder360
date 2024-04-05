
import express, { response } from "express";

import RoleService from "../service/roleService.js";

import { auth } from "../middleware/auth.js";

import { authResponse, errorResponse, Responsee } from "../helper/response.js";
// import { extractDataFromToken } from "../helper/auth.js";
import { BadRequest } from "../middleware/errors.js";

// import { valitorUserSignup } from "../middleware/express-validator.js";

function businessRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const roleServ = new RoleService();


    app.use("/api/v1/role", router);

    router.post("/create", async (req, res) => {
        const businessId = req.headers.businessid;
        const token = req.cookies.token;
        const dataToken = await auth(token)
        try {
            if (dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')
        } catch (error) {
            return errorResponse(res, error.message)

        }
        const response = await roleServ.createRole(req.body, token);
        response.success
            ? Responsee(res, 201, true, "Rol creado correctamente", { user: response.user })
            : errorResponse(res, response.error.message);
    });

    router.post("/plantillas", async (req, res) => {
        const data = req.body;
        let rolesIds = [];

        const response = await roleServ.createPlantillas(data)
        response.success
            ? Responsee(res, 201, true, "Rol actualizado correctamente", { user: response })
            : errorResponse(res, response.error.message);

    });
    //! Revisar este codigo da error al crear el usuario
    router.post("/createRoles", async (req, res) => {
        const businessId = req.headers.businessid;
        const body = req.body;
        const token = req.cookies.token;
        const dataToken = await extractDataFromToken(token)
        // try {
        //     if(dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')            
        // } catch (error) {
        //     return errorResponse(res, error.message)

        // } 
        if (body === null) throw new BadRequest('Error de autenticacion')
        const response = await roleServ.createRoles(body);
        response.success
            ? Responsee(res, 201, true, "Rol creado correctamente", { user: response.user })
            : errorResponse(res, response.error);
    });


}

export default businessRouter;