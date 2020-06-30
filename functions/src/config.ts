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

export const stripeProducts = {
    sku_Ebp0C4S9tei5CO: {
      id: 'proLifetime',
      sku: 'sku_Ebp0C4S9tei5CO',
      price: 30000,
      description: 'Fireship.io Lifetime Access 🦄',
    },
    sku_FJCsh7mvjI83Kz: {
      id: 'flutterFirebase',
      sku: 'sku_FJCsh7mvjI83Kz',
      description: 'The Flutter Firebase Course 🐦',
      price: 1900,
    },
    sku_FJEdgiT5ZF8bCQ: {
      id: 'stripePayments',
      sku: 'sku_FJEdgiT5ZF8bCQ',
      description: 'Stripe Payments Course 💰',
      price: 1900,
    },
    sku_FJEdx5Tz9dPrvm: {
      id: 'firestoreDataModeling',
      sku: 'sku_FJEdx5Tz9dPrvm',
      description: 'Firestore Data Modeling Course 🔥',
      price: 1900,
    },
    sku_FSAhASTSPQb1oh: {
      id: 'ionic',
      sku: 'sku_FSAhASTSPQb1oh',
      description: 'Ionic 4 (Angular) Master Course 📱',
      price: 1900,
    },
    sku_Fn7Ojng8TLwnC4: {
      id: 'angular',
      sku:  'sku_Fn7Ojng8TLwnC4',
      description: 'Angular Firebase Project Course 🍱',
      price: 1900,
    },
    sku_H1XsUY6LLGAgVx: {
      id: 'vue',
      sku:  'sku_H1XsUY6LLGAgVx',
      description: 'Vue Firebase Project Course 🖖',
      price: 1900,
    },
    sku_HG8dqucZV4x6F2: {
      id: 'stripeJs',
      sku:  'sku_HG8dqucZV4x6F2',
      description: 'Stripe JavaScript Full Course 💸',
      price: 1900,
    },
  };
  
  