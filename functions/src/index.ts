import * as admin from 'firebase-admin';
admin.initializeApp();

///// USER /////

export { newUserSetup } from './user';

//// QnA /////

export { questionBotHandler, recordMessage } from './slack';