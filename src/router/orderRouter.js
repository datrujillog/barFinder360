
import express, { response } from "express";


import { BadRequest } from "../middleware/errors.js";
import { auth } from "../middleware/auth.js";

import { authResponse, errorResponse, Responsee } from "../helper/response.js";
// import { extractDataFromToken } from "../helper/auth.js";
import OrderService from "../service/orderService.js";



function orderRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const orderServ = new OrderService();

    app.use("/api/v1/order", router);

    
    router.post("/create", async (req, res, next) => {
        try {
            const businessId = req.headers.businessid;
            const body = req.body;
            const token = req.cookies.token;
            const result = await auth(businessId, token); 
            if(!result.success) throw new BadRequest(result.error.message);
            const user = result.data.id
            
            const response = await orderServ.orderCreate(businessId, body,user)

            if(!response.success) throw new BadRequest(response.error.message);
            authResponse(res, 201, true, "Order created", {
                payload: response,
                token: token,
            });

        } catch (error) {
            errorResponse(res, error.message);
        }
    });

    router.get("/list", async (req, res, next) => {
        try {
            const businessId = req.headers.businessid;
            const token = req.cookies.token;
            const result = await auth(businessId, token); 
            if(!result.success) throw new BadRequest(result.error.message);
            const userId = result.data.id
            
            const response = await orderServ.orderList(businessId,userId)

            if(!response.success) throw new BadRequest(response.error.message);
            authResponse(res, 200, true, "Order ok", {
                payload: response,
                token: token,
            });

        } catch (error) {
            errorResponse(res, error.message);
        }
    });

    router.get("/list/:id", async (req, res, next) => {
        try {
            const businessId = req.headers.businessid;
            const productId = req.params.id;
            const token = req.cookies.token;
            const result = await auth(businessId, token);
            if(!result.success) throw new BadRequest(result.error.message);
            
            const response = await orderServ.orderById(businessId,productId)

            if(!response.success) throw new BadRequest(response.error.message);
            authResponse(res, 200, true, "Order ok", {
                payload: response,
                token: token,
            });

        } catch (error) {
            errorResponse(res, error.message);
        }
    });

    router.put("/update/:id", async (req, res, next) => {
        try {
            const businessId = req.headers.businessid;
            const productId = req.params.id;
            const body = req.body;
            const token = req.cookies.token;
            const result = await auth(businessId, token);
            if(!result.success) throw new BadRequest(result.error.message);
            
            const response = await productServ.productUpdate(businessId,productId,body)
            response.success
                ? authResponse(res, 200, true, "User created", {
                    payload: response,
                    token: token,
                })
                : errorResponse(res, response.error);

        } catch (error) {
            errorResponse(res, error.message);
        }
    });

    router.delete("/delete/:id", async (req, res, next) => {
        try {
            const businessId = req.headers.businessid;
            const productId = req.params.id;
            const token = req.cookies.token;
            const result = await auth(businessId, token);
            if(!result.success) throw new BadRequest(result.error.message);
            
            const response = await productServ.productDelete(businessId,productId)
            response.success
                ? authResponse(res, 200, true, "User created", {
                    payload: response,
                    token: token,
                })
                : errorResponse(res, response.error);

        } catch (error) {
            errorResponse(res, error.message);
        }
    });

}

export default orderRouter;