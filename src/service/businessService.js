
import { ObjectId } from "bson";
import db from "../database/db.js";
import { BadRequest } from "../middleware/errors.js";
import BusinessRepository from "../repositories/businessRepository.js";
import UserRepository from "../repositories/userRepository.js";

class BusinessService extends BusinessRepository {
    constructor() {
        super();

        this.userRepository = new UserRepository();

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

            const business = await this.emailByBusiness(email);
            if (!business.success) throw new BadRequest(business.error.message);

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
        if (!results.success) throw new BadRequest(results.error.message);

        const { business } = results;
        delete business['password'];

        return {
            success: true,
            business: business
        };

    }


    async usersByBusiness(businessId, idBusiness) {

        try {

            const results = await this.userRepository.findUserByBusiness(businessId);
            if (!results.success) throw new BadRequest(results.error.message);
            
            const { users, count } = results;
            return {
                success: true,
                count,
                users
            };

        } catch (error) {
            return { success: false, error };
        }
    }
}

export default BusinessService;