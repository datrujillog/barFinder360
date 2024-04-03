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


    async createUser(businessId, data) {
        const business = await this.businessServ.businessById(businessId);
        if (!business.success) throw new Error('Business not found');

        data.businessId = new ObjectId(businessId);
        data.roleId = new ObjectId(data.roleId);

        const roleExist = await this.roleServ.roleById(businessId, data.roleId.toString());
        if (!roleExist.success) throw new BadRequest(roleExist.error);

        const results = await this.createUsers(data);
        if (!results.success) throw new BadRequest(results.error);
        const { user } = results;
        return {
            success: true,
            user
        };
    }

    async userByOne(businessId, userId) {

        const results = await this.findUserById(businessId, userId);
        if (!results.success) throw new BadRequest(results.error);

        const { user } = results
        return {
            success: true,
            user
        };

    }

    async byEmailUser(data) {
        try {

            const results = await this.findUserByEmail(data);
            if (!results.success) throw new BadRequest(user.error);
            const { user } = results;
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