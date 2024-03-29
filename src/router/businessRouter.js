import express, { response } from "express";

import BusinessService from "../service/businessService.js";

// import { errorResponse, authResponse, Responsee } from "../helpers/response.js";
// import { valitorUserSignup } from "../middleware/express-validator.js";

function businessRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const businessServ = new BusinessService();

    app.use("/api/business", router);

    router.get("/", async (req, res) => {
        try {
            // const data = req.body;
            const response = await businessServ.getBusinesses();
            response.success ? res.status(201).json({response}) : res.status(400).json({error:response.error.message});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

}
export default businessRouter;