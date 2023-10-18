import {CallableRequest} from 'firebase-functions/v2/https';
import {httpsErrorsInternal, httpsErrorsUnauthenticated} from './error.service';
import {logger} from 'firebase-functions/v2';

export function tryCatch(request: CallableRequest, callback: () => Promise<any>): Promise<any> {
  try {
    const uid = request.auth?.uid;
    if (!uid || typeof uid !== 'string') {
      httpsErrorsUnauthenticated();
    } else {
      return callback();
    }
  } catch (error: any) {
    logger.error(error);
    httpsErrorsInternal();
  }
}
