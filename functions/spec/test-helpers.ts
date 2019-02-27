import { stripe } from '../src/stripe/helpers';

export const mockSource = async () => {
    const token = await stripe.tokens.create({
        card: { 
            object: 'card',
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2026,
            cvc: '123',
        }
    })

    return (stripe as any).sources.create({
        type: 'card',
        token: token.id
    })
}