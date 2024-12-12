export class InjectableException extends Error {
  constructor(name: string, public errorCode?: number) {
    super(`The class ${ name } you are trying to inject has not been autowired. ${ errorCode ? 'ERROR CODE:' + errorCode : '' }`);
    this.name = "InjectableException";
  }
}