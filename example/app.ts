import { EasyServe } from "easy_server";
import * as process from "node:process";

const easyServe = new EasyServe({
    port: process.env.PORT || 9000,
    controller: {root: "./src/controller"}, // the folder where your controllers are located, currently sub folders are not supported
    injectables: {root: "./src/db"}, // the folder where your injectables/services are located, currently sub folders are not supported
    payloadLimit: "2mb",
    key: process.env.JWT_KEY,
    service: process.env.SERVICE || 'DEFAULT', 
    cors: {origin: '*', methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], credentials: true},
    behindProxy: true
})

easyServe.start().then(_ => {
    /**
     * You can put any code that needs to run after the server starts here
     */
})