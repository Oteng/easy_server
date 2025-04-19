import { EasyServe } from "../../index";

export const PATCH = (url: string) =>{
  return (fn: any, _: ClassMethodDecoratorContext) => {
    EasyServe.getApp().patch(url, fn);
  }
}