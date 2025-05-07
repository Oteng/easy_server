import {ValidatorErrorTemplate, ValidatorTemplate} from "../interfaces";

export class Validator {
    public static validate(value: any, template: ValidatorTemplate[]): Promise<ValidatorErrorTemplate[] | []> {
        return new Promise((resolve, reject) => {
            const problems: ValidatorErrorTemplate[] = [];
            template.forEach(item => {
                item.rules.forEach(rule => {
                    if (rule.toUpperCase() === 'REQUIRED') {
                        if (value[item.fieldName] === undefined) {
                            problems.push({
                                fieldName: item.fieldName,
                                msg: `${item.displayName} is required`
                            });
                        } else if (value[item.fieldName]?.length <= 0)
                            problems.push({
                                fieldName: item.fieldName,
                                msg: `${item.displayName} is required`
                            });
                    } else {
                        if (rule.toUpperCase().startsWith('MINLENGTH:')) {
                            const match = rule.toUpperCase().match(/^MINLENGTH:(\d+)$/)
                            if (match) {
                                if (value[item.fieldName]?.length < parseInt(match[1] || '')) {
                                    problems.push({
                                        fieldName: item.fieldName,
                                        msg: `${item.displayName} must be at least ${match[1]} characters or have ${match[1]} characters or more`
                                    });
                                }
                            }
                        }
                    }
                })
            })
            if (!problems.length) {
                resolve([]);
            } else reject(problems)
        })
    }
}