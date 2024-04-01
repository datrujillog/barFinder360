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

    async orderList(businessId) {
        try {
            const results = await db.collection('bar_orders').aggregate([
                {
                    $match: {
                        businessId: new ObjectId(businessId),
                    },
                },
                {
                    $lookup: {
                        from: "bar_products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "product",
                    },
                },
                {
                    $lookup: {
                        from: "bar_business",
                        localField: "businessId",
                        foreignField: "_id",
                        as: "business",
                    },
                },
            ]).toArray()

            if (results.length === 0) throw new Error('Products not found');

            return {
                success: true,
                Products: results
            };
        } catch (error) {
            return { success: false, error };
        }
    }

}

export default OrderService;