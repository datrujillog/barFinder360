
import { ObjectId } from 'mongodb';
import log4js from 'log4js'

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

export {
    parseNewRols
}