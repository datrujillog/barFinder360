import log4js from 'log4js'

import UserService from "./userService.js";
import RoleService from "./roleService.js";
import BusinessService from "./businessService.js";

import { BadRequest } from "../middleware/errors.js";

import db from "../database/db.js";

import { encryptPassword, comparePassword } from "../helper/encrypt.js";
import { createToken } from "../helper/createToken.js";

import businnessRepository from '../repositories/businessRepository.js';
import UserRepository from '../repositories/userRepository.js';

import { parserUserAuth } from '../helper/normalizeData.js';

const log = log4js.getLogger(`${process.env.NODE_ENV} - normalizeData`);


class AuthService extends businnessRepository {
    constructor() {
        super();

        this.BusinessServ = new BusinessService();
        this.UserServ = new UserService();
        this.roleServ = new RoleService();
        this.businessServ = new BusinessService();

    }

    async login(data) {

        try {


            const users = await this.UserServ.byEmailUser(data.email);
            if (!users.success) throw new BadRequest(users.error);

            const { user } = users;
            const isMatch = await comparePassword(data.password, user[0].password);
            if (!isMatch) {
                throw new BadRequest('Invalid password');
            }
            const token = await createToken(user[0]);
            if (!token.success) throw new BadRequest(token.error);

            const result = user[0];
            return {
                success: true,
                result,
                token
            };

        } catch (error) {
            return { success: false, error: error };
        }
    }

    async signup(data) {

            if (data.password) {
                data.password = await encryptPassword(data.password);
            }

            const response = await this.createBusiness(data);
            if (!response.success) throw new BadRequest(response.error);

            const { business } = response;

            const save = await parserUserAuth(data, business[0]._id)
            if (!save.success) throw new BadRequest(save.error);

            const { user } = save
            
            const results = await this.UserServ.createUsers(user);
            if(!results.success) throw new BadRequest(results.error);
               
            const token = await createToken(business[0]);
            delete business[0].password;
            
            return {
                success: true,
                data: business,
                token
            };
        
    }
}

export default AuthService;