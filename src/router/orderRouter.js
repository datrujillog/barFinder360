
import express, { response } from "express";


import { BadRequest } from "../middleware/errors.js";
import { auth } from "../middleware/auth.js";

import { authResponse, errorResponse, Responsee } from "../helper/response.js";
// import { extractDataFromToken } from "../helper/auth.js";
import OrderService from "../service/orderService.js";



function orderRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const roleServ = new OrderService();

    app.use("/api/v1/order", router);
//! Queda piente para continuar con el servicio de ordenes 
    
    /** @description Devuelve la lista de ordenes de un negocio */
    
    router.post("/create", async (req, res) => {
        const businessId  = req.headers.businessid; 
        const body = req.body;
        const token = req.cookies.token;
        const dataToken = await auth(token)
        try {
            if(dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')            
        } catch (error) {
            return errorResponse(res, error.message)
            
        }
        const response = await roleServ.orderCreate(businessId,body);
        response.success
            ? Responsee(res, 201, true, "Rol creado correctamente", { user: response.user })
            : errorResponse(res, response.error.message);
    });


    router.get("/getAll", async (req, res) => {
        const businessId  = req.headers.businessid; 
        const token = req.cookies.token;
        const dataToken = await extractDataFromToken(token)
        try {
            if(dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')            
        } catch (error) {
            return errorResponse(res, error.message)
            
        }
        const response = await roleServ.getAllOrders(req.body, token);
        response.success
            ? Responsee(res, 201, true, "Rol creado correctamente", { user: response.user })
            : errorResponse(res, response.error.message);
    });

    router.get("/getById", async (req, res) => {
        const businessId  = req.headers.businessid; 
        const token = req.cookies.token;
        const dataToken = await extractDataFromToken(token)
        try {
            if(dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')            
        } catch (error) {
            return errorResponse(res, error.message)
            
        }
        const response = await roleServ.getOrderById(req.body, token);
        response.success
            ? Responsee(res, 201, true, "Rol creado correctamente", { user: response.user })
            : errorResponse(res, response.error.message);
    });

    router.put("/update", async (req, res) => {
        const businessId  = req.headers.businessid; 
        const token = req.cookies.token;
        const dataToken = await extractDataFromToken(token)
        try {
            if(dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')            
        } catch (error) {
            return errorResponse(res, error.message)
            
        }
        const response = await roleServ.updateOrder(req.body, token);
        response.success
            ? Responsee(res, 201, true, "Rol creado correctamente", { user: response.user })
            : errorResponse(res, response.error.message);
    });

    router.delete("/delete", async (req, res) => {
        const businessId  = req.headers.businessid; 
        const token = req.cookies.token;
        const dataToken = await extractDataFromToken(token)
        try {
            if(dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')            
        } catch (error) {
            return errorResponse(res, error.message)
            
        }
        const response = await roleServ.deleteOrder(req.body, token);
        response.success
            ? Responsee(res, 201, true, "Rol creado correctamente", { user: response.user })
            : errorResponse(res, response.error.message);
    });

}

export default orderRouter;