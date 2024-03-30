
import db from "../database/db.js";
import { encryptPassword, comparePassword } from "../helper/encrypt.js";
import { createToken } from "../helper/createToken.js";
import BusinessService from "./businessService.js";
import UserService from "./userService.js";
import RoleService from "./roleService.js";
import { BadRequest } from "../middleware/errors.js";



class AuthService {
    constructor() {
        console.log("AuthService constructor");
        this.BusinessServ = new BusinessService();
        this.UserServ = new UserService();
        this.roleServ = new RoleService();

    }

    async login(data) {
        try {


            const user = await this.UserServ.byEmailUser(data.email);
            if (!user.success) throw new BadRequest(user.error); 


            const isMatch = await comparePassword(data.password, user.user[0].password);
            if (!isMatch) {
                return { success: false, error: 'Invalid password' };
            }
            const token = await createToken(user.user[0]);
            const result = user.user[0];
            return {
                success: true,
                result,
                token:token
            };

        } catch (error) {
            return { success: false, error: error };
        }
    }

    async signup(data) {
        try {

            if (data.password) {
                data.password = await encryptPassword(data.password);
            }

            const rol = await db.collection('bar_rol').insertOne({ name: 'ADMIN' })

            const business = await db.collection('bar_business').insertMany([data])

            const insertedIds = business.insertedIds;
            const insertedData = Object.keys(insertedIds).map(key => ({
                _id: insertedIds[key],
                ...data
            }));

            //Aactualizar el negocio con el rol
            await db.collection('bar_business').updateOne({ _id: insertedData[0]._id }, { $set: { rolId: rol.insertedId } })
            
            
            const user = await db.collection('bar_users').insertMany([{
                name: insertedData[0].name,
                lastname: insertedData[0].lastName,
                email: insertedData[0].email,
                password: insertedData[0].password,
                phone: insertedData[0].phone,
                businessId: insertedData[0]._id,
                rolId: rol.insertedId
            }]) 
            // actualizar la tabla  roles con el id del usuario
            await db.collection('bar_rol').updateOne({ _id: rol.insertedId }, { $set: { userId: user.insertedIds[0], businessId: business.insertedIds[0] } })        
            
            const token = await createToken(insertedData[0]);
            delete insertedData[0].password;
            // console.log('insertedData', insertedData);
            await this.roleServ.createPlantillas();
            return {
                success: true,
                data: insertedData,
                token
            };
        } catch (error) {
            return { success: false, error };
        }
    }
}

export default AuthService;