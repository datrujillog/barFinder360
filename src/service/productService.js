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
            if(!save.success) throw new BadRequest(save.error);

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

    
}

export default ProductService;