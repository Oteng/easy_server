"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectableFieldException = void 0;
class InjectableFieldException extends Error {
    constructor(errorCode) {
        super(`You can only inject an autowired class into a static field and the @Inject decorator should be applyed to the class`);
        this.errorCode = errorCode;
        this.name = "InjectableException";
    }
}
exports.InjectableFieldException = InjectableFieldException;
//# sourceMappingURL=InjectableFieldException.js.map