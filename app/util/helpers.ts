export function getCourseIdFromURL(url: string = window.location.pathname) {
    const paths = url.split('/');
    const courseId = paths.findIndex(v => v === 'courses') + 1;
    return paths?.[courseId];
}