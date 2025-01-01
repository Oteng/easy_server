import { SwaggerUiOptions } from "swagger-ui-express";

export interface ESResponseObject<T> {
  status: string;
  msg: string;
  data: T | null;
}

export interface ValidatorTemplate {
  fieldName: string;
  displayName?: string;
  rules: string[] // ('REQUIRED' | 'MINLENGTH[*]')[]
}

export interface ValidatorErrorTemplate {
  fieldName: string;
  msg: string;
}

export interface JWTPayload {
  type: string,
  username: string,
  userId: number
}

export interface EasyServeConfig {
  port?: string | number,
  controller: ControllerConfig,
  swagger?: SwaggerConfig
  injectables: { root: string }
}

export interface SwaggerConfig {
  url?: string
  spec?: any
  ui?: SwaggerUiOptions
}

export interface ControllerConfig {
  root: string
}

export interface Injectable {
}

export interface ValidatorTemplate {
  fieldName: string;
  displayName?: string;
  rules: string[] // ('REQUIRED' | 'MINLENGTH[*]')[]
}
