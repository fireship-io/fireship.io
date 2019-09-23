import * as functions from 'firebase-functions';
import { sgMail, msg, sendEmail } from './email';
import { db } from '../config';
import { createCustomer } from '../stripe/customers';

export const newUserSetup = functions.auth.user().onCreate(async (user, context) => {

    if (!user.email) {
        return null;
    }

    const ref = db.collection('users').doc(user.uid);
    const { uid, displayName, photoURL, email } = user;
    await ref.set({
        uid, displayName, photoURL, email,
        joined: Date.now()
    }, { merge: true })

    const templateId = 'd-9976c169423544e8a0f59cc8d21fa54f';

    const emailMsg = msg([email], { templateId });

    await createCustomer(user) 

    return sendEmail([emailMsg]);
});

export const proSignup = functions.firestore.document('users/{userId}').onUpdate(async (change, context) => {

    const before = change.before.data();
    const after = change.after.data();
    const upgraded = !before.is_pro && after.is_pro; // Pro membership
    const purchased = JSON.stringify(before.products) !== JSON.stringify(after.products); // Single course
    const email = after.email;
    const wasPastDue = before.pro_status === 'past_due';

    console.log(purchased && !after.is_pro)


    if (!email || wasPastDue) {
        return null;
    }

    // Send purchase receipt email
    if (purchased && !after.is_pro) {

          const templateId = 'd-0e01856a7d9e45a7b4e11938f4da9155';

          const emailMsg = msg([email], { templateId });
          const adminEmail = msg(['hello@fireship.io'], { text: JSON.stringify(after), subject: 'New Course Purchase' });
          return sendEmail([emailMsg, adminEmail]);
    }

    // Send PRO email
    if (upgraded) {
        const templateId = 'd-d4ebc6fef6e34a5389dfe379f6d5d7b7';

        const emailMsg = msg([email], { templateId });
        const adminEmail = msg(['hello@fireship.io'], { text: JSON.stringify(after), subject: 'New Pro Upgrade' });

        return sendEmail([emailMsg, adminEmail]);
    }


});
