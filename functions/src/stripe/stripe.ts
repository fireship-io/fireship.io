import * as functions from 'firebase-functions';
import { attachSource, getUID, getVal } from './helpers';



export const stripeSetSource = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    const sourceId = getVal(data, 'sourceId');
    return await attachSource(uid, sourceId);
});

export const stripeCreateCharge = functions.https.onCall( async (data, context) => {
    const uid = getUID(context);
    const sourceId = getVal(data, 'sourceId');
    return await attachSource(uid, sourceId);
});
  
  

export const tester = functions.https.onRequest((req, res) => {
    const uid = 'test';
});
  