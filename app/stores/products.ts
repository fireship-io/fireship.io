export const products = {
    'react-next-firebase': {
        id: 'react-next-firebase',
        price: 'price_1Lkgo6BF7AptWZlcBFVoputL',
        amount: 20,
        legacy_sku: 'sku_ItHZfVSApb3xkT',
    },
    'git': {
        id: 'git',
        price: 'price_1LkgzcBF7AptWZlcF5NJQgKd',
        amount: 10,
        legacy_sku: 'sku_KBHTYbTWv1Hmb7',
    },
    'angular': {
        id: 'angular',
        price: 'price_1Lkh0WBF7AptWZlcYUEGDHLz',
        amount: 20,
        legacy_sku: 'sku_Fn7Ojng8TLwnC4',
    },
    'flutter-firebase': {
        id: 'flutter-firebase',
        price: 'price_1Lkh1TBF7AptWZlcrWJiK3PT',
        amount: 20,
        legacy_sku: 'sku_FJCsh7mvjI83Kz',
    },
    'dart': {
        id: 'dart',
        price: 'price_1Lkh20BF7AptWZlcqyViQgv0',
        amount: 10,
        legacy_sku: 'sku_KOyOvlrmLikRz8',
    },
    'vscode-tricks': {
        id: 'vscode-tricks',
        price: 'price_1Lkh2mBF7AptWZlcR0GhtjwH',
        amount: 10,
        legacy_sku: 'sku_Kf57qdqUerVTUS',
    },
    'firestore-data-modeling': {
        id: 'firestore-data-modeling',
        price: 'price_1Lkh3VBF7AptWZlcNiWVmDLI',
        amount: 10,
        legacy_sku: 'sku_FJEdx5Tz9dPrvm',
    },
    'firebase-security': {
        id: 'firebase-security',
        price: 'price_1Lkh4EBF7AptWZlcFv4ZvmIR',
        amount: 10,
        legacy_sku: 'sku_IVIjaiCRlivYD3',
    },
    'stripe-js': {
        id: 'stripe-js',
        price: 'price_1LnAhnBF7AptWZlc3VgezH7X',
        amount: 20,
        legacy_sku: 'sku_HG8dqucZV4x6F2',
    },
    'lifetime': {
        id: 'lifetime',
        price: 'price_1LkhByBF7AptWZlcIUg2TjVg',
        amount: 399,
    },
    'enterprise': {
        id: 'enterprise',
        price: 'price_1LkhByBF7AptWZlcx5vOdAnG',
        amount: 299,
    },
    'month': {
        id: 'pro',
        price: 'price_1LkhBxBF7AptWZlcJB2I2IUt',
        amount: 29,
    },
    'quarter': {
        id: 'pro',
        price: 'price_1LkhByBF7AptWZlcg9Zjbmw6',
        amount: 69,
    },
    'year': {
        id: 'pro',
        price: 'price_1LkhByBF7AptWZlcVY5TwKdS',
        amount: 199,
    },
}


// TEST products
// export const products = {
//     'react-next-firebase': {
//         id: 'react-next-firebase',
//         price: 'price_1Lj6ZYBF7AptWZlc2pr7NJGR',
//         amount: 20,
//         legacy_sku: 'sku_ItHZfVSApb3xkT',
//     },
//     'git': {
//         id: 'git',
//         price: 'price_1LZdyDBF7AptWZlchD0jx8Er',
//         amount: 10,
//         legacy_sku: 'sku_KBHTYbTWv1Hmb7',
//     },
//     'lifetime': {
//         id: 'lifetime',
//         price: 'price_1Lf6vcBF7AptWZlclGwKFNUj',
//         amount: 399,
//     },
//     'enterprise': {
//         id: 'enterprise',
//         price: 'price_1Lf7k3BF7AptWZlcTY1ZSR9F',
//         amount: 299,
//     },
//     'month': {
//         id: 'pro',
//         price: 'price_1LZoLSBF7AptWZlcEWZNWaEG',
//         amount: 29,
//     },
//     'quarter': {
//         id: 'pro',
//         price: 'price_1LZod3BF7AptWZlc4Mx7fbKs',
//         amount: 69,
//     },
//     'year': {
//         id: 'pro',
//         price: 'price_1LZodhBF7AptWZlchrDNcZfR',
//         amount: 199,
//     },
// }


export function courseByLegacySku(sku: string) {
    return Object.values(products).find((product) => (product as any).legacy_sku === sku)?.id;
}