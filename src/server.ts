import path from "path";

const express = require('express');
require('dotenv').config({path: './server.properties'});

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(process.env.PORT, (error: any) => {
    if(error){
        console.log('Error while starting the server on port ' + process.env.PORT);
        console.log(error);
        process.exit(1);
    }

    console.log('Server Up and Running on port '+ process.env.PORT);
})
