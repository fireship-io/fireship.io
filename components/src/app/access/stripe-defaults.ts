export const stripeStyle = {
  base: {
    iconColor: '#9aa6b3',
    color: '#6ca0fc',
    fontWeight: 500,
    fontFamily: 'ratio, sans-serif',
    fontSize: '18px',
    fontSmoothing: 'antialiased',
    ':-webkit-autofill': {
      color: '#9aa6b3',
      fontWeight: 500
    },
    '::placeholder': {
      color: '#9aa6b3'
    }
  },
  invalid: {
    iconColor: '#ff3860',
    color: '#ff3860'
  }
};

export const plans = {
  proMonthly: {
    id: 'proMonthly',
    productId: 'prod_DAWCfOQLPlvU5g', // 'prod_EUeTur6JQYXZTe',
    planId: 'plan_DAWDbxLaN5MwF3',  //  'plan_EUeUPIEBLwSEPI',
    price: 2500,
    description: 'Fireship.io PRO Monthly Membership 🔥',
    type: 'subscribe'
  },
  proQuarterly: {
    id: 'proQuarterly',
    productId: 'plan_EbowEefcrMY0eg',
    planId: 'plan_EbowEefcrMY0eg',
    price: 5000,
    description: 'Fireship.io PRO Quarterly Membership 🚀',
    type: 'subscribe'
  },
  proLifetime: {
    id: 'proLifetime',
    sku: 'sku_Ebp0C4S9tei5CO', // 'sku_EcYoWGwIvW7AFt',
    price: 30000,
    description: 'Fireship.io Lifetime Access 🦄',
    type: 'order',
    url: '/tags/pro'
  },
  flutterFirebase: {
    id: 'flutterFirebase',
    sku: 'sku_FJCsh7mvjI83Kz',
    description: 'The Flutter Firebase Course 🐦',
    type: 'order',
    price: 1900,
    url: '/courses/flutter-firebase'
  },
  stripePayments: {
    id: 'stripePayments',
    sku: 'sku_FJEdgiT5ZF8bCQ',
    description: 'Stripe Payments Course 💰',
    type: 'order',
    price: 1900,
    url: '/courses/stripe-payments/'
  },
  firestoreDataModeling: {
    id: 'firestoreDataModeling',
    sku: 'sku_FJEdx5Tz9dPrvm',
    description: 'Firestore Data Modeling Course 🔥',
    type: 'order',
    price: 1900,
    url: '/courses/firestore-data-modeling/'
  },
  ionic: {
    id: 'ionic',
    sku: 'sku_FSAhASTSPQb1oh',
    description: 'Ionic 4 (Angular) Master Course 📱',
    type: 'order',
    price: 1900,
    url: '/courses/ionic/'
  },
  angular: {
    id: 'angular',
    sku:  'sku_Fn7Ojng8TLwnC4',
    description: 'Angular Firebase Project Course 🍱',
    type: 'order',
    price: 1900,
    url: '/courses/angular/'
  },
  vueFirebase: {
    id: 'vue-firebase',
    sku:  'sku_H1XsUY6LLGAgVx',
    description: 'Vue Firebase Project Course 💬',
    type: 'order',
    price: 1900,
    url: '/courses/vue/'
  },
};

