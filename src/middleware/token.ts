import crypto from 'node:crypto';
import { PASSWORD_SECRET, TOKEN_SECRET } from '../utilities/constants';
import jwt from 'jsonwebtoken';

export function createHash(text: string): functionResponse{
    try{
        const hash: string = crypto.createHmac('sha256', PASSWORD_SECRET).update(text).digest('hex');
        return {code: 1, msg: 'success', info: hash};
    }catch(error: any){
        console.log(`Error while hashing string ${text}`);
        console.log(error);
        return {code : -1, msg: 'failed', info: error.message};
    }
}

export function createToken(doc: tokenInfo): functionResponse {
    try{
        let token: string = jwt.sign({...doc}, TOKEN_SECRET, {expiresIn: '24h'});
        return {code: 1, msg: 'Success', info: token};
    }catch(error: any){
        console.log('Error while creating token');
        console.log(error);
        return {code : -1, msg: 'Failed', info: error.message};
    }
}

export function verifyToken(token: string): functionResponse {
    try{
        let tokenInfo = jwt.verify(token, TOKEN_SECRET);
        return {code : 1, msg: 'Success', info: tokenInfo};
    }catch(error: any){ 
        console.log('Error while verifying token');
        console.log(error);
        return {code : -1, msg: 'Failed', info: error.message};
    }
}