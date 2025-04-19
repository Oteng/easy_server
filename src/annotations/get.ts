import { EasyServe } from "../../index";

export const GET = (url: string) =>{
  return (fn: any, _: ClassMethodDecoratorContext) => {
    EasyServe.getApp().get(url, fn);
  }
}