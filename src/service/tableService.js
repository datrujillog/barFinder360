import { ObjectId } from 'mongodb';

import RoleService from "./roleService.js";
import BusinessService from "./businessService.js";

import { BadRequest } from "../middleware/errors.js";

import db from "../database/db.js";
import { extractDataFromToken } from "../helper/auth.js";

class TableService {
    constructor() {
        console.log('TableService constructor');
        this.businessServ = new BusinessService();
        this.roleServ = new RoleService();
    }

    async createTable(data, businessId) {
        try {
            const business = await this.businessServ.businessById(businessId);
            if (!business.success) throw new Error('Business not found');

            data.businessId = new ObjectId(businessId);
            const table = await db.collection('bar_tables').insertMany([data]);

            const insertedIds = table.insertedIds;
            const insertedData = Object.keys(insertedIds).map(key => ({
                _id: insertedIds[key],
                ...data
            }));

            return {
                success: true,
                data: insertedData
            };

        } catch (error) {
            return { success: false, error };
        }
    }


    async listTables(businessId) {
        try {
            const business = await this.businessServ.businessById(businessId);
            if (!business.success) throw new Error('Business not found');

            const tables = await db.collection('bar_tables').find({ businessId: new ObjectId(businessId) }).toArray();

            return {
                success: true,
                data: tables
            };

        } catch (error) {
            return { success: false, error };
        }
    }

    async tableByOne(businessId, tableId) {
        try {

            await this.businessServ.businessById(businessId);
            if(!businessId) throw new BadRequest('Business not found');

            
            const table = await db.collection('bar_tables').aggregate([
                {
                    $match: {
                        _id: new ObjectId(tableId),
                        businessId: new ObjectId(businessId)
                    }
                },
                {
                    $lookup: {
                        from: 'bar_business',
                        localField: 'businessId',
                        foreignField: '_id',
                        as: 'business'
                    }
                },
                { $unwind: '$business' }
            ]).toArray();

            if (table.length === 0) {
                throw new BadRequest('Table not found');
            }
            delete table[0].business.password;

            return {
                success: true,
                data: table
            };

        } catch (error) {
            return { success: false, error };
        }
    };
}


export default TableService;