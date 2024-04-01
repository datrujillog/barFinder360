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
      // const save = await parseOrder(body, businessId,user)
      // if (save.error) throw new BadRequest(save.error);

      const productoPedido = body.servidores.flatMap((servidor) => servidor.items.map((item) => item.productId))

      const idsObjeto = productoPedido.map(id => new ObjectId(id));
      const results = await db.collection('bar_products').find({ "_id": { "$in": idsObjeto } }).toArray()
      if (results.length === 0) throw new Error('Products not found');


      // Mapea los resultados para incluir nombre y precio de cada producto
      const productos = results.map(producto => {
        const item = body.servidores.find(servidor => servidor.items.find(item => item.productId == producto._id.toString()))
        console.log(item)
        const itemProducto = item.items.find(item => item.productId == producto._id.toString())
        return {
          mesero: user,
          items: {
            productos: {
              name: producto.name,
              salePrice: producto.salePrice,
            },
            cantidad: itemProducto.cantidad,
            total: itemProducto.cantidad * producto.salePrice,
            // total: itemProducto.total,
            user: user,
            fecha: new Date()

          },
        }
      })

      const items = {
        name: body.servidores.name,
      }

      const save = {
        businessId: new ObjectId(businessId),
        userId: new ObjectId(user._id),
        tableId: new ObjectId(body.tableId),
        status: 'PENDING',
        total: productos.reduce((acc, item) => acc + item.salePrice, 0),
        servidores: productos,
      }

      console.log(save)

      // const save = {

      //   // businessId: new ObjectId(businessId),
      //   // userId: new ObjectId(user._id),
      //   // tableId: new ObjectId(body.tableId),
      //   // status: 'PENDING',
      //   // total: productos.reduce((acc, item) => acc + item.salePrice, 0),
      //   // servidores: productos,
      //   items: body.servidores.map(servidor => ({
      //     name: servidor.name,
      //     items: servidor.items.map(item => ({
      //       // product: new ObjectId(item.productId),
      //       product: productos,
      //       cantidad: item.cantidad,
      //       total: item.total,
      //       fecha: new Date()
      //     }))
      //   })),
      // }


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