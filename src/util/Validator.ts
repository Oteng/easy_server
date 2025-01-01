import { ValidatorErrorTemplate, ValidatorTemplate } from "../interfaces";

export class Validator {
  public static validate(value: any, template: ValidatorTemplate[]): Promise<ValidatorErrorTemplate[] | []> {
    return new Promise((resolve, reject) => {
      const problems: ValidatorErrorTemplate[] = [];
      template.forEach(item => {
        item.rules.forEach(rule => {
          switch ( rule ) {
            case 'REQUIRED':
              if ( value[ item.fieldName ] === undefined ) {
                problems.push({
                  fieldName: item.fieldName,
                  msg: `${ item.displayName } is required`
                });
              } else if ( value[ item.fieldName ].length <= 0 )
                problems.push({
                  fieldName: item.fieldName,
                  msg: `${ item.displayName } is required`
                });
              break;
            // case 'MINLENGTH[3]':
            //   break;
          }
        })
      })
      if ( !problems.length ) {
        resolve([]);
      } else reject(problems)

    })
  }
}