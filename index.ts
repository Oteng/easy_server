import {ControllerConfig, EasyServeConfig, Injectable} from "./src/interfaces";
import * as fs from 'fs';
import ExpressApp, {Express} from "express";
import path from "node:path";
import * as swaggerUi from 'swagger-ui-express';
import * as SwaggerSpec from './swaggerSpec.json'
import cors from "cors"
import helmet from "helmet";
import {InjectableException} from "./src/Exceptions/InjectableException";
// import { ErrorRequestHandler, Express } from "express-serve-static-core";
// import { DBConnector } from "../src/model/BaseModel";


export class EasyServe {
    private static readonly app: Express = ExpressApp();
    private static inject: { [key: string]: Injectable } = {};
    private options: EasyServeConfig;
    private serverInstance: any;


    public static getInjectable(name: string): Injectable {
        if (EasyServe.inject[name] == null)
            throw new InjectableException(name)
        return EasyServe.inject[name];
    }

    public static setInjectable(name: string, fn: Injectable): Injectable {
        return EasyServe.inject[name] = fn;
    }


    public static getApp() {
        if (EasyServe.app == null)
            throw new TypeError("EasyServe has not been instantiated")
        return EasyServe.app
    }

    public async start() {
        const corsOptions = {
            origin: '*',
            optionsSuccessStatus: 200,
        };
        EasyServe.app.use(cors(corsOptions));
        EasyServe.app.use(ExpressApp.json({
            limit: this.options.payloadLimit || '1mb'
        }))
        this.serverInstance = EasyServe.app.listen(this.options.port || 8018)

        EasyServe.app.use(helmet())
        EasyServe.app.disable('x-powered-by')

        //TODO: Need to load autowired classes before classes that inject them are loaded.
        //this can be done better using webpack build or other building tools. or we will just have to build out own bundling tool
        await this.loadAutoWire(this.options.injectables);
        await this.setControllerConfig(this.options.controller);

        console.log(`Application started on http://localhost:${this.options.port}`)

        //log every route that get called
        if (process.env.NODE_ENV !== 'production') {
            EasyServe.app.use((req, _, next) => {
                console.log(`${req.method.toUpperCase()}: ${req.path}`)
                next();
            })
        }

        //setup swagger if object is not empty
        if (this.options.swagger != null) {
            EasyServe.app.use(`${this.options.swagger.url || '/api/doc'}`, swaggerUi.serve, swaggerUi.setup(this.options.swagger.spec || SwaggerSpec, this.options.swagger.ui))
        }

        this.set404Responds();
    }

    public stopServer(){
        this.serverInstance?.close();
    }

    constructor(option: EasyServeConfig) {
        this.options = option;
    }

    private async loadAutoWire(option: { root: string }): Promise<void> {
        /**
         * Load all classes that are in the autowired folder to set them up
         * before any other thing else can run.
         * This design should be replaced with a problem build system that will do these setups
         */
        let rootPath = process.cwd();
        let autoWiredClasses = fs.readdirSync(path.join(rootPath, option.root));
        for (let autoWiredClass of autoWiredClasses) {
            if (!(autoWiredClass.endsWith("js") || autoWiredClass.endsWith("ts")))
                continue;
            let nameOfClass = autoWiredClass.split('.')[0];
            if (nameOfClass == undefined)
                continue;
            await import(path.join(rootPath, option.root, nameOfClass));
        }
    }

    public async setControllerConfig(option: ControllerConfig) {
        let rootPath = process.cwd();

        // let allRoutesAdded: number = 0;

        let controllers = fs.readdirSync(path.join(rootPath, option.root));
        for (let controller of controllers) {
            if (!(controller.endsWith("js") || controller.endsWith("ts")))
                continue;
            let nameOfController = controller.split('.')[0];
            if (nameOfController == undefined)
                continue;

            // allRoutesAdded++;
            await import(path.join(rootPath, option.root, nameOfController))
            // allRoutesAdded--;

        }
        // this.reSetTimeOutCheck(allRoutesAdded)
    }


    // private reSetTimeOutCheck(allRoutesAdded: number) {
    //     setTimeout(() => {
    //         if (allRoutesAdded <= 1)
    //             this.set404Responds()
    //         else this.reSetTimeOutCheck(allRoutesAdded);
    //     }, 100)
    // }

    public set404Responds(option?: string) {
        EasyServe.app.use((_, res, __) => {
            res.status(404).json(option || "Sorry can't find that!")
        })
    }

    // public set500Responds(option: ErrorConfig) {
    //   const errorHandler500: ErrorRequestHandler = (err: any, _, res, next) => {
    //     /**
    //      * process all function in option before ending the request or passing it to express if the header is already sent
    //      */
    //     for ( let fn of option.fn ) {
    //       fn(err.stack, option.message)
    //     }
    //
    //     if ( res.headersSent ) {
    //       return next(err)
    //     }
    //
    //     return res.status(500).send('Something broke!')
    //   };
    //
    //   EasyServe.app.use(errorHandler500)
    // }
}