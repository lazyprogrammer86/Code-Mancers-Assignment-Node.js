interface dbResponse {
    code : number
    msg: string
    info?: any
}

interface functionResponse {
    code : number
    msg: string
    info?: any
}

interface productBody{
    productId: string
    image: string
    title: string
    description: string
    price: number
}

interface cartRequestBody{
    productId: string
    count: number
};

interface cartResponse extends productBody{
    count: number
}