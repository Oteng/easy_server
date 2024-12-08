import { EasyServe } from "../../index";

export const HEAD = (url: string) =>{
  return (fn: any, _: ClassMethodDecoratorContext) => {
    EasyServe.getApp().head(url, fn);
  }
}