export const stripeStyle = {
  base: {
    iconColor: '#9aa6b3',
    color: '#6ca0fc',
    fontWeight: 700,
    fontFamily: 'ratio, sans-serif',
    fontSize: '21px',
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
    productId: 'prod_EUeTur6JQYXZTe',
    planId: 'plan_EUeUPIEBLwSEPI',
    price: 1500,
    description: 'Fireship.io PRO Monthly 🔥'
  },
  proQuarterly: {
    id: 'proQuarterly',
    productId: 'prod_EUeTur6JQYXZTe',
    planId: 'plan_EUeUoZFmOd3huy',
    price: 3000,
    description: 'Fireship.io PRO Quarterly 🔥'
  },
  proLifetime: {}
};
