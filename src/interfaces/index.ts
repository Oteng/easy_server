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

export interface JWTPayload extends Record<string, any>{
  type: string,
  username: string,
  userId: number,
  permissions?: { [ key: string ]: string }
}

export interface EasyServeConfig {
  port?: string | number,
  controller: ControllerConfig,
  swagger?: SwaggerConfig
  injectables: { root: string },
  payloadLimit?: string,
  logger?: any,
  key: string | undefined,
  service: string
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
