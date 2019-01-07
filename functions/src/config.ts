export const functionsURL = 'https://us-central1-fireship-dev-17429.cloudfunctions.net'


import * as admin from 'firebase-admin';
export const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

