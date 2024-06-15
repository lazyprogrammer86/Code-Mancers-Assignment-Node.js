import {Router, Request, Response, NextFunction} from 'express';
import { handleError } from '../middleware/errorHandler';
import { getDoc, insertDoc } from '../db/mongodb/controller';
import { USER_COLLECTION_NAME } from '../utilities/constants';
import { createHash, createToken } from '../middleware/token';
const UUID = require('uuid');

export const authAPI = Router();

/**Registration API */
authAPI.post('/register', async (req :Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try{
        /**Request Body validation */
        let requestBody: RegistrationBody = req.body;
        
        if(!requestBody.email || !requestBody.password) return res.status(400).send({msg: 'Required credentials are missing'});
        
        let hashResult = await createHash(requestBody.password);
        if(hashResult.code != 1) return res.status(500).send({msg: 'Error while creating hash'});
        requestBody.password = hashResult.info;
        requestBody.userId = UUID.v4();
        if(requestBody.email === 'adarshnayak86@gmail.com') requestBody.isAdmin = true;
        else requestBody.isAdmin = false;

        let result: dbResponse = await insertDoc(USER_COLLECTION_NAME, requestBody);
        if(result.code != 1) return res.status(400).send({msg: result.info});
        res.status(201).send({msg: 'Successfully inserted user'});
        return;
    }catch(error: any){
        console.log('Error while registering user');
        console.log(error);
        handleError(req, res, next, error);
    }
});

/**Login API */
authAPI.post('/login', async (req :Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try{
        /**Request Body validation */
        let requestBody: LoginBody = req.body;
        
        if(!requestBody.email || !requestBody.password) return res.status(400).send({msg: 'Required credentials are missing'});

        let getDocResult = await getDoc(USER_COLLECTION_NAME, [{email: requestBody.email}]);
        if(getDocResult.code != 1) return res.status(400).send({msg: getDocResult.info});
        
        let genHash: functionResponse = createHash(requestBody.password);

        if(!getDocResult.info || genHash.code !== 1 || getDocResult.info.password !== genHash.info) return res.status(401).send({msg: 'Entered credentials are wrong'});
        let {email, isAdmin, userId, username} = getDocResult.info;
        let tokenResult = createToken({email, userId, username, isAdmin});

        if(tokenResult.code != 1) return res.status(500).send({msg: tokenResult.info});

        res.setHeader('Authorization', `Bearer ${tokenResult.info}`);
        res.status(200).send({msg: `Hello ${email}`});
        return;
    }catch(error: any){
        console.log('Error while registering user');
        console.log(error);
        handleError(req, res, next, error);
    }
});