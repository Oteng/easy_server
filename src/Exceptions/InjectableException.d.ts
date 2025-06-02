export declare class InjectableException extends Error {
    errorCode?: number | undefined;
    constructor(name: string, errorCode?: number | undefined);
}
