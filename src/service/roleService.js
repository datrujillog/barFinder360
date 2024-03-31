
import { ObjectId } from 'mongodb';

import db from "../database/db.js";

import { extractDataFromToken } from "../helper/auth.js";
import { BadRequest } from "../middleware/errors.js";
import plantillaRolAdmin from '../helper/plantillas/plantilla_rolAdmin.js'
import plantillaRolUser from '../helper/plantillas/plantilla_rolUser.js'
import plantillaRolSuperUser from '../helper/plantillas/plantilla_rolSuperAdmin.js'
import { parseNewRols } from '../helper/normalizeData.js'


class RoleService {
    constructor() {
        console.log("RoleService constructor");
    }

    async createRole(data, token) {
        try {
            const dataToken = extractDataFromToken(token);

            // data.userId = dataToken.id;
            data.businessId = new ObjectId(dataToken.businessId);
            const role = await db.collection('bar_rols').insertOne(data)
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
            const role = await db.collection('bar_rols').find({ _id: new ObjectId(roleId) }).toArray();

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

    async createPlantillas() {
        try {

            // console.log(plantillaRolAdmin)
            await db.collection('bar_roleConfigutation').insertMany([plantillaRolAdmin])
            await db.collection('bar_roleConfigutation').insertMany([plantillaRolUser])
            await db.collection('bar_roleConfigutation').insertMany([plantillaRolSuperUser])
            return {
                success: true,

            }
        } catch (error) {
            return { success: false, error: error };
        }
    }

    async createRoles(dataRoles) {
        let role;

        try {
            const templateType = dataRoles.type === 'Admin' ? 'Admin' : dataRoles.type === 'User' ? 'User' : dataRoles.type === 'SuperAdmin' ? 'SuperAdmin' : null;

            role = await this.getRolesTemplate(templateType);
            if (!role.success) throw new BadRequest(role.error);

            const resp = await this.createRolesAuthorization(dataRoles, role.results[0].authorizations);
            if (!resp.success) throw new BadRequest(resp.error)

            return {
                success: true,
                result: resp
            }; 
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }



    async getRolesTemplate(type) {
        try {
            const results = await db.collection('bar_roleConfigutation').find({ type: type }).toArray();
            if (!results || !results.length) throw new BadRequest('Template not found');

            return {
                success: true,
                results
            };

        } catch (error) {
            return { success: false, error: error };
        }
    }

    async createRolesAuthorization(data,objAuthorizationPlantilla) {
        try {

            const save = await parseNewRols(data, objAuthorizationPlantilla)

            const role = await db.collection('bar_rols').insertOne(save)
            if (role === null) throw new BadRequest('Error creating role');


            return {
                success: true,
                result: role
            }
        } catch (error) {
            return { success: false, error: error };
        }
    }

}

export default RoleService;