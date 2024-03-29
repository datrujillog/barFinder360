
import express, { response } from "express";

import BusinessService from "../service/businessService.js";
import UserService from "../service/userService.js";


// import { errorResponse, authResponse, Responsee } from "../helpers/response.js";
// import { valitorUserSignup } from "../middleware/express-validator.js";

function businessRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const businessServ = new BusinessService();
    const userServ = new UserService();

    app.use("/api/user", router);

    router.post("/create", async (req, res) => {
        try {
            const response = await userServ.createUser(req.body);

            response.success
                ? res.status(201).json({ message: "Business created", data: response.business })
                : res.status(400).json({ message: "Business not created", error: response.error });

        } catch (error) {
            res.status(500).send(error);
        }
    });


}

export default businessRouter;