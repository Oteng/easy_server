import { EasyServe } from "../../index";

export const DELETE = (url: string) =>{
  return (fn: any, _: ClassMethodDecoratorContext) => {
    EasyServe.getApp().delete(url, fn);
  }
}