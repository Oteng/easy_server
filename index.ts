import { ControllerConfig, EasyServeConfig } from "@/interfaces";
import * as fs from 'fs';
import ExpressApp, { Express } from "express";
import path from "node:path";
import * as swaggerUi from 'swagger-ui-express';
import * as SwaggerSpec from './swaggerSpec.json'
import cors from "cors"
import helmet from "helmet";
// import { ErrorRequestHandler, Express } from "express-serve-static-core";
// import { DBConnector } from "../src/model/BaseModel";


export class EasyServe {
  private static readonly app: Express = ExpressApp();

  public static getApp() {
    if ( EasyServe.app == null )
      throw new TypeError("EasyServe has not been instantiated")
    return EasyServe.app
  }

  constructor(option: EasyServeConfig) {
    const corsOptions = {
      origin: '*',
      optionsSuccessStatus: 200,
    };
    EasyServe.app.use(cors(corsOptions));
    EasyServe.app.use(ExpressApp.json())
    EasyServe.app.listen(option.port)

    EasyServe.app.use(helmet())
    EasyServe.app.disable('x-powered-by')

    // //connect to the database
    // if ( option.dbConfigPath ) {
    //   let rootPath = process.cwd();
    //   import(path.join(rootPath, option.dbConfigPath)).then(async dbConfig => {
    //     const dbConnector = new DBConnector(dbConfig)
    //     await dbConnector.connect();
    //     this.setControllerConfig(option.controller)
    //     this.set500Responds(option.errorHandler)
    //   })
    // } else {
    //   this.setControllerConfig(option.controller)
    //   this.set500Responds(option.errorHandler)
    // }

    this.setControllerConfig(option.controller)

    console.log(`Application started on http://localhost:${ option.port }`)

    //log every route that get called
    if ( process.env.NODE_ENV !== 'production' ) {
      EasyServe.app.use((req, _, next) => {
        console.log(`${ req.method.toUpperCase() }: ${ req.path }`)
        next();
      })
    }

    //setup swagger if object is not empty
    if ( option.swagger != null ) {
      EasyServe.app.use(`${ option.swagger.url || '/api/doc' }`, swaggerUi.serve, swaggerUi.setup(option.swagger.spec || SwaggerSpec, option.swagger.ui))
    }

  }

  public setControllerConfig(option: ControllerConfig) {
    let rootPath = process.cwd();

    let allRoutesAdded: number = 0;

    let controllers = fs.readdirSync(option.root);
    for ( let controller of controllers ) {
      if ( !( controller.endsWith("js") || controller.endsWith("ts") ) )
        continue;
      let nameOfController = controller.split('.')[ 0 ];
      if ( nameOfController == undefined )
        continue;

      allRoutesAdded++;
      // import the class will run the decorator which will setup the route
      import(path.join(rootPath, option.root, nameOfController)).then(_ => {
        allRoutesAdded--;
      }).catch(err => {
        console.log(err);
      });
    }
    this.reSetTimeOutCheck(allRoutesAdded)
  }


  private reSetTimeOutCheck(allRoutesAdded: number) {
    setTimeout(() => {
      if ( allRoutesAdded <= 1 )
        this.set404Responds()
      else this.reSetTimeOutCheck(allRoutesAdded);
    }, 100)
  }

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