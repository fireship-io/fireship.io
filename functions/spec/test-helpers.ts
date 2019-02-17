import { stripe } from '../src/stripe/helpers';

export const mockSource = (customer: string) => {
    return stripe.tokens.create({
        card: { 
            object: 'card',
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2026,
            cvc: '123',
        }
    })
}