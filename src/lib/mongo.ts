import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI;

console.log('MongoDB URI:', uri);
if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
}

const options: MongoClientOptions = {
    tls: true,
    tlsAllowInvalidCertificates: false,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
    if (!globalThis._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalThis._mongoClientPromise = client.connect();
    }
    clientPromise = globalThis._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
