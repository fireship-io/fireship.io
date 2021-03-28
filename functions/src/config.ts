const cors = require('cors')({ origin: true });
import * as admin from 'firebase-admin';
admin.initializeApp();

import * as functions from 'firebase-functions';
export const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

// ENV
export const stripeTestKey = functions.config().stripe.testkey;
export const stripeSigningSecret = functions.config().stripe.signing_secret;
export const stripeSecret = functions.config().stripe.secret;
export const lifetimeSKU = functions.config().stripe.lifetimesku;


// Stripe
import * as Stripe from 'stripe'; 
export const stripe = new Stripe(stripeSecret);
