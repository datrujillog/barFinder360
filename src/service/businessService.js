
import { ObjectId } from "bson";
import main from "../database/db.js";

class BusinessService {
    constructor() {
        console.log("BusinessService constructor");
    }

    async getBusinesses() {

        try {
            const db = await main();
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
            const db = await main();
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
        try {
            const db = await main();
            const business = await db.collection('bar_business').find({ _id: new ObjectId(businessId) }).toArray();

            if (business.length === 0) {
                throw new Error('Business not found'); 
            }

            return {
                success: true,
                business
            };

        } catch (error) {
            return { success: false, error };
        }
    }

}

export default BusinessService;