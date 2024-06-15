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

export async function getDocs(collectionName: string, parameters: [any]): Promise<dbResponse> {
    try{
        console.log(parameters);
        let data = await global.mongodbConnection?.collection(collectionName).find(...parameters).toArray();
        console.log(data);
        console.log('Document retrieved successfully');
        return {code: 1, msg: 'Success', info: data};
    }catch(error: any){
        console.log('Error while retrieving document');
        console.log(error);
        return {code: -1, msg: 'Failed', info: error.message};
    }
}

export async function updateDoc(collectionName: string, filter: any, update: any): Promise<dbResponse> {
    try{
        let data = await global.mongodbConnection?.collection(collectionName).findOneAndUpdate(filter, {$set: update});
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