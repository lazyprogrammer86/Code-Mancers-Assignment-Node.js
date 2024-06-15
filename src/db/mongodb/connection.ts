import {MongoClient, Db} from 'mongodb';
import { USER_COLLECTION_NAME } from '../../utilities/constants';

const connectionURL: string = `mongodb://${process.env.MONGO_DB_USERNAME || ''}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}${process.env.MONGO_DB_PORT ? ':' + process.env.MONGO_DB_PORT : ''}`;

const client = new MongoClient(connectionURL);

export async function connect(): Promise<Boolean>{
    try{
        await client.connect();
        console.log('Connected to mongodb successfully');
        global.mongodbConnection = client.db(process.env.MONGO_DB_DATABASE_NAME);
        await createDBInit();
        return true;
    }catch(error: any){
        console.log('Error while connecting to mongodb');
        console.log(error);
        return false;
    }
}

export async function createDBInit(): Promise<Boolean>{
    try{
        await global.mongodbConnection?.collection(USER_COLLECTION_NAME).createIndex({email: 1}, {unique: true});
        console.log('DB init process completed');
        return true;
    }catch(error: any){
        console.log('Error while creating DB init mongodb');
        console.log(error);
        return false;
    }
}