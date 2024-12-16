export class InjectableFieldException extends Error {
  constructor(public errorCode?: number) {
    super(`You can only inject an autowired class into a static field and the @Inject decorator should be applyed to the class`);
    this.name = "InjectableException";
  }
}