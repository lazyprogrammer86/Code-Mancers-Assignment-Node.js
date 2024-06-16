import {Router, Request, Response, NextFunction} from 'express';
import { handleError } from '../middleware/errorHandler';
import { deleteDoc, getDocs, insertDoc, updateDoc } from '../db/mongodb/controller';
import { PRODUCT_COLLECTION_NAME} from '../utilities/constants';
const UUID = require('uuid');
import { adminHandle } from '../middleware/authHandler';

export const produtctAPI = Router();

/**Insert product */
produtctAPI.post('/product/insert', adminHandle, async(req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
    try{
        /**Request Body validation */
        let requestBody: productBody = req.body;
        if(!requestBody.title || !requestBody.description || !requestBody.image || !requestBody.price) return res.status(400).send({msg: "missing one or all of the required fields"});
        
        requestBody.productId = UUID.v4();

        let result: dbResponse = await insertDoc(PRODUCT_COLLECTION_NAME, requestBody);
        if(result.code != 1) return res.status(400).send({msg: result.info});
        res.status(201).send({msg: 'Successfully inserted product'});
        return;

    }catch(error: any){
        console.log('Error while inserting product');
        console.log(error);
        handleError(req, res, next, error);
    }
});

/**Update product */
produtctAPI.patch('/product/update', adminHandle, async(req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
    try{
        let {productId} = req.query;
        let requestBody = req.body;

        if(!productId) return res.status(400).send({msg: "Product Id is required"});

        if(!Object.keys(requestBody).length) return res.status(400).send({msg: "Empty Request Body"});

        let productUpdateResult = await updateDoc(PRODUCT_COLLECTION_NAME, {productId},{...requestBody});

        if(productUpdateResult.code != 1) return res.status(500).send({msg: productUpdateResult.info});

        res.status(200).send({msg: 'Updated successfully'});
        return;
    }catch(error: any){
        console.log('Error while updating product');
        console.log(error);
        handleError(req, res, next, error);
    }
});

/**delete product */
produtctAPI.delete('/product/delete', adminHandle, async(req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
    try{
        let {productId} = req.query;

        if(!productId) return res.status(400).send({msg: "Product Id is required"});

        let productDeleteResult = await deleteDoc(PRODUCT_COLLECTION_NAME, {productId});

        if(productDeleteResult.code != 1) return res.status(500).send({msg: productDeleteResult.info});

        res.status(200).send({msg: 'Product deleted successfully'});
        return;
    }catch(error: any){
        console.log('Error while deleting product');
        console.log(error);
        handleError(req, res, next, error);
    }
});

/**get product */
produtctAPI.get('/product/get', async(req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
    try{ 
        let {productId} = req.query;
        let parameters: any = [];
        if(Array.isArray(productId)) parameters.push({productId: {"$in" : productId}});
        else if(productId) parameters.push({productId});
        
        let getProductResult = await getDocs(PRODUCT_COLLECTION_NAME, parameters);

        if(getProductResult.code != 1) return res.status(500).send({msg: getProductResult.info});

        if(!getProductResult.info){
            if(productId) return res.status(404).send({msg: 'Product Not found'});
            return res.status(204).send();
        }

        res.status(200).send(getProductResult.info);
        return;
    }catch(error: any){
        console.log('Error while getting products');
        console.log(error);
        handleError(req, res, next, error);
    }
});