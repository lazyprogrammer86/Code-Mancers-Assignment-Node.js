import express, { Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { authAPI } from './api/authAPI';
import { produtctAPI } from './api/productAPI';
import { cartAPI } from './api/cartAPI';
import { notFound } from './middleware/notFound';
import { handleAuth } from './middleware/authHandler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**global variables */
global.mongodbConnection = null;
global.redisConnection = null;

/**Welcome route */
app.get('/', (req: Request, res: Response) : void => {
    res.status(200).send({msg: 'Welcome to the E - Commerce Server'});
    return;
});

/**Routes Inclusion */
const protectedRoutes: Router[] = [produtctAPI, cartAPI];
const unProtectedRoutes: Router[] = [authAPI];

/**Unprotected routes */
app.use('/auth', unProtectedRoutes);

/**Auth middleware goes here*/
app.use(handleAuth);

/**Auth Protected routes */
app.use('/api', protectedRoutes);

/**Undeclared routes handler 404 */
app.use(notFound);

async function initialize(): Promise<void>{
    // env variables
    dotenv.config({path: './server.properties'});
    
    /**Initialize mongo db connection */
    const {connect: mongoConnection} = require('./db/mongodb/connection');
    let mongoConnected: Boolean = await mongoConnection();
    if(!mongoConnected){
        console.log('Server can not be started, due to error in mongo db connection');
        process.exit(1);
    }
    
    /**Initialize redis connection */
    // const {connect: redisConnection} = require('./db/redis/connection');
    // let redisConnected: Boolean = await redisConnection();
    // if(!redisConnected){
    //     console.log('Server can not be started, due to error in redis connection');
    //     process.exit(1);
    // }

    return;
}

let server: http.Server | null  = null;

async function startServer(): Promise<void> {
    try{
        await initialize();
        server = http.createServer(app).listen(process.env.PORT);
        console.log(`Server Up and Running on Port ${process.env.PORT}`);
    }catch(error){
        console.log(`Error while starting server`);
        console.log(error);
        process.exit(1);
    }
}

startServer();

function stopServer(): void {
    console.log('Server close signal recieved');
    if(server){
        server.close();
        console.log('Server Closed successfully');
    }
}

process.on('SIGINT', stopServer);
process.on('SIGTERM', stopServer);
