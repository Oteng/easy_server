"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectableException = void 0;
class InjectableException extends Error {
    constructor(name, errorCode) {
        super(`The class ${name} you are trying to inject has not been autowired. ${errorCode ? 'ERROR CODE:' + errorCode : ''}`);
        this.errorCode = errorCode;
        this.name = "InjectableException";
    }
}
exports.InjectableException = InjectableException;
//# sourceMappingURL=InjectableException.js.map