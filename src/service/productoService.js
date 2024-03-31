import { ObjectId } from "bson";

import { BadRequest } from "../middleware/errors.js";

import db from "../database/db.js";

class ProductService {
    constructor() {
        console.log('Producto Service is created');
    }

    
}

module.exports = ProductService;