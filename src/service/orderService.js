import { ObjectId } from "bson";

import ProductService from "./productService.js";
import TableService from "./tableService.js";

import OrderRepository from "../repositories/orderRepository.js";

import { BadRequest } from "../middleware/errors.js";

import db from "../database/db.js";
import { parseOrder, parseOrderUpdate } from "../helper/normalizeData.js";
class OrderService extends OrderRepository {
  constructor() {
    super();
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

    const response = await this.createOrders(save)
    if (!response.success) throw new BadRequest(response.error)

    return {
      success: true,
      order: response
    }
  }

  async getListOrder(businessId, userId) {

    const results = await this.listOrders(businessId, userId)
    if (!results.success) throw new BadRequest(results.error);

    return {
      success: true,
      order: results
    };

  }

  async getOrderById(businessId, orderId) {
    try {
      const results = await this.finfOrderById(businessId, orderId)

      return {
        success: true,
        order: results
      };
    } catch (error) {
      return { success: false, error };
    }
  }

  async orderByUpdate(businessId, orderId, body) {
    try {

      const save = await parseOrderUpdate(body, businessId)
      if (save.error) throw new BadRequest(save.error);

      const response = await this.updateOrderById(businessId, orderId, save)
      if (!response.success) throw new BadRequest(response.error)

      return {
        success: true,
        order: response
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