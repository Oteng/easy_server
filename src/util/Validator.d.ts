import { ValidatorErrorTemplate, ValidatorTemplate } from "../interfaces";
export declare class Validator {
    static validate(value: any, template: ValidatorTemplate[]): Promise<ValidatorErrorTemplate[] | []>;
}
