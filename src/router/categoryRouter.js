
import express, { response } from "express";

import CategoryService from "../service/categoryService.js";
import OrderService from "../service/orderService.js";

import { BadRequest } from "../middleware/errors.js";
import { auth, verifyToken } from "../middleware/auth.js";

import { authResponse, errorResponse, Responsee } from "../helper/response.js";


function categoryRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const categoryServ = new CategoryService();

    app.use("/api/v1/category", router);
    // router.post["get"], "/create", async (req, res, next) => {4

    router.post("/create", async (req, res) => {
        const businessId = req.headers.businessid;
        const body = req.body;
        const token = req.cookies.token;
        const dataToken = await auth(token)
        try {
            if (dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')
        } catch (error) {
            return errorResponse(res, error.message)

        }
        const { success, category } = await categoryServ.categoryCreate(businessId, body);
        success
            ? authResponse(res, 201, true, "User created", {
                payload: category,
                token: token,
            })
            : errorResponse(res, response.error);
    });





}

export default categoryRouter;