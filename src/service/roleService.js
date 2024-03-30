
import { ObjectId } from "bson";

import db from "../database/db.js";
import { extractDataFromToken } from "../helper/auth.js";
import { BadRequest } from "../middleware/errors.js";



class RoleService {
    constructor() {
        console.log("RoleService constructor");
    }

    async createRole(data, token) {
        try {
            const dataToken = extractDataFromToken(token);

            // data.userId = dataToken.id;
            data.businessId = new ObjectId(dataToken.businessId);
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
            const role = await db.collection('bar_rol').find({ _id: new ObjectId(roleId) }).toArray();

            console.log(role);

            if (role.length === 0) {
                throw new BadRequest('Role not found');
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