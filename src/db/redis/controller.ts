export async function setJsonValue(key: string, jsonKey: string, value: any): Promise<functionResponse> {
    try{
        let exists = null; 
        try{
            exists = await global.redisConnection.sendCommand(['JSON.GET', key, jsonKey]);
        }catch(error: any){
            console.log(`Key Does not exists hence creating new key in JSON`);
            console.log(error);
        }
        let response = null;
        if(!exists){
            response = await global.redisConnection.sendCommand(['JSON.SET', key, jsonKey, `[${value}]`]);
        }else{
            response = await global.redisConnection.sendCommand(['JSON.ARRAPPEND', key, jsonKey, value]);
        }
        return {code: 1, msg: 'Success', info: response};
    }catch(error: any){
        console.log('Error while setting json value');
        console.log(error);
        return {code : -1, msg: 'Failed', info: error.message};
    }
}

export async function getJsonValue(key: string, jsonKey: string): Promise<functionResponse> {
    try{
        let response = await global.redisConnection.sendCommand(['JSON.GET', key, jsonKey]);
        return {code: 1, msg: 'Success', info: response};
    }catch(error: any){
        console.log('Error while getting json value');
        console.log(error);
        return {code : -1, msg: 'Failed', info: error.message};
    }
}