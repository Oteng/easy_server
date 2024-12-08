import { EasyServe } from "../../index";

export const PUT = (url: string) =>{
  return (fn: any, _: ClassMethodDecoratorContext) => {
    EasyServe.getApp().put(url, fn);
  }
}