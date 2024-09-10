export enum ERROR_CODES {
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    PERSON_ALREADY_EXISTS = 'PERSON_ALREADY_EXISTS',
    INVALID_DOCUMENT_TYPE = 'INVALID_DOCUMENT_TYPE',
    TOTAL_INVALID = 'TOTAL_INVALID',
    STOCK_IS_NOT_ENOUGH = 'STOCK_IS_NOT_ENOUGH',
    CASH_BOX_IS_ALREADY_IN_THE_REQUESTED_STATUS = 'CASH_BOX_IS_ALREADY_IN_THE_REQUESTED_STATUS',
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
    [ERROR_CODES.TOTAL_INVALID]: {
        code: ERROR_CODES.TOTAL_INVALID,
        message: 'Invalid total',
    },
    [ERROR_CODES.STOCK_IS_NOT_ENOUGH]: {
        code: ERROR_CODES.STOCK_IS_NOT_ENOUGH,
        message: 'Stock is not enough',
    },
    [ERROR_CODES.CASH_BOX_IS_ALREADY_IN_THE_REQUESTED_STATUS]: {
        code: ERROR_CODES.CASH_BOX_IS_ALREADY_IN_THE_REQUESTED_STATUS,
        message: 'Cash box is already in the requested status',
    },
}