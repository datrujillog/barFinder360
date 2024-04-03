
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

    async orderList(businessId, userId) {
        try {
            const results = await this.orderModel.collection('bar_orders').aggregate([
                {
                    $match: {
                        businessId: new ObjectId(businessId),
                    },
                },
                {
                    $lookup: {
                        from: "bar_products",
                        localField: "servidores.items.productos.productId",
                        foreignField: "_id",
                        as: "products",
                        // as: "servidores.items.productos",
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
                {
                    $lookup: {
                        from: "bar_tables",
                        localField: "tableId",
                        foreignField: "_id",
                        as: "tables",
                    },
                },
                {
                    $lookup: {
                        from: "bar_users",
                        localField: "servidores.userId",
                        foreignField: "_id",
                        as: "users",
                    },
                },
            ]).toArray()

            if (results.length === 0) throw new BadRequest('Products not found');

            return {
                success: true,
                order: results
            };

        } catch (error) {
            return { success: false, error };
        }
    }

    async finfOrderById(businessId, orderId) {

        try {

            const results = await db.collection('bar_orders').aggregate([
                {
                    $match: {
                        businessId: new ObjectId(businessId),
                        _id: new ObjectId(orderId)
                    },
                },
                {
                    $lookup: {
                        from: "bar_products",
                        localField: "servidores.items.productos.productId",
                        foreignField: "_id",
                        as: "products",
                        // as: "servidores.items.productos",
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
                {
                    $lookup: {
                        from: "bar_tables",
                        localField: "tableId",
                        foreignField: "_id",
                        as: "tables",
                    },
                },
                {
                    $lookup: {
                        from: "bar_users",
                        localField: "servidores.userId",
                        foreignField: "_id",
                        as: "users",
                    },
                },
            ]).toArray()

            if (results.length === 0) throw new BadRequest('Products not found');

        } catch (error) {
            return { success: false, error };

        }

    }

    async updateOrderById(businessId, orderId, save) {
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
            if (results.acknowledged === false) throw new BadRequest("Error al actualizar el pedido");

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
