import { ObjectId } from "bson";

import { BadRequest } from "../middleware/errors.js";

import db from "../database/db.js";


class OrderService {
    constructor() {
        console.log('Order Service is created');
    }

    //! Queda piente para continuar con el servicio de ordenes 
    
    /** @description Devuelve la lista de ordenes de un negocio */

    

    async orderCreate(businessId,body) {
        try { 

            const order = {
                businessId: ObjectId(businessId),
                ...body
            }
            const response = await db.collection('order').insertOne(order);
            return { success: true, order: response.ops[0] }

        } catch (error) {
            return { success: false, error }
        }



    }
}

export default OrderService;