import {Response} from "express-serve-static-core";


export class ESResponse {
    private res: Response;
    private msg: unknown;
    private data: any;
    private status?: string = "success";

    constructor(public _res: Response) {
        this.res = _res;
        return this;
    }

    public setMsg(message: string | unknown): ESResponse {
        this.msg = message;
        return this;
    }

    public sendError(message: string | unknown): void {
        this.msg = message;
        this.res.status(500);
        this.res.send()
    }

    public setData(data: any) {
        this.data = data;
        return this;
    }

    public setStatus(status: string) {
        this.status = status;
        return this;
    }

    public send(status = 200) {
        this.res.status(status);
        this.res.json(
            {
                status: this.status,
                msg: this.msg,
                data: this.data
            }
        )
    }

    public faild() {
        this.status = "false";
        return this.send()
    }
}