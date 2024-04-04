import express, { response } from "express";

import BusinessService from "../service/businessService.js";

import { auth } from "../middleware/auth.js";
import { BadRequest } from "../middleware/errors.js";

import { errorResponse, authResponse, Responsee } from "../helper/response.js";


function businessRouter(app) {
    const router = express.Router();

    const businessServ = new BusinessService();

    app.use("/api/v1/business", router);


    router.get("/list", async (req, res) => {
        try {

            // const businessId = req.headers.businessId;
            const businessId = req.headers.businessid; 
            const token = req.cookies.token;

            const result = await auth(businessId, token);
            if(!result.success) throw new BadRequest(result.error);

            const response = await businessServ.getBusinesses();
            if (!response.success) throw new BadRequest(response.error.message);

            authResponse(res, 200, true, "Business ok", {
                payload: response,
                token: token,
            });

        } catch (error) {
            errorResponse(res, error.message)
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
            const dataToken = await auth(token)

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