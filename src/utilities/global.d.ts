import { Db } from 'mongodb';
import {redisClient} from 'redis';

declare global {
    var mongodbConnection: Db | null;
    var redisConnection: redisClient | null;
}

export {};
