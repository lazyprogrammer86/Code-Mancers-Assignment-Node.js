import {Router, Request, Response, NextFunction} from 'express';
import { handleError } from '../middleware/errorHandler';
import { CART_COLLECTION_NAME, ORDER_COLLECITON_NAME, PRODUCT_COLLECTION_NAME } from '../utilities/constants';
import { deleteDoc, insertDoc, lookupDoc, updateDoc } from '../db/mongodb/controller';
import { sendOrderMail } from '../controllers/sendMail';

export const cartAPI = Router();


/**insert product to cart*/
cartAPI.put('/cart/insert', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try{ 
        let requestBody: cartRequestBody[]  = req.body;
        
        let insertResponse = await updateDoc(CART_COLLECTION_NAME, {userId: req.authInfo!.userId}, {products: requestBody}, true);

        if(insertResponse.code != 1) return res.status(500).send({msg: insertResponse.info});

        return res.status(200).send({msg: 'Successfully added to the cart'});
    }catch(error: any){
        console.log('Error while inserting products to cart');
        console.log(error);
        handleError(req, res, next, error);
    }
});

/**insert product to cart*/
cartAPI.get('/cart/get', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try{ 
        let response = await lookupDoc(CART_COLLECTION_NAME, PRODUCT_COLLECTION_NAME, {userId: req.authInfo!.userId});

        if(response.code != 1) return res.status(500).send({msg: response.info});
        if(!response.info || !response.info[0] || !response.info[0].cartItems) return res.status(200).send([]);
        return res.status(200).send(response.info[0]?.cartItems);
    }catch(error: any){
        console.log('Error while inserting products to cart');
        console.log(error);
        handleError(req, res, next, error);
    }
});


/**checkout cart */
cartAPI.post('/cart/checkout', async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try{
        let address = req.body.address;
        if(!address) return res.status(400).send({msg: "Address is required"});
        
        let response: functionResponse =  await lookupDoc(CART_COLLECTION_NAME, PRODUCT_COLLECTION_NAME, {userId: req.authInfo!.userId});
        if(response.code != 1) return res.status(500).send({msg: response.info});
        if(!response.info || !response.info[0] || !response.info[0].cartItems) return res.status(404).send({msg: "Cart is empty"});
        
        let productIds: cartRequestBody[] = [];
        let totalPrice: number  = 0;

        for(let item of response.info[0].cartItems as cartResponse[]){
            let obj: cartRequestBody = {
                productId: item.productId,
                count: item.count
            };

            productIds.push(obj);

            totalPrice += (item.count * item.price);
        } 

        let orderResponse = await insertDoc(ORDER_COLLECITON_NAME, {products:productIds, totalPrice, userId: req.authInfo!.userId, address});
        
        if(orderResponse.code != 1) return res.status(500).send({msg: orderResponse.info});
        deleteDoc(CART_COLLECTION_NAME, {userId: req.authInfo!.userId});
        sendOrderMail({email: req.authInfo!.email, name: req.authInfo!.username}, response.info[0].cartItems, totalPrice, address);
        return res.status(200).send({msg: "Successfully placed order"});
    }catch(error){
        console.log('Error while checking out cart');
        console.log(error);
        handleError(req, res, next, error);
    }
})