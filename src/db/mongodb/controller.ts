export async function insertDoc(collectionName: string, doc: any): Promise<dbResponse> {
    try{
        await global.mongodbConnection?.collection(collectionName).insertOne(doc);
        console.log('Document inserted successfully');
        return {code: 1, msg: 'Success'};
    }catch(error: any){
        console.log('Error while inserting documnet into mongodb');
        console.log(error);
        return {code: -1, msg: 'Failed', info: error.message};
    }
}

export async function getDoc(collectionName: string, parameters: [any]): Promise<dbResponse> {
    try{
        let data = await global.mongodbConnection?.collection(collectionName).findOne(...parameters);
        console.log('Document retrieved successfully');
        return {code: 1, msg: 'Success', info: data};
    }catch(error: any){
        console.log('Error while retrieving document');
        console.log(error);
        return {code: -1, msg: 'Failed', info: error.message};
    }
}

export async function getDocs(collectionName: string, parameters: [any]): Promise<dbResponse> {
    try{
        let data = await global.mongodbConnection?.collection(collectionName).find(...parameters).toArray();
        console.log('Document retrieved successfully');
        return {code: 1, msg: 'Success', info: data};
    }catch(error: any){
        console.log('Error while retrieving document');
        console.log(error);
        return {code: -1, msg: 'Failed', info: error.message};
    }
}

export async function updateDoc(collectionName: string, filter: any, update: any, upsertItem: boolean = false): Promise<dbResponse> {
    try{
        let data = await global.mongodbConnection?.collection(collectionName).findOneAndUpdate(filter, {$set: update}, {upsert: upsertItem});
        console.log('Document updated successfully');
        return {code: 1, msg: 'Success', info: data};
    }catch(error: any){
        console.log('Error while updating document');
        console.log(error);
        return {code: -1, msg: 'Failed', info: error.message};
    }
}

export async function deleteDoc(collectionName: string, filter: any): Promise<dbResponse> {
    try{
        let data = await global.mongodbConnection?.collection(collectionName).deleteOne(filter);
        console.log('Document deleted successfully');
        return {code: 1, msg: 'Success', info: data};
    }catch(error: any){
        console.log('Error while deleting document');
        console.log(error);
        return {code: -1, msg: 'Failed', info: error.message};
    }
}

export async function lookupDoc(collectionName_1: string, collectionName_2: string, filter: any): Promise<dbResponse> {
    try{
        let data = await global.mongodbConnection?.collection(collectionName_1).aggregate([{
            $match: filter
        },{
            $unwind: "$products"
        },{
            "$lookup":{
                "from": collectionName_2,
                localField: "products.productId",
                foreignField: "productId",
                as : "productDetails"
            }
        },
        {
            $unwind: "$productDetails"
        },{
            $group: {
                _id: "$_id",
                cartItems: {$push: {productId: "$productDetails.productId", count: "$products.count", title: "$productDetails.title", description: "$productDetails.description", image: "$productDetails.image", price: "$productDetails.price" }}
            }
        },
        {"$project": {_id :0, userId: 0}}
    ]).toArray();
        console.log('Document deleted successfully');
        return {code: 1, msg: 'Success', info: data};
    }catch(error: any){
        console.log('Error while deleting document');
        console.log(error);
        return {code: -1, msg: 'Failed', info: error.message};
    }
}