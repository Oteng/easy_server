import { EasyServe } from "../../index";

export const Autowire = (name: string) => {
  return (constructor: any) => {
    EasyServe.setInjectable(name, constructor.configure());
  }
}