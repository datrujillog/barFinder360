import { auth } from "../middleware/auth.js";
import { errorResponse } from "./response.js";
import { BadRequest } from "../middleware/errors.js";




const validateBusiness = async (businessId, token) => {
    try {
        const dataToken = await auth(token);
        if (dataToken.businessId !== businessId) {
            throw new BadRequest('Error de autenticacion');
        }
        return {
            success: true,
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }
};




export default validateBusiness;