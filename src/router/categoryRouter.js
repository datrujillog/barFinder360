
import express, { response } from "express";


import { BadRequest } from "../middleware/errors.js";

import { authResponse, errorResponse, Responsee } from "../helper/response.js";
import { extractDataFromToken } from "../helper/auth.js";
import OrderService from "../service/orderService.js";



function categoryRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const roleServ = new OrderService();

    app.use("/api/v1/category", router);


    


}

export default categoryRouter;