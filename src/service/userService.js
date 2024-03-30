// import { ObjectId } from "bson";
import { ObjectId } from 'mongodb';



import db from "../database/db.js";
import { extractDataFromToken } from "../helper/auth.js";
import { BadRequest } from "../middleware/errors.js";
import BusinessService from "./businessService.js";
import RoleService from "./roleService.js";


class UserService {
    constructor() {
        console.log("userService constructor");
        this.businessServ = new BusinessService();
        this.roleServ = new RoleService();
    }

    async byEmailUser(data) {
        try {
            const user = await db.collection('bar_users').find({ email: data }).toArray();

            if (user.length === 0) {
                throw new BadRequest('El Email no existe');

            }

            return {
                success: true,
                user
            };

        } catch (error) {
            return { success: false, error };

        }
    }


    async createUser(data, token) {
        try {
            const dataToken = extractDataFromToken(token);
            const business = await this.businessServ.businessById(dataToken.businessId);
            if (!business.success) throw new Error('Business not found');

            const role = await this.roleServ.roleById(dataToken.rol);
            if (!role.success) throw new BadRequest(role.error);

            data.businessId = new ObjectId(dataToken.businessId);
            data.roleId = new ObjectId(data.roleId);
            const roleExist = await this.roleServ.roleById(data.roleId);
            if (!roleExist.success) throw new BadRequest(roleExist.error);

            const user = await db.collection('bar_users').insertMany([data]);
            const insertedIds = user.insertedIds;
            const insertedData = Object.keys(insertedIds).map(key => ({
                _id: insertedIds[key],
                ...data
            }));

            return {
                success: true,
                user: insertedData
            };
        } catch (error) {
            return { success: false, error };
        }


    }


    async userByOne(businessId, userId) {
        try {
            const user = await db.collection('bar_users').aggregate([
                {
                    $match: {
                        _id: new ObjectId(userId),
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
                {
                    $lookup: {
                        from: 'bar_rol',
                        localField: 'roleId',
                        foreignField: '_id',
                        as: 'role'
                    }
                }
            ]).toArray();
            
            if (user.length === 0) throw new BadRequest('El usuario no existe');
            return {
                success: true,
                user
            };
        } catch (error) {
            return { success: false, error };
        }
    }

}

export default UserService;