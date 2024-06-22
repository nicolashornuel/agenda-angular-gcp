import { HttpsOptions } from 'firebase-functions/v2/https';

// region firestore nam5
// Zones multirégionales : eur3 (europe-west1) ou nam5  (us-central1)
// region: 'europe-west1',
//cors: [/firebase\.com$/, "flutter.com"]
export const opts: HttpsOptions = {
    cors: true
};