
import { ObjectId } from "bson";
import db from "../database/db.js";
import { BadRequest } from "../middleware/errors.js";



class BusinessService {
    constructor() {
        console.log("BusinessService constructor");
    }

    async getBusinesses() {

        try {
            const businesses = await db.collection('bar_business').find().toArray();
            const cout = await db.collection('bar_business').find().count();
            return {
                success: true,
                cout,
                businesses
            };
        } catch (error) {
            return { success: false, error };
        }
    }


    async byEmailBusiness(data) {
        try {
            const business = await db.collection('bar_business').find({ email: data }).toArray();

            if (business.length === 0) {
                throw new Error('Business not found');
                // return { success: false, error: 'Business not found' };
            }

            return {
                success: true,
                business
            };

        } catch (error) {
            return { success: false, error };
        }
    }

    async businessById(businessId) {

        const dataUser = await db.collection('bar_business').aggregate([
            {
                $match: {
                    _id: new ObjectId(businessId)
                }
            },
            {
                $lookup: {  //  esta linea de codigo es para hacer un join con la tabla de usuarios
                    from: 'bar_users',
                    localField: '_id',
                    foreignField: 'businessId',
                    as: 'users'
                }
            },
            {
                $lookup: {
                    from: 'bar_rol',
                    localField: '_id',
                    foreignField: 'businessId',
                    as: 'roles'
                }
            }

        ]).toArray();

        if (dataUser.length === 0) {
            throw new BadRequest("usuario no existe", "usuarioNoExiste")
        }
        let userData = dataUser[0];
        let roles = userData.roles[0];
        let users = userData.users[0];

        delete userData['password'];
        delete roles['password'];
        delete users['password'];

        return {
            success: true,
            business: userData
        };













    }

}

export default BusinessService;