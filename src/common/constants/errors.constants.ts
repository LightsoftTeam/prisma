export enum ERROR_CODES {
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    PERSON_ALREADY_EXISTS = 'PERSON_ALREADY_EXISTS',
    INVALID_DOCUMENT_TYPE = 'INVALID_DOCUMENT_TYPE',
    TOTAL_INVALID = 'TOTAL_INVALID',
    STOCK_IS_NOT_ENOUGH = 'STOCK_IS_NOT_ENOUGH',
    CASH_BOX_IS_ALREADY_IN_THE_REQUESTED_STATUS = 'CASH_BOX_IS_ALREADY_IN_THE_REQUESTED_STATUS',
    LEGAL_NAME_REQUIRED = 'LEGAL_NAME_REQUIRED',
    GIVEN_NAMES_AND_LAST_NAME_REQUIRED = 'GIVEN_NAMES_AND_LAST_NAME_REQUIRED',
    PERMISSION_ALREADY_EXISTS = 'PERMISSION_ALREADY_EXISTS',
    A_USER_HAS_THE_ROLE = 'A_USER_HAS_THE_ROLE',
    PAYMENT_ITEMS_REQUIRED = 'PAYMENT_ITEMS_REQUIRED',
    CANT_UPDATE_PERMANENT_ROLE = 'CANT_UPDATE_PERMANENT_ROLE',
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
    [ERROR_CODES.LEGAL_NAME_REQUIRED]: {
        code: ERROR_CODES.LEGAL_NAME_REQUIRED,
        message: 'Legal name is required',
    },
    [ERROR_CODES.GIVEN_NAMES_AND_LAST_NAME_REQUIRED]: {
        code: ERROR_CODES.GIVEN_NAMES_AND_LAST_NAME_REQUIRED,
        message: 'Given names and last name are required',
    },
    [ERROR_CODES.PERMISSION_ALREADY_EXISTS]: {
        code: ERROR_CODES.PERMISSION_ALREADY_EXISTS,
        message: 'The permission already exists',
    },
    [ERROR_CODES.A_USER_HAS_THE_ROLE]: {
        code: ERROR_CODES.A_USER_HAS_THE_ROLE,
        message: 'A user has the role, you can not delete it',
    },
    [ERROR_CODES.PAYMENT_ITEMS_REQUIRED]: {
        code: ERROR_CODES.PAYMENT_ITEMS_REQUIRED,
        message: 'Payment items are required where a cash flow is generated',
    },
    [ERROR_CODES.CANT_UPDATE_PERMANENT_ROLE]: {
        code: ERROR_CODES.CANT_UPDATE_PERMANENT_ROLE,
        message: 'You can not update a permanent role',
    },
}