
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

        const dataUser = await db.collection('bar_business').findOne({ _id: new ObjectId(businessId) });

        if (dataUser.length === 0) {
            throw new BadRequest("usuario no existe", "usuarioNoExiste")
        }
        let userData = dataUser;
        // let roles = userData.roles[0];
        // let users = userData.users[0];

        delete userData['password'];
        // delete roles['password'];
        // delete users['password'];

        console.log(userData);

        return {
            success: true,
            business: userData
        };

    }


    async usersByBusiness(businessId, idBusiness) {
        try {
            const users = await db.collection('bar_users').aggregate([
                {
                    $match: {
                        businessId: new ObjectId(businessId),
                    }
                },
                {
                    $lookup: {
                        from: "bar_rols",
                        localField: "roleId",
                        foreignField: "_id",
                        as: "role"
                    }
                },
                {
                    $lookup: {
                        from: "bar_business",
                        localField: "businessId",
                        foreignField: "_id",
                        as: "business"
                    }
                }
            ]).toArray();


            if (users.length === 0) {
                throw new BadRequest('No users found', 'noUsersFound');
            }
            for (let i in users) {
                delete users[i].password;
            }

            return {
                success: true,
                users
            };

        } catch (error) {
            return { success: false, error };
        }
    }
}

export default BusinessService;