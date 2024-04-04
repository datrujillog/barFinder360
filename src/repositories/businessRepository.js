
import { ObjectId } from 'mongodb';
import { BadRequest } from "../middleware/errors.js";
import BusinessModel from "../database/db.js";



class BusinessRepository {
    #businessModel;
    constructor() {
        this.#businessModel = BusinessModel;
    }

    async createBusiness(data) {

        try {

            const business = await this.#businessModel.collection('bar_business').insertMany([data])
            if (business.acknowledged === false) throw new BadRequest("Error  al crear usuario");

            const insertedIds = business.insertedIds;
            const insertedData = Object.keys(insertedIds).map(key => ({
                _id: insertedIds[key],
                ...data
            }));

            return {
                success: true,
                business: insertedData
            };

        } catch (error) {
            return { success: false, error };
        }
    }

    async findBusinessById() {

        try {

            const businesses = await this.#businessModel.collection('bar_business').find().toArray();
            if (!businesses) throw new BadRequest("Business not found");

            const count = await this.#businessModel.collection('bar_business').find().count();

            return {
                success: true,
                count,
                businesses
            };

        } catch (error) {
            console.log(error);
            return { success: false, error };

        }
    }

    async emailByBusiness(email) {
        try {

            const business = await db.collection('bar_business').find({ email: email }).toArray();

            if (business.length === 0) {
                throw new BadRequest('Business not found');
            }

            return {
                success: true,
                business
            }

        } catch (error) {
            return { success: false, error };
        }
    }
}

export default BusinessRepository;