import { derived, writable } from 'svelte/store';
import { siteData } from './data';
import { getCourseIdFromURL } from '../util/helpers';
import { products } from './products';

export const period = writable<'month' | 'quarter' | 'year'>('month');

export const currentCourse = derived([siteData], ([$siteData]) => {
	const id = getCourseIdFromURL($siteData?.permalink);
	return id && products[id];
});