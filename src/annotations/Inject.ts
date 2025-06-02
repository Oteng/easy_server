import { EasyServe } from "../../index";
import { InjectableFieldException } from "../Exceptions/InjectableFieldException";


export const Inject = (name: string, property: string) => {
  return (fn: any, propertyKey: any) => {

    if(propertyKey.kind !== 'class'){
      throw new InjectableFieldException()
    }

    Object.defineProperty(fn, property, {
      value: EasyServe.getInjectable(name),
      writable: false
    })

  }
}

