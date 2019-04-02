import * as functions from 'firebase-functions';
import * as sendgrid from '@sendgrid/mail';
sendgrid.setApiKey(functions.config().sendgrid.key);

export const sgMail = sendgrid;

///// HELPERS /////

export function msg(to: string[], data?: any)  {
  return {  
    to: to,
    from: { name: 'Fireship', email: 'hello@fireship.io' },
    ...data
  }
}

export function sendEmail(emails: any[]) {
  return sgMail.send(emails).catch(e => console.log(e.response.body.errors));
}