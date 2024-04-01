
import express, { response } from "express";

import ProductService from "../service/productService.js";

import { BadRequest } from "../middleware/errors.js";
import { auth } from "../middleware/auth.js";

import { authResponse, errorResponse, Responsee } from "../helper/response.js";




function productRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const productServ = new ProductService();

    app.use("/api/v1/product", router);

    router.post("/create", async (req, res, next) => {
        try {
            const businessId = req.headers.businessid;
            const body = req.body;
            const token = req.cookies.token;
            const result = await auth(businessId, token);
            if(!result.success) throw new BadRequest(result.error.message);
            
            const response = await productServ.productCreate(businessId, body)
            response.success
                ? authResponse(res, 201, true, "User created", {
                    payload: response,
                    token: token,
                })
                : errorResponse(res, response.error);

        } catch (error) {
            errorResponse(res, error.message);
        }
    });


}

export default productRouter;