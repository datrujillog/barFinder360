
import express, { query, response } from "express";

import BusinessService from "../service/businessService.js";
import UserService from "../service/userService.js";


import { authResponse, errorResponse, Responsee } from "../helper/response.js";
import { BadRequest, NotFound } from "../middleware/errors.js";
import { extractDataFromToken } from "../helper/auth.js";

// import { valitorUserSignup } from "../middleware/express-validator.js";

function businessRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const businessServ = new BusinessService();
    const userServ = new UserService();

    app.use("/api/user", router);
    
    //! validar si si el usuario que cea el usuario tine permisos para crearlo
    router.post("/create", async (req, res) => {
        // estoy enviado en postman el businessId por el headers 
        const businessId  = req.headers.businessid; 
        const token = req.cookies.token;
        const dataToken = await extractDataFromToken(token)
        try {
            if(dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')            
        } catch (error) {
            return errorResponse(res, error.message)
            
        }

        const response = await userServ.createUser(req.body, token);
        response.success
            ? Responsee(res, 201, true, "Usuario creado correctamente", { user: response.user })
            : errorResponse(res, response.error.message);
    });


}

export default businessRouter;