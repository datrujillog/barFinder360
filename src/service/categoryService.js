import { ObjectId } from "bson";

import { BadRequest } from "../middleware/errors.js";

import db from "../database/db.js";

class CategoryService {
    constructor() {
        console.log('Category Service is created');
    }

    async categoryCreate(businessId, body) {
        try {
            const category = {
                businessId: new ObjectId(businessId),
                name: body.name,
                description: body.description,
                asset: body.asset,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            console.log(category)

            const table = await db.collection('bar_categories').insertMany([category]);
            if (table.insertedCount === 0) throw new Error('Category not created');

            console.log(table)

            const insertedIds = table.insertedIds;
            const insertedData = Object.keys(insertedIds).map(key => ({
                _id: insertedIds[key],
                ...category
            }));

            return {
                success: true,
                category:insertedData
                
            };
        } catch (error) {
            return { success: false, error };
        }
    }


}

export default CategoryService;