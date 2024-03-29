import main from "../database/db.js";





class UserService {
    constructor() {
        console.log("userService constructor");
    }

    async byEmailUser(data) {
        try {
            const db = await main();
            const user = await db.collection('bar_users').find({ email: data }).toArray();

            if (user.length === 0) {
                throw new Error('User not found');
            }

            return {
                success: true,
                user
            };

        } catch (error) {
            return { success: false, error };
        }
    }


    async createUser(data) {
        try {
            const db = await main();
            const user = await db.collection('bar_users').insertMany([data])

            const insertedIds = user.insertedIds;
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

}

export default UserService;