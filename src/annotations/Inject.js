"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inject = void 0;
const index_1 = require("../../index");
const InjectableFieldException_1 = require("../Exceptions/InjectableFieldException");
const Inject = (name, property) => {
    return (fn, propertyKey) => {
        if (propertyKey.kind !== 'class') {
            throw new InjectableFieldException_1.InjectableFieldException();
        }
        Object.defineProperty(fn, property, {
            value: index_1.EasyServe.getInjectable(name),
            writable: false
        });
    };
};
exports.Inject = Inject;
//# sourceMappingURL=Inject.js.map