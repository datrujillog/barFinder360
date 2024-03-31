import express, { response } from "express";

import BusinessService from "../service/businessService.js";

import { errorResponse, authResponse, Responsee } from "../helper/response.js";
import { extractDataFromToken } from "../helper/auth.js";
import { BadRequest } from "../middleware/errors.js";
// import { valitorUserSignup } from "../middleware/express-validator.js";

function businessRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const businessServ = new BusinessService();

    app.use("/api/v1/business", router);

    router.get("/", async (req, res) => {
        try {
            // const data = req.body;
            const response = await businessServ.getBusinesses();
            response.success ? res.status(201).json({ response }) : res.status(400).json({ error: response.error.message });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    router.get("/one/:id", async (req, res) => {
        try {
            const businessId = req.params.id;
            const response = await businessServ.businessById(businessId);

            if (response.success) {
                res.json({
                    ok: true,
                    business: response.business
                });

            }



        } catch (error) {
            // res.status(400).json({ message: error.message });
            errorResponse(res, error.message)
        }
    });

    //listar todosd los usuarios que pertenescan a un negocio
    router.get("/users/:id", async (req, res) => {
        try {
            const businessId = req.headers.businessid;
            const idBusiness = req.params.id;
            const token = req.cookies.token;
            const dataToken = await extractDataFromToken(token)

            if (dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')

            const response = await businessServ.usersByBusiness(businessId, idBusiness);

            if (response.success) {
                res.json({
                    ok: true,
                    users: response.users
                });

            }
        } catch (error) {
            errorResponse(res, error.message)
        }
    });

}
export default businessRouter;