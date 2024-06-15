import { WithId } from "mongodb";

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