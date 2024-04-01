import { ObjectId } from "bson";

import { BadRequest } from "../middleware/errors.js";

import db from "../database/db.js";
import { parseProduct } from "../helper/normalizeData.js";

class ProductService {
    constructor() {
        console.log('Producto Service is created');
    }

    async productCreate(businessId, product) {
        try {  
            const save = await parseProduct(product,businessId)
            if(save.error) throw new BadRequest(save.error);

            const results = await db.collection('bar_products').insertMany([save]);
            if (results.insertedCount === 0) throw new Error('Category not created');

            const insertedIds =  results.insertedIds
            const insertedData = Object.keys(insertedIds).map(key => ({
                _id: insertedIds[key],
                ...product
            }));

            return {
                success: true,
                Product: insertedData

            };
        } catch (error) {
            return { success: false, error };
        }
    }

    async productList(businessId) {
        try {
            const results = await db.collection('bar_products').find({ businessId: new ObjectId(businessId) }).toArray();
            if (results.length === 0) throw new Error('Products not found');

            return {
                success: true,
                Products: results
            };
        } catch (error) {
            return { success: false, error };
        }
    }

    async productById(businessId, productId) {
        try {
            const results = await db.collection('bar_products').findOne({ _id: new ObjectId(productId), businessId: new ObjectId(businessId) });
            if (!results) throw new Error('Product not found');

            return {
                success: true,
                Product: results
            };
        } catch (error) {
            return { success: false, error };
        }
    }

    async productUpdate(businessId, productId, product) {
        try {
            const save = await parseProduct(product,businessId)
            if(save.error) throw new BadRequest(save.error);

            const results = await db.collection('bar_products').updateOne({ _id: new ObjectId(productId), businessId: new ObjectId(businessId) }, { $set: save });
            if (results.modifiedCount === 0) throw new Error('Product not updated');

            return {
                success: true,
                Product: save
            };
        } catch (error) {
            return { success: false, error };
        }
    }

    async productDelete(businessId, productId) {
        try {
            const results = await db.collection('bar_products').deleteOne({ _id: new ObjectId(productId), businessId: new ObjectId(businessId) });
            if (results.deletedCount === 0) throw new Error('Product not deleted');

            return {
                success: true
            };
        } catch (error) {
            return { success: false, error };
        }
    }

    
}

export default ProductService;