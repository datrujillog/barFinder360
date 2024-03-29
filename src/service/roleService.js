
import { ObjectId } from "bson";

import main from "../database/db.js";
import { extractDataFromToken } from "../helper/auth.js";



class RoleService {
    constructor() {
        console.log("RoleService constructor");
    }

    async createRole(data, token) {
        try {
            const dataToken = extractDataFromToken(token);

            const db = await main();
            data.userId = dataToken.id;
            const role = await db.collection('bar_rol').insertOne(data)
            return {
                success: true,
                result: role
            }
        } catch (error) {
            return { success: false, error: error };
        }


    }

    // ! aqui estoy desarrollando validar  que solo el negocio que inicio sesion pueda crear roles

    async roleById(roleId) {

        try {
            // buscar el id del rol en la base de datos
            const db = await main();
            const role = await db.collection('bar_rol').find({ _id: new ObjectId(roleId) }).toArray();

            console.log(role);

            if (role.length === 0) {
                throw new Error('Role not found');
            }

            return {
                success: true,
                role
            };


        } catch (error) {
            return { success: false, error: error };
        }
    }

}

export default RoleService;