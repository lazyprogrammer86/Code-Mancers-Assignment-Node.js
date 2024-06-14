import {createClient} from 'redis';

const connectionURL = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

export async function connect(): Promise<Boolean> {
    try{
        const client = await createClient({url: connectionURL});
        global.redisConnection = client;
        console.log('Connected to Redis Server Succesfully');
        return true;
    }catch(error: any){
        console.log('Error while connecting to Redis Server');
        console.log(error);
        return false;
    }
} 