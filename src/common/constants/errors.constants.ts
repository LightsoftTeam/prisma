export enum ERROR_CODES {
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    PERSON_ALREADY_EXISTS = 'PERSON_ALREADY_EXISTS',
    INVALID_DOCUMENT_TYPE = 'INVALID_DOCUMENT_TYPE',
}

export const ERRORS = {
    [ERROR_CODES.USER_ALREADY_EXISTS]: {
        code: ERROR_CODES.USER_ALREADY_EXISTS,
        message: 'The user already exists',
    },
    [ERROR_CODES.PERSON_ALREADY_EXISTS]: {
        code: ERROR_CODES.PERSON_ALREADY_EXISTS,
        message: 'The person already exists',
    },
    [ERROR_CODES.INVALID_DOCUMENT_TYPE]: {
        code: ERROR_CODES.INVALID_DOCUMENT_TYPE,
        message: 'Invalid document type',
    },
}