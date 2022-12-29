import { MongoClient } from 'mongodb';
export async function connectMongoDb() {
    const urlMongoDb = process.env.MONGO_DB_URL
    if (urlMongoDb) {
        const client = await MongoClient.connect(urlMongoDb);
        return client;
    }
    else {
        throw "La variable MONGO_DB_URL est manquante dans .env.local"
    }

}