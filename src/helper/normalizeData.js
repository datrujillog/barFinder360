
import { ObjectId } from 'mongodb';
import log4js from 'log4js'
import { BadRequest } from '../middleware/errors.js';

const log = log4js.getLogger(`${process.env.NODE_ENV} - normalizeData`);

let parseNewRols = async (obj, objAuthorizationPlantilla) => {

    let object = {
        "name": obj.name,
        "active": obj.active,
        "accessTo": obj.accessTo,
        "businessId": new ObjectId(obj.businessId),
        "authorization": obj.authorizations,
        "defauldUser": obj.defauldUser,
        "defauldAdmin": obj.defauldAdmin,
        "type": obj.type, // "User" o "Admin"
        "description": obj.description
    }
    let authorization

    if (objAuthorizationPlantilla) {
        authorization = objAuthorizationPlantilla
        let rsp = await valuesNestedRecusive(obj.authorizations, authorization)
        object.authorization = rsp
    }
    return object
}




let valuesNestedRecusive = async (dataBody, dataNormalice) => {
    const object = {}
    let i = 1;
    for (const property in dataNormalice) {

        if (dataBody[property]) {
            let value = dataBody[property]
            const type = typeof (value)
            if (type == 'object') {
                object[property] = value
                await valuesNestedRecusive(object[property], dataNormalice[property])
                i++
                log.trace(i)
            }
            object[property] = value
        } else {
            let value = dataNormalice[property]
            const type = typeof (value)
            object[property] = value
        }
    }
    let test = object
    log.trace(test)
    return object
}



const parseProduct = async (body, businessId) => {
    const requiredFields = ['name', 'type', 'code', 'salePrice', 'TimePreparation', 'image', 'categoryId'];

    try {
        // Verificar si todos los campos obligatorios están presentes
        for (const field of requiredFields) {
            if (!(field in body)) {
                throw new BadRequest(`Falta el campo obligatorio: ${field}`);
            }
        }

        // Definir los valores por defecto para los campos opcionales
        const asset = [false, true];
        const status = ['created', 'deleted', 'updated'];

        // Crear el objeto product
        const product = {
            name: body.name,
            type: body.type,
            code: body.code,
            salePrice: body.salePrice,
            TimePreparation: body.TimePreparation,
            description: body.description || '',
            asset: asset[body.asset],
            image: body.image,
            status: status[body.status] || 'created',
            categoryId: new ObjectId(body.categoryId),
            promotionId: body.promotionId ? new ObjectId(body.promotionId) : null,
            businessId: new ObjectId(businessId),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return product;
    } catch (error) {
        // Devolver un objeto con éxito false y el mensaje de error
        return { success: false, error: error.message };
    }
};


export {
    parseNewRols,
    parseProduct
}