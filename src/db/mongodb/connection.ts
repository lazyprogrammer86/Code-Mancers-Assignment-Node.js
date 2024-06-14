import {MongoClient, Db} from 'mongodb';

const connectionURL: string = `mongodb://${process.env.MONGO_DB_USERNAME || ''}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}${process.env.MONGO_DB_PORT ? ':' + process.env.MONGO_DB_PORT : ''}`;

const client = new MongoClient(connectionURL);

export async function connect(): Promise<Boolean>{
    try{
        await client.connect();
        console.log('Connected to mongodb successfully');
        global.mongodbConnection = client.db(process.env.MONGO_DB_DATABASE_NAME);
        return true;
    }catch(error: any){
        console.log('Error while connecting to mongodb');
        console.log(error);
        return false;
    }
}