import { ObjectId } from "bson";

import { BadRequest } from "../middleware/errors.js";

import db from "../database/db.js";
import { parseOrder } from "../helper/normalizeData.js";


class OrderService {
    constructor() {
        console.log('Order Service is created');
    }



    async orderCreate(businessId, body,user) {
        try {
            const save = await parseOrder(body, businessId,user)
            if (save.error) throw new BadRequest(save.error);


            const results = await db.collection("bar_orders").insertMany([save]);
            if (results.acknowledged === false) throw new BadRequest("Error al insertar el pedido")

            const insertedIds = results.insertedIds
            const insertedData = Object.keys(insertedIds).map(key => ({
                _id: insertedIds[key],
                ...body
            }));

            return {
                success: true,
                Order: insertedData
            }

        } catch (error) {
            return {
                success: false,
                error: error
            }
        }
    }
}

export default OrderService;