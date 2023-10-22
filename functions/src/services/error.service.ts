import { HttpsError } from 'firebase-functions/v2/https';

/**
 * Throw a success error
 *
 * @param message The message that describes this error
 * @param minifiedMessage The minified message for translation purpose
 * @returns any
 */
function httpsSuccessfull(
  message: string = 'everything fine',
  minifiedMessage: string = 'ok',
  data?: any
): any {
  return {code: 'OK', message, details: {minifiedMessage}, data};

  // Todo: Should use the below code instead of a simple return.
  // But this send an internal error 'Response is missing data field.'
  // throw new functions.https.HttpsError('ok', message);
}

/**
 * Throw a unauthenticated error
 *
 * @param message The message that describes this error
 * @param minifiedMessage The minified message for translation purpose
 * @returns nothing
 */
function httpsErrorsUnauthenticated(
  message: string = 'user is unauthenticated',
  minifiedMessage: string = 'error'
): never {
  throw new HttpsError('unauthenticated', message, {
    minifiedMessage
  });
}

/**
 * Throw a unauthorized error
 *
 * @param message The message that describes this error
 * @param minifiedMessage The minified message for translation purpose
 * @returns nothing
 */
function httpsErrorsPermissionDenied(
  message: string = 'user is unauthorized',
  minifiedMessage: string = 'error'
): never {
  throw new HttpsError('permission-denied', message, {
    minifiedMessage
  });
}

/**
 * Throw a invalid argument error
 *
 * @param message The message that describes this error
 * @param minifiedMessage The minified message for translation purpose
 * @returns nothing
 */
function httpsErrorsInvalidArgument(
  message: string = 'one of params is invalid',
  minifiedMessage: string = 'error'
): never {
  if (message) {
    message += ' param is invalid';
  }

  throw new HttpsError('invalid-argument', message, {
    minifiedMessage
  });
}

/**
 * Throw a internal error
 *
 * @param message The message that describes this error
 * @param minifiedMessage The minified message for translation purpose
 * @returns nothing
 */
function httpsErrorsInternal(
  message: string = 'server error',
  minifiedMessage: string = 'error'
): never {
  throw new HttpsError('internal', message, {
    minifiedMessage
  });
}

/**
 * Throw an aborted error
 *
 * @param message The message that describes this error
 * @param minifiedMessage The minified message for translation purpose
 * @returns nothing
 */
function httpsErrorsAborted(
  message: string = 'server aborted',
  minifiedMessage: string = 'error'
): never {
  throw new HttpsError('aborted', message, {
    minifiedMessage
  });
}

/**
 * Throw a unknow error
 *
 * @param message The message that describes this error
 * @param minifiedMessage The minified message for translation purpose
 * @returns nothing
 */
function httpsErrorsUnknown(
  message: string = 'unknown error',
  minifiedMessage: string = 'error'
): never {
  throw new HttpsError('unknown', message, {
    minifiedMessage
  });
}

/**
 * Throw a not found error
 *
 * @param message The message that describes this error
 * @param minifiedMessage The minified message for translation purpose
 * @returns nothing
 */
function httpsNotFound(
  message: string = 'not found unknown',
  minifiedMessage: string = 'not found'
): never {
  throw new HttpsError('not-found', message, {
    minifiedMessage
  });
}

/**
 * Throw already exist error
 *
 * @param message The message that describes this error
 * @param minifiedMessage The minified message for translation purpose
 * @returns nothing
 */
function httpsAlreadyExist(
  message: string = 'not found unknown',
  minifiedMessage: string = 'not found'
): never {
  throw new HttpsError('already-exists', message, {
    minifiedMessage
  });
}
/**
 * Throw deadline exceeded error
 *
 * @param message The message that describes this error
 * @param minifiedMessage The minified message for translation purpose
 * @returns nothing
 */
function httpsDeadlineExceeded(
  message: string = 'deadline exceeded',
  minifiedMessage: string = 'deadline exceeded'
): never {
  throw new HttpsError('deadline-exceeded', message, {
    minifiedMessage
  });
}

export {
  httpsSuccessfull,
  httpsErrorsUnauthenticated,
  httpsErrorsPermissionDenied,
  httpsErrorsInvalidArgument,
  httpsErrorsInternal,
  httpsErrorsAborted,
  httpsErrorsUnknown,
  httpsNotFound,
  httpsAlreadyExist,
  httpsDeadlineExceeded
};