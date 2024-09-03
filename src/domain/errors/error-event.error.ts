import { ErrorEventPayload } from "../entities";

export class ErrorEvent extends Error {
    code: number;
    payload: ErrorEventPayload;
    constructor(message: string, code: number, payload: ErrorEventPayload) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.payload = payload;
        Error.captureStackTrace(this, this.constructor);
    }
}