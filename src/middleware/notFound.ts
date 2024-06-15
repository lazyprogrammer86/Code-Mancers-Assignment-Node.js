import { NextFunction, Request, Response } from "express";

export function notFound(req: Request, res: Response){
    res.status(404).send({msg: 'Page Not Found'});
    return;
}