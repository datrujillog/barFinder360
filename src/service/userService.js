import main from "../database/db.js";
import { extractDataFromToken } from "../helper/auth.js";
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
            const db = await main();
            const user = await db.collection('bar_users').find({ email: data }).toArray();

            if (user.length === 0) {
                throw new Error('User not found');
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
            if (!role.success) throw new Error('Role not found');

            //!validar que solo pueda crear usuarios si el rol tiene permisos de crear usuarios     



            console.log(role.role[0].name);


            const db = await main();
            data.businessId = dataToken.id;
            const user = await db.collection('bar_users').insertMany([data])

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

}

export default UserService;