import { MongoClient } from 'mongodb';
import config from '../config/config.js';


const client = new MongoClient(config.urlMongodb);

// Database Name
const dbName = 'barFinder';


async function main() {
    try {
        await client.connect();
        console.log('Connected to the database');
        const db = client.db(dbName);

        const collection = db.collection('example');
        // agregar documanto ala collecion 
        // const result = await collection.insertOne({ name: 'Example' });
        // console.log('result', result);

        return db;

    } catch (error) {
        // console.error('Error connecting to the database', error);
    }
}

export default main