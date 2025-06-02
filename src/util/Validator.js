"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
class Validator {
    static validate(value, template) {
        return new Promise((resolve, reject) => {
            const problems = [];
            template.forEach(item => {
                item.rules.forEach(rule => {
                    switch (rule) {
                        case 'REQUIRED':
                            if (value[item.fieldName] === undefined) {
                                problems.push({
                                    fieldName: item.fieldName,
                                    msg: `${item.displayName} is required`
                                });
                            }
                            else if (value[item.fieldName].length <= 0)
                                problems.push({
                                    fieldName: item.fieldName,
                                    msg: `${item.displayName} is required`
                                });
                            break;
                        // case 'MINLENGTH[3]':
                        //   break;
                    }
                });
            });
            if (!problems.length) {
                resolve([]);
            }
            else
                reject(problems);
        });
    }
}
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map