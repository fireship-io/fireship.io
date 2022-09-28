

export function scrollSave() {
    let top: number;
    window.addEventListener('flamethrower:router:fetch', () => {
        top = document.getElementById('sidebar')?.scrollTop;
    })

    window.addEventListener('flamethrower:router:end', () => {
        const sidebar = document.getElementById('sidebar')
        sidebar?.scrollTo({ top })
    })
}