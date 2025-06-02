import { ControllerConfig, EasyServeConfig, Injectable } from "./src/interfaces";
import ExpressApp from "express";
export declare class EasyServe {
    private static readonly app;
    private static inject;
    static logger: any;
    private options;
    private serverInstance;
    static key: string;
    constructor(option: EasyServeConfig);
    static getInjectable(name: string): Injectable;
    static setInjectable(name: string, fn: Injectable): Injectable;
    static getApp(): ExpressApp.Express;
    start(): Promise<void>;
    stopServer(): void;
    setControllerConfig(option: ControllerConfig): Promise<void>;
    set404Responds(option?: string): void;
    private loadAutoWire;
}
