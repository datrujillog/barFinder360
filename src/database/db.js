import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

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