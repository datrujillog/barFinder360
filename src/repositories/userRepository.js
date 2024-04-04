
import { ObjectId } from 'mongodb';
import { BadRequest } from "../middleware/errors.js";
import UserModel from "../database/db.js";



class UserRepository {
    #userModel;
    constructor() {
        this.#userModel = UserModel;
    }

    async createUsers(data) {

        try {

            const results = await this.#userModel.collection('bar_users').insertMany([data]);
            if (results.acknowledged === false) throw new BadRequest("Error al crear el usuario");

            const insertedIds = results.insertedIds;
            const insertedData = Object.keys(insertedIds).map(key => ({
                _id: insertedIds[key],
                ...data
            }));

            return {
                success: true,
                user: insertedData
            };

        } catch (error) {
            return { success: false, error };
        }
    }

    async findUserById(businessId, userId) {

        try {

            const user = await this.#userModel.collection('bar_users').aggregate([
                {
                    $match: {
                        _id: new ObjectId(userId),
                        businessId: new ObjectId(businessId)
                    }
                },
                {
                    $lookup: {
                        from: 'bar_business',
                        localField: 'businessId',
                        foreignField: '_id',
                        as: 'business'
                    }
                },
                {
                    $lookup: {
                        from: 'bar_rols',
                        localField: 'roleId',
                        foreignField: '_id',
                        as: 'role'
                    }
                }
            ]).toArray();

            if (user.length === 0) throw new BadRequest('El usuario no existe');

            return {
                success: true,
                user
            }

        } catch (error) {
            return { success: false, error };

        }

    }

    async findUserByEmail(data) {

        try {

            const user = await this.#userModel.collection('bar_users').find({ email: data }).toArray();
            if (user.length === 0) throw new BadRequest('El Email no existe');

            return {
                success: true,
                user
            }

        } catch (error) {
            return { success: false, error };

        }
    }

    async findUserByBusiness(businessId) {

        try {

            const users = await this.#userModel.collection('bar_users').aggregate([
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

            const count = await this.#userModel.collection('bar_users').find({ businessId: new ObjectId(businessId) }).count();

            return {
                success: true,
                count,
                users
            }

        } catch (error) {
            return { success: false, error };

        }
    }
}

export default UserRepository;
