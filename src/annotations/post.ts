import { EasyServe } from "../../index";

export const POST = (url: string) =>{
  return (fn: any, _: ClassMethodDecoratorContext) => {
    EasyServe.getApp().post(url, fn);
  }
}