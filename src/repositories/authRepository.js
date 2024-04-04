
import { ObjectId } from 'mongodb';
import { BadRequest } from "../middleware/errors.js";
import AuthModel from "../database/db.js";



class AuthRepository {
    #AuthModel;
    constructor() {
        this.#AuthModel = AuthModel;
    }

    
}

export default AuthRepository;
