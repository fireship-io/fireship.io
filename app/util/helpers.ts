import { freeContent } from '../stores';

export const COURSE_TIERS = {
    free: 'free',
    pro: 'pro',
} as const;

export type CourseTier = keyof typeof COURSE_TIERS;

export function getCourseIdFromURL(url: string = window.location.pathname) {
    const paths = url.split('/');
    const courseId = paths.findIndex(v => v === 'courses') + 1;
    return paths?.[courseId];
}

export function getChapterTitleFromURL(url: string = window.location.pathname) {
    const paths = url.split('/');
    const chapter = paths.findIndex(v => v === 'courses') + 2;
    return paths?.[chapter];
}

export function getCourseTier(url: string = window.location.pathname): CourseTier {
    const courseId = getCourseIdFromURL(url);
    const lessonId = getChapterTitleFromURL(url);

    if (freeContent[courseId].includes(lessonId)) return COURSE_TIERS.free;
    return COURSE_TIERS.pro;
}
