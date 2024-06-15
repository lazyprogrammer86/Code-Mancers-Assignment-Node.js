import { NextFunction, Request, Response } from "express";
import { handleError } from "./errorHandler";
import { verifyToken } from "./token";

export function handleAuth(req: Request, res: Response, next: NextFunction): Response | void {
    try{

        let token: string | undefined = req.headers.authorization as string | undefined;

        if(!token) return res.status(401).send({msg: "Token not found in the request"});
        token = token.split(' ')[1];
        if(!token) return res.status(401).send({msg: "Token not found in the request"});
        
        let verifyTokenResult: functionResponse = verifyToken(token);

        if(verifyTokenResult.code != 1) return res.status(401).send({msg: verifyTokenResult.info});
        let {email, username, userId, isAdmin} = verifyTokenResult.info;
        req.authInfo = {email, username, userId, isAdmin};
        next();
    }catch(error){
        console.log('Error while authenitcating');
        console.log(error);
        handleError(req, res, next, error);
    }
}