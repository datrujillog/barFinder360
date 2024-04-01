import { ObjectId } from "bson";

import { BadRequest } from "../middleware/errors.js";

import db from "../database/db.js";
import { parseOrder } from "../helper/normalizeData.js";


class OrderService {
  constructor() {
    console.log('Order Service is created');
  }



  async orderCreate(businessId, body, user) {
    try {

      const productoPedido = body.servidores.flatMap((servidor) => servidor.items.map((item) => item.productId))

      const idsObjeto = productoPedido.map(id => new ObjectId(id));
      const results = await db.collection('bar_products').find({ "_id": { "$in": idsObjeto } }).toArray()
      if (results.length === 0) throw new Error('Products not found');
  
      
      const save = await parseOrder(body, businessId,user,results)
      if (save.error) throw new BadRequest(save.error);


      const response = await db.collection("bar_orders").insertMany([save]);
      if (response.acknowledged === false) throw new BadRequest("Error al insertar el pedido")


      const insertedIds = response.insertedIds
      const insertedData = Object.keys(insertedIds).map(key => ({
        _id: insertedIds[key],
        ...body
      }));

      return {
        success: true,
        order: insertedData
      }











      // const results = await db.collection("bar_orders").insertMany([save]);
      // if (results.acknowledged === false) throw new BadRequest("Error al insertar el pedido")

      // const insertedIds = results.insertedIds
      // const insertedData = Object.keys(insertedIds).map(key => ({
      //   _id: insertedIds[key],
      //   ...body
      // }));

      // return {
      //   success: true,
      //   Order: save
      // }

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
            localField: "userId",
            foreignField: "_id",
            as: "users",
          },
        },
      ]).toArray()

      if (results.length === 0) throw new Error('Products not found');

      return {
        success: true,
        order: results
      };
    } catch (error) {
      return { success: false, error };
    }
  }

}

export default OrderService;