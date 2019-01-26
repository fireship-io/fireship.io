import * as functions from 'firebase-functions';
import { sgMail, msg } from './email';
import { db } from './config';

export const newUserSetup = functions.auth.user().onCreate(async (user, context) => {

    const ref = db.collection('users').doc(user.uid);
    const { uid, displayName, photoURL, email } = user;
    await ref.set({
        uid, displayName, photoURL, email,
        joined: Date.now()
    })

    const body = 'Welcome to Fireship.io!';
    const subject = 'Welcome aboard!';

    const emailMsg = msg([email], { body, subject });

    return await sgMail.send(emailMsg);
})
