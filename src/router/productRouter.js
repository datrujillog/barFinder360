
import express, { response } from "express";


import { BadRequest } from "../middleware/errors.js";
import { auth } from "../middleware/auth.js";

import { authResponse, errorResponse, Responsee } from "../helper/response.js";
import OrderService from "../service/orderService.js";


function productRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const roleServ = new OrderService();

    app.use("/api/v1/product", router);

    router.post("/create", async (req, res, next) => {
        try {
            const businessId = req.headers.businessid;
            const body = req.body;
            const token = req.cookies.token;
            const result = await validateBusiness(businessId, token);
            if(!result.success) throw new BadRequest(result.error.message);
            
            const { success, category } = await roleServ.productCreate(businessId, body);
            success
                ? authResponse(res, 201, true, "User created", {
                    payload: category,
                    token: token,
                })
                : errorResponse(res, response.error);

        } catch (error) {
            errorResponse(res, error.message);
        }
    });


}

export default productRouter;