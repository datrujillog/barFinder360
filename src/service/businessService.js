
import { ObjectId } from "bson";
import db from "../database/db.js";
import { BadRequest } from "../middleware/errors.js";
import BusinessRepository from "../repositories/businessRepository.js";


class BusinessService extends BusinessRepository {
    constructor() {
        super();

    }

    async getBusinesses() {

        try {

            const business = await this.findBusinessById();
            if (!business.success) throw new BadRequest(business.error.message);
           
            return {
                success: true,
                business
            };
        } catch (error) {
            return { success: false, error };
        }
    }


    async byEmailBusiness(data) {
        try {

            const business = await this.byEmailBusiness(email);
            if(!business.success) throw new BadRequest(business.error.message);

            return {
                success: true,
                business
            };

        } catch (error) {
            return { success: false, error };
        }
    }

    async businessById(businessId) {

        const results = await this.findBusinessById(businessId);
        if(!results.success) throw new BadRequest(results.error.message);
        
        const { business } = results;   
        delete business['password'];

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
                // return { success: false, messages: 'No users found'};
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