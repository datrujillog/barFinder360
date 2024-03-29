import main from "../database/db.js";
import { extractDataFromToken } from "../helper/auth.js";
import BusinessService from "./businessService.js";




class UserService {
    constructor() {
        console.log("userService constructor");
        this.businessServ = new BusinessService();
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


    //! solo el negocio que inicio sesion puede crear usuarios
    async createUser(data, token) {
        try {
            const dataToken = extractDataFromToken(token);

            //!validar que solo pueda crear usuarios si es un negocio el que esta creando             

            // const business = await this.businessServ.businessById(data.businessId);
            // if (!business.success) throw new Error('Business not found');

            // if(dataToken.id != business.business[0].id){
            //     throw new Error('You are not authorized to create users');
            // }



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