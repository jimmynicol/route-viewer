export function measurePrevSiblingsHeight(el: HTMLElement): number {
    let height = 0;
    let prev = el.previousElementSibling;
    while (prev) {
        height += prev.getBoundingClientRect().height;
        prev = prev.previousElementSibling;
    }
    return height;
}
