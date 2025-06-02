"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyServe = void 0;
const fs = __importStar(require("fs"));
const express_1 = __importDefault(require("express"));
const node_path_1 = __importDefault(require("node:path"));
const swaggerUi = __importStar(require("swagger-ui-express"));
const SwaggerSpec = __importStar(require("./swaggerSpec.json"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const InjectableException_1 = require("./src/Exceptions/InjectableException");
// import { ErrorRequestHandler, Express } from "express-serve-static-core";
// import { DBConnector } from "../src/model/BaseModel";
class EasyServe {
    constructor(option) {
        this.options = option;
        if (option.key)
            EasyServe.key = option.key;
        else
            throw new Error("JWT ENCRYPTION KEY not provied");
    }
    static getInjectable(name) {
        if (EasyServe.inject[name] == null)
            throw new InjectableException_1.InjectableException(name);
        return EasyServe.inject[name];
    }
    static setInjectable(name, fn) {
        return EasyServe.inject[name] = fn;
    }
    static getApp() {
        if (EasyServe.app == null)
            throw new TypeError("EasyServe has not been instantiated");
        return EasyServe.app;
    }
    async start() {
        //let us set the logger before anything runs
        if (!this.options.logger) {
            EasyServe.logger = (await Promise.resolve().then(() => __importStar(require("./src/util/Logger")))).default;
            EasyServe.logger.default;
        }
        else
            EasyServe.logger = this.options.logger;
        const corsOptions = {
            origin: '*',
            optionsSuccessStatus: 200,
        };
        EasyServe.app.use((0, cors_1.default)(corsOptions));
        EasyServe.app.use(express_1.default.json({
            limit: this.options.payloadLimit || '1mb'
        }));
        this.serverInstance = EasyServe.app.listen(this.options.port || 8018);
        EasyServe.app.use((0, helmet_1.default)());
        EasyServe.app.disable('x-powered-by');
        //TODO: Need to load autowired classes before classes that inject them are loaded.
        //this can be done better using webpack build or other building tools. or we will just have to build out own bundling tool
        await this.loadAutoWire(this.options.injectables);
        await this.setControllerConfig(this.options.controller);
        EasyServe.logger.info(`Application started on http://localhost:${this.options.port}`);
        //log every route that get called
        if (process.env.NODE_ENV !== 'production') {
            EasyServe.app.use((req, _, next) => {
                EasyServe.logger.info(`${req.method.toUpperCase()}: ${req.path}`);
                next();
            });
        }
        //setup swagger if object is not empty
        if (this.options.swagger != null) {
            EasyServe.app.use(`${this.options.swagger.url || '/api/doc'}`, swaggerUi.serve, swaggerUi.setup(this.options.swagger.spec || SwaggerSpec, this.options.swagger.ui));
        }
        this.set404Responds();
    }
    stopServer() {
        this.serverInstance?.close();
    }
    async setControllerConfig(option) {
        let rootPath = process.cwd();
        // let allRoutesAdded: number = 0;
        let controllers = fs.readdirSync(node_path_1.default.join(rootPath, option.root));
        for (let controller of controllers) {
            if (!(controller.endsWith("js") || controller.endsWith("ts")))
                continue;
            let nameOfController = controller.split('.')[0];
            if (nameOfController == undefined)
                continue;
            // allRoutesAdded++;
            await Promise.resolve(`${node_path_1.default.join(rootPath, option.root, nameOfController)}`).then(s => __importStar(require(s)));
            // allRoutesAdded--;
        }
        // this.reSetTimeOutCheck(allRoutesAdded)
    }
    set404Responds(option) {
        EasyServe.app.use((_, res, __) => {
            res.status(404).json(option || "Sorry can't find that!");
        });
    }
    // private reSetTimeOutCheck(allRoutesAdded: number) {
    //     setTimeout(() => {
    //         if (allRoutesAdded <= 1)
    //             this.set404Responds()
    //         else this.reSetTimeOutCheck(allRoutesAdded);
    //     }, 100)
    // }
    async loadAutoWire(option) {
        /**
         * Load all classes that are in the autowired folder to set them up
         * before any other thing else can run.
         * This design should be replaced with a problem build system that will do these setups
         */
        let rootPath = process.cwd();
        let autoWiredClasses = fs.readdirSync(node_path_1.default.join(rootPath, option.root));
        for (let autoWiredClass of autoWiredClasses) {
            if (!(autoWiredClass.endsWith("js") || autoWiredClass.endsWith("ts")))
                continue;
            let nameOfClass = autoWiredClass.split('.')[0];
            if (nameOfClass == undefined)
                continue;
            await Promise.resolve(`${node_path_1.default.join(rootPath, option.root, nameOfClass)}`).then(s => __importStar(require(s)));
        }
    }
}
exports.EasyServe = EasyServe;
EasyServe.app = (0, express_1.default)();
EasyServe.inject = {};
//# sourceMappingURL=index.js.map