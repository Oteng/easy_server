"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESResponse = void 0;
class ESResponse {
    constructor(_res) {
        this._res = _res;
        this.status = "success";
        this.res = _res;
        return this;
    }
    setMsg(message) {
        this.msg = message;
        return this;
    }
    sendError(message) {
        this.msg = message;
        this.res.status(500);
        this.res.send();
    }
    setData(data) {
        this.data = data;
        return this;
    }
    setStatus(status) {
        this.status = status;
        return this;
    }
    send(status = 200) {
        this.res.status(status);
        this.res.json({
            status: this.status,
            msg: this.msg,
            data: this.data
        });
    }
    faild() {
        this.status = "false";
        return this.send();
    }
}
exports.ESResponse = ESResponse;
//# sourceMappingURL=Response.js.map