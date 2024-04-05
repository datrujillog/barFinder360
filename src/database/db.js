import { MongoClient } from 'mongodb';
import configS from '../config/config.js';


const client = new MongoClient(configS.urlMongodb);

// Database Name
const dbName = 'barFinder';


async function main() {
    try {
        await client.connect();
        console.log('Connected to the database');
        const db = client.db(dbName);

        const collection = db.collection('example');
        const result = await collection.insertOne({ name: 'Example' });

        console.log('Connected to the database =>>>', db.databaseName);
        console.log();
        console.log('Conexion establecida en el host:', db.client.s.url);

        return db;

    } catch (error) {
        console.error('Error connecting to the database', error);
    }


}

const db = await main();

export default db;
