import { ObjectId } from "bson";

import ProductService from "./productService.js";
import TableService from "./tableService.js";

import OrderRepository from "../repositories/restaurantRepository.js";

import { BadRequest } from "../middleware/errors.js";

import db from "../database/db.js";
import { parseOrder, parseOrderUpdate } from "../helper/normalizeData.js";
class OrderService extends OrderRepository {
  constructor() {
    super();




    console.log('Order Service is created');
    this.productServ = new ProductService();
    this.tableServ = new TableService();
  }



  async orderCreate(businessId, body, user) {

    if (body.servidores === undefined) throw new BadRequest('No se encontro la data en el body')

    const productoPedido = body.servidores.flatMap((servidor) => servidor.items.map((item) => item.productId))

    const table = await this.tableServ.tableByOne(businessId, body.tableId)
    if (table.error) throw new BadRequest(table.error);

    const idsObjeto = productoPedido.map(id => new ObjectId(id));
    const results = await this.productServ.orderByIdproduct(businessId, idsObjeto)
    if (results.error) throw new BadRequest(results.error);

    const save = await parseOrder(body, businessId, user, results.Product)
    if (save.error) throw new BadRequest(save.error);

    const response = await this.createOrder(save)
    if (!response.success) throw new BadRequest(response.error)

    return {
      success: true,
      order: response
    }
  }

  async orderList(businessId, userId) {
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

  async orderById(businessId, orderId) {
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

      return {
        success: true,
        order: results
      };
    } catch (error) {
      return { success: false, error };
    }
  }


  async orderUpdate(businessId, orderId, body) {
    try {

      const save = await parseOrderUpdate(body, businessId)
      if (save.error) throw new BadRequest(save.error);

      const results = await db.collection('bar_orders').updateOne(
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
        throw new BadRequest('Products not found');
      }

      return {
        success: true,
        order: results
      };
    } catch (error) {
      // return an error if something went wrong
      return { success: false, error };
    }
  }


















  async orderDelete(businessId, orderId) {
    try {
      const results = await db.collection('bar_orders').deleteOne(
        {
          businessId: new ObjectId(businessId),
          _id: new ObjectId(orderId)
        }
      )

      if (results.deletedCount === 0) throw new BadRequest('Products not found');

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