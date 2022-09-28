import { writable, derived } from 'svelte/store';
import { auth } from '../util/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { siteData } from './data';
import { getCourseIdFromURL } from '../util/helpers';
import { products } from './products';


export interface UserData {
    email?: string;
    uid?: string;
    displayName?: string;
    photoURL?: string;
    joined?: number;
    stripeCustomerId?: string;
    discordId?: string;
    is_pro?: boolean;
    expires?: number; 
    enterprise?: boolean;
    enterpriseOwner?: string;
    pro_status?: 'lifetime' | 'active' | 'past_due' | 'expiring' | 'canceled' | 'enterprise';
    products?: {
        [key: string]: boolean; // legacy course tracking
    }
    subscriptions?: {
        [key:string]: string;
    }
    courses?: {
        [key:string]: boolean;
    }
    sentMail?: {
        [key:string]: boolean;
    }
}

interface UserProgress {
	xp: number;
	[key: string]: number;
}

export const user = writable<User>(null);
export const userData = writable<UserData>(null);
export const userProgress = writable<UserProgress>(null);
export const seats = writable<any>(null);

let unsubData;
let unsubProgress;
let unsubSeats;

onAuthStateChanged(auth, async (fbUser) => {
	user.set(fbUser);
	if (fbUser) {
		const { doc, onSnapshot, getFirestore } = await import('firebase/firestore');
		const firestore = getFirestore();
		const userRef = doc(firestore, `users/${fbUser.uid}`);
        const progressRef = doc(firestore, `progress/${fbUser.uid}`);
		const seatsRef = doc(firestore, `seats/${fbUser.uid}`);

		unsubData = onSnapshot(userRef, (snap) => {
			userData.set(snap.data() as UserData);
			if (snap.data()?.enterprise) {
				unsubSeats = onSnapshot(seatsRef, (snap) => {
					seats.set(snap.data());
				});
			}
		});
        unsubProgress = onSnapshot(progressRef, (snap) => {
			userProgress.set(snap.data() as UserProgress);
		});
	} else {
		unsubData && unsubData();
        unsubProgress && unsubProgress();
		unsubSeats && unsubSeats();
		userData.set(null);
        userProgress.set(null);
		seats.set(null);
	}
});


export const canAccess = derived([userData, siteData], ([$userData, $siteData]) => {
	const id = getCourseIdFromURL($siteData?.permalink);
	return !!($userData?.is_pro || $userData?.courses?.[id] || $userData?.products?.[products[id]?.legacy_sku]);
});
