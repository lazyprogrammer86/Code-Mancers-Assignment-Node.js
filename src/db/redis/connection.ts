import {createClient} from 'redis';
import { CART_KEY_NAME } from '../../utilities/constants';

const connectionURL = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

export async function connect(): Promise<Boolean> {
    try{
        const client = await createClient({url: connectionURL});
        global.redisConnection = client;
        await client.connect();
        await intiCache();
        console.log('Connected to Redis Server Succesfully');
        return true;
    }catch(error: any){
        console.log('Error while connecting to Redis Server');
        console.log(error);
        return false;
    }
} 

async function intiCache(): Promise<Boolean>{
    try{
        let exists = await global.redisConnection.sendCommand(['EXISTS', CART_KEY_NAME]);
        if(!exists) await global.redisConnection.sendCommand(['JSON.SET', CART_KEY_NAME, '.', '{}']);
        console.log('Cache initialization successful');
        return true;
    }catch(error: any){
        console.log('Error while initializing cache');
        console.log(error);
        return false;
    }
}