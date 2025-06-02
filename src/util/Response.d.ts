import { Response } from "express-serve-static-core";
export declare class ESResponse {
    _res: Response;
    private res;
    private msg;
    private data;
    private status?;
    constructor(_res: Response);
    setMsg(message: string | unknown): ESResponse;
    sendError(message: string | unknown): void;
    setData(data: any): this;
    setStatus(status: string): this;
    send(status?: number): void;
    faild(): void;
}
