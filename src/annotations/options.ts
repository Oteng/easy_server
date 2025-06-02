import { EasyServe } from "../../index";

export const OPTIONS = (url: string) =>{
  return (fn: any, _: ClassMethodDecoratorContext) => {
    EasyServe.getApp().options(url, fn);
  }
}