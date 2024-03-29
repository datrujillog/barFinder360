
import main from "../database/db.js";

class BusinessService {
    constructor() {
        console.log("BusinessService constructor");
    }

    async getBusinesses() {

        try {
            const db = await main();
            const businesses = await db.collection('business').find().toArray();
            const cout = await db.collection('business').find().count();
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
            const business = await db.collection('business').find({ email: data }).toArray();

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
            const business = await db.collection('business').find({ _id: ObjectId(businessId) }).toArray();

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