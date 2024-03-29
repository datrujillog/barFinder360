
import main from "../database/db.js";
import { extractDataFromToken } from "../helper/auth.js";



class RoleService {
    constructor() {
        console.log("RoleService constructor");
    }

    async createRole(data, token){
        try {
            const dataToken = extractDataFromToken(token);

            const db = await main();
            data.rolId = dataToken.id;
            const role = await db.collection('bar_rol').insertOne(data)
            return {
                success: true,
                result: role
            }
        }catch(error){
            return { success: false, error: error };
        }
        
        
    }

}

export default RoleService;