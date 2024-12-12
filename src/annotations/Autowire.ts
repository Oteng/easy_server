import { EasyServe } from "../../index";

export const Autowire = (name: string, singleton = false) => {
  return (constructor: Function) => {
    if ( !singleton ) {
      EasyServe.setInjectable(name, constructor());
    }
  }
}