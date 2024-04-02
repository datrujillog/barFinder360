
import { ObjectId } from 'mongodb';
import log4js from 'log4js'
import { BadRequest } from '../middleware/errors.js';
import ProductService from '../service/productService.js';



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

        // ! falta solucionar el problema de estos arrays que no los toma
        const asset = [false, true];
        const status = ['created', 'deleted', 'updated'];
        const typeProduct = ['normal', 'combo'];

        // Crear el objeto product 
        const product = {
            name: body.name,
            type: body.type,
            code: body.code,
            salePrice: body.salePrice,
            TimePreparation: body.TimePreparation,
            description: body.description || '',
            asset: body.asset,
            image: body.image,
            status: body.status,
            categoryId: new ObjectId(body.categoryId),
            promotionId: body.promotionId ? new ObjectId(body.promotionId) : null,
            businessId: new ObjectId(businessId),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return product
    } catch (error) {
        // Devolver un objeto con éxito false y el mensaje de error
        return { success: false, error: error.message };
    }
};


const parseProductUpdate = async (body, businessId) => {
    try {
        // Definir los valores por defecto para los campos opcionales
        const asset = [false, true];
        const status = ['created', 'deleted', 'updated'];
        const type = ['normal', 'combo'];

        // Crear el objeto product
        const product = {
            name: body.name,
            type: type[body.type],
            code: body.code,
            salePrice: body.salePrice,
            TimePreparation: body.TimePreparation,
            description: body.description || '',
            asset: asset[body.asset],
            image: body.image,
            status: status[body.status],
            categoryId: new ObjectId(body.categoryId),
            promotionId: body.promotionId ? new ObjectId(body.promotionId) : null,
            businessId: new ObjectId(businessId),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return product
    } catch (error) {
        // Devolver un objeto con éxito false y el mensaje de error
        return { success: false, error: error.message };
    }
};


const parseOrder = async (body, businessId, user, results) => {
    const requiredFields = ['tableId', 'servidores'];

    try {
        for (const field of requiredFields) {
            if (!(field in body)) {
                throw new BadRequest(`Falta el campo obligatorio: ${field}`);
            }
        }

        const productos = results.map(producto => {
            const item = body.servidores.find(servidor => servidor.items.find(item => item.productId == producto._id.toString()))
            console.log(item)
            const itemProducto = item.items.find(item => item.productId == producto._id.toString())
            return {
                userId: new ObjectId(user),
                items: {
                    productos: {
                        // name: producto.name,
                        // salePrice: producto.salePrice,
                        productId: producto._id,
                    },
                    cantidad: itemProducto.cantidad,
                    total: itemProducto.cantidad * producto.salePrice,
                    // total: itemProducto.total,
                    user: new ObjectId(user),
                    fecha: new Date()

                },
            }
        })

        const save = {
            businessId: new ObjectId(businessId),
            userId: new ObjectId(user._id),
            tableId: new ObjectId(body.tableId),
            status: 'PENDING',
            total: productos.map(producto => producto.items.total).reduce((a, b) => a + b, 0),
            servidores: productos,
        }

        return save

    } catch (error) {
        return { success: false, error: error.message };
    }
};


const parseOrderUpdate = async (body, businessId) => {
    try {
        const productServ = new ProductService();

        if (body.servidores) {
            const productoPedido = body.servidores.flatMap((servidor) => servidor.items.map((item) => item.productId));
            const idsObjeto = productoPedido.map((id) => new ObjectId(id));
            const results = await productServ.orderByIdproduct(businessId, idsObjeto);
            if (results.error) throw new BadRequest(results.error);

            body.servidores.forEach((servidor) => {
                servidor.items.forEach((item) => {
                    if (item.hasOwnProperty('cantidad')) {
                        const product = results.Product.find((product) => product._id.toString() === item.productId.toString());
                        if (product) {
                            item.price = product.salePrice;
                            item.total = item.cantidad * item.price;
                        }
                    }
                });
            });
        }

        const total = body.servidores.map(servidor => servidor.items.map(item => item.total).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        body.total = total

        return body

    } catch (error) {
        // return an error if something went wrong
        return { success: false, error };
    }

}





export {
    parseNewRols,
    parseProduct,
    parseOrder,
    parseOrderUpdate
}