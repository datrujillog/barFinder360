
import express, { response } from "express";

import BusinessService from "../service/businessService.js";
import TableService from "../service/tableService.js";

import { BadRequest } from "../middleware/errors.js"; 
import { auth } from "../middleware/auth.js";

import { errorResponse, authResponse, Responsee } from "../helper/response.js";
// import { extractDataFromToken } from "../helper/auth.js";


function TableRouter(app) {
    const router = express.Router();

    //instanciar el servicio
    const businessServ = new BusinessService();
    const tableServ = new TableService();

    app.use("/api/v1/table", router);

    router.post("/create", async (req, res) => {
        try {
            const data = req.body;
            const businessId = req.headers.businessid;
            const token = req.cookies.token;

            const dataToken = await auth(token)

            if (dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')

            const response = await tableServ.createTable(data, businessId);

            response.success
                ? authResponse(res, 201, true, "User created", {
                    payload: response.data,
                    token: token,
                })
                : errorResponse(res, response.error);
        } catch (error) {
            errorResponse(res, error.message)
        }
    });

    router.get("/list", async (req, res) => {
        try {
            const businessId = req.headers.businessid;
            const token = req.cookies.token;
            const dataToken = await extractDataFromToken(token)

            if (dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')

            const response = await tableServ.listTables(businessId);

            response.success
                ? authResponse(res, 200, true, "List of tables", {
                    payload: response.data,
                    token: token,
                })
                : errorResponse(res, response.error);
        } catch (error) {
            errorResponse(res, error.message)
        }
    });

    router.get("/One/:id", async (req, res) => {
        try {
            const businessId = req.headers.businessid;
            const tableId = req.params.id;
            const token = req.cookies.token;
            const dataToken = await extractDataFromToken(token)

            if (dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')

            const response = await tableServ.tableByOne(businessId, tableId);

            response.success
                ? authResponse(res, 200, true, "List of tables", {
                    payload: response.data,
                    token: token,
                })
                : errorResponse(res, response.error);
        } catch (error) {
            errorResponse(res, error.message)
        }
    });

    router.put("/update/:id", async (req, res) => {
        try {
            const data = req.body;
            const businessId = req.headers.businessid;
            const tableId = req.params.id;
            const token = req.cookies.token;
            const dataToken = await extractDataFromToken(token)

            if (dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')

            const response = await tableServ.updateTable(businessId, tableId, data);

            response.success
                ? authResponse(res, 200, true, "Table updated", {
                    payload: response.data,
                    token: token,
                })
                : errorResponse(res, response.error);
        } catch (error) {
            errorResponse(res, error.message)
        }
    });

    router.delete("/delete/:id", async (req, res) => {
        try {
            const businessId = req.headers.businessid;
            const tableId = req.params.id;
            const token = req.cookies.token;
            const dataToken = await extractDataFromToken(token)

            if (dataToken.businessId !== businessId) throw new BadRequest('Error de autenticacion')

            const response = await tableServ.deleteTable(businessId, tableId);

            response.success
                ? authResponse(res, 200, true, "Table deleted", {
                    payload: response.data,
                    token: token,
                })
                : errorResponse(res, response.error);
        } catch (error) {
            errorResponse(res, error.message)
        }
    });
}

export default TableRouter;