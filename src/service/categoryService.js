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
                category: insertedData

            };
        } catch (error) {
            return { success: false, error };
        }
    }

    async categoryList(businessId) {
        try {
            const query = {
                businessId: new ObjectId(businessId)
            }
            const results = await db.collection('bar_categories').find(query).toArray();


            console.log(results)

            if (results.length === 0 || results == undefined) throw new Error('Category not found');


            return {
                success: true,
                category: results
            };
        } catch (error) {
            return { success: false, error };
        }
    }


    async categoryListById(businessId, categoryId) {
        try {
            
            const results = await db.collection('bar_categories').aggregate([
                {
                    $match: {
                        _id: new ObjectId(categoryId),
                        businessId: new ObjectId(businessId)                    
                    }
                },
                {
                    $lookup: {
                        from: "bar_business",
                        localField: "businessId",
                        foreignField: "_id",
                        as: "business"
                      }
                },
                // { $unwind: '$business' }

            ]).toArray();
            if (results.length === 0 ) throw new Error('Category not found');

            return {
                success: true,
                category: results
            };
        } catch (error) {
            return { success: false, error };
        }
    }

    async categoryUpdate(businessId, categoryId, body) {
        try {
            const query = {
                _id: new ObjectId(categoryId),
                businessId: new ObjectId(businessId)
            }

            const update = {
                $set: {
                    name: body.name,
                    description: body.description,
                    asset: body.asset,
                    updatedAt: new Date()
                }
            }

            const results = await db.collection('bar_categories').updateOne(query, update);
            if (results.modifiedCount === 0) throw new Error('Category not updated');

            return {
                success: true,
                category: results
            };
        } catch (error) {
            return { success: false, error };
        }
    }


}

export default CategoryService;