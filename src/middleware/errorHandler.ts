import { NextFunction, Request, Response } from "express";

export function handleError(req: Request, res: Response, next: NextFunction, error: any): void {
    try{
        if(error){
            console.log('Error while handling route error');
            console.log(error);
            res.status(500).send({msg: error.message});
            return;
        }
        next();
        return;
    }catch(err: any){
        console.log('Error while handling route error');
        console.log(err);
        res.status(500).send({msg: err.message});
        return;
    }
}