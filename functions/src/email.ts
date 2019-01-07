import * as functions from 'firebase-functions';
import * as sendgrid from '@sendgrid/mail';
sendgrid.setApiKey(functions.config().sendgrid.key);

export const sgMail = sendgrid;

///// HELPERS /////

export function msg(
  to: string[],
  { subject = 'Hello from Fireship.io', body = '', templateId = 'd-9976c169423544e8a0f59cc8d21fa54f', text = '', html = '' }
) {
  return {
    to,
    from: { name: 'Fireship', email: 'hello@fireship.io' },
    subject,
    text: text || body,
    html: html || body,
    templateId,
    dynamic_template_data: {
      subject,
      body
    }
  };
}
