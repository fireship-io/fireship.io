import * as admin from 'firebase-admin';
export const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

