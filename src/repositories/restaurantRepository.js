
import RestaurantModel from "../database/db.js";


class OrderRepository {
    constructor() {
        this.restaurantModel = RestaurantModel;
    }

    async createOrder(data) {
        try {
            const results = await this.restaurantModel.collection("bar_orders").insertMany([data]);
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
}

export default OrderRepository;
