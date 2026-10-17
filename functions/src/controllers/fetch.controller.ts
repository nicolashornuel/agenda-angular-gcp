import { CallableRequest, onCall } from 'firebase-functions/v2/https';
import { opts } from '../services/config.service';
import { tryCatch } from '../services/tryCatch.service';

export const onCallGetJson = onCall(opts, req => tryCatch(() => getJson(req)));
export const onCallGetText = onCall(opts, req => tryCatch(() => getText(req)));
export const onCallGetBlob = onCall(opts, req => tryCatch(() => getBlob(req)));

async function getJson(request: CallableRequest): Promise<any> {
  /* const response = await fetch(request.data.url, { method: 'GET' });
  return await response.json(); */
  const response = await fetch(request.data.url);

const body = await response.text();

console.log('URL appelée :', request.data.url);
console.log('Status HTTP :', response.status);
console.log('Content-Type :', response.headers.get('content-type'));
console.log('Réponse reçue :', body.slice(0, 500));

if (!response.ok) {
  throw new Error(`Erreur HTTP ${response.status}: ${body.slice(0, 200)}`);
}

try {
  return JSON.parse(body);
} catch (error) {
  console.error('La réponse reçue n’est pas du JSON valide.');
  throw error;
}
}
async function getText(request: CallableRequest): Promise<string> {
  const response = await fetch(request.data.url, { method: 'GET' });
  return await response.text();
}
async function getBlob(request: CallableRequest): Promise<Blob> {
  const response = await fetch(request.data.url, { method: 'GET' });
  return await response.blob();
}
