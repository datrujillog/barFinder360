
import { ObjectId } from 'mongodb';
import { BadRequest } from "../middleware/errors.js";
import OrderModel from "../database/db.js";



class OrderRepository {
    constructor() {
        this.orderModel = OrderModel;
    }

    async createOrder(data) {
        try {
            const results = await this.orderModel.collection("bar_orders").insertMany([data]);
            if (results.acknowledged === false) throw new BadRequest("Error al insertar el pedido");

            const insertedIds = results.insertedIds;
            const insertedData = Object.keys(insertedIds).map(key => ({
                _id: insertedIds[key],
                ...data
            }));

            return {
                success: true,
                order: insertedData
            }
        } catch (error) {
            return { success: false, error };
        }
    }

    async orderUpdate(businessId, orderId,save) {
        try {
            const results = await this.orderModel.collection('bar_orders').updateOne(
                {
                    businessId: new ObjectId(businessId),
                    _id: new ObjectId(orderId)
                },
                {
                    $set: {
                        ...save
                    }
                }
            )

            if (results.modifiedCount === 0) {
                throw new BadRequest('No Ordenes para actualizar');
            }
            if(results.acknowledged === false) throw new BadRequest("Error al actualizar el pedido");

            return {
                success: true,
                order: results
            };
        } catch (error) {
            return { success: false, error };
        }
    }
}

export default OrderRepository;
