import { CallableRequest, onCall } from 'firebase-functions/v2/https';
import { opts } from '../services/config.service';
import { tryCatch } from '../services/tryCatch.service';

export const onCallGetJson = onCall(opts, req => tryCatch(() => getJson(req)));
export const onCallGetText = onCall(opts, req => tryCatch(() => getText(req)));
export const onCallGetBlob = onCall(opts, req => tryCatch(() => getBlob(req)));

async function getJson(request: CallableRequest): Promise<any> {
  const response = await fetch(request.data.url, { method: 'GET' });
  return await response.json();
}
async function getText(request: CallableRequest): Promise<string> {
  const response = await fetch(request.data.url, { method: 'GET' });
  return await response.text();
}
async function getBlob(request: CallableRequest): Promise<Blob> {
  const response = await fetch(request.data.url, { method: 'GET' });
  return await response.blob();
}
