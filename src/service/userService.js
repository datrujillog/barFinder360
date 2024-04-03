import { ObjectId } from 'mongodb';

import RoleService from "./roleService.js";
import BusinessService from "./businessService.js";

import UserRepository from '../repositories/userRepository.js';

import { BadRequest } from "../middleware/errors.js";

import db from "../database/db.js";
class UserService extends UserRepository {
    constructor() {
        super();

        this.businessServ = new BusinessService();
        this.roleServ = new RoleService();
    }


    async createUser(businessId,data) {
        try {
            const business = await this.businessServ.businessById(businessId);
            if (!business.success) throw new Error('Business not found');

            data.businessId = new ObjectId(businessId);
            data.roleId = new ObjectId(data.roleId);

            const roleExist = await this.roleServ.roleById(businessId, data.roleId.toString());
            if (!roleExist.success) throw new BadRequest(roleExist.error);

            const results = await this.createUsers(data);
            if(!results.success) throw new BadRequest(results.error);
            const { user } = results;
            return {
                success: true,
                user
            };
        } catch (error) {
            return { success: false, error };
        }


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