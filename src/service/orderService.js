import { ObjectId } from "bson";

import ProductService from "./productService.js";
import TableService from "./tableService.js";

import { BadRequest } from "../middleware/errors.js";

import db from "../database/db.js";
import { parseOrder } from "../helper/normalizeData.js";

class OrderService {
  constructor() {
    console.log('Order Service is created');
    this.productServ = new ProductService();
    this.tableServ = new TableService();
  }



  async orderCreate(businessId, body, user) {
    try {

      const productoPedido = body.servidores.flatMap((servidor) => servidor.items.map((item) => item.productId))

      //  validar si la mesa existe en la base de datos
      const table = await this.tableServ.tableByOne(businessId, body.tableId)
      if (table.error) throw new BadRequest(table.error);

      // validar si los productos existen en la base de datos
      const idsObjeto = productoPedido.map(id => new ObjectId(id));
      const results = await this.productServ.orderByIdproduct(businessId, idsObjeto)
      if (results.error) throw new BadRequest(results.error);

      // parsear los datos para guardar en la base de datos
      const save = await parseOrder(body, businessId, user, results.Product)
      if (save.error) throw new BadRequest(save.error);

      // guarda la orders en la base de datos 
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

      if (results.length === 0) throw new BadRequest('Products not found');

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