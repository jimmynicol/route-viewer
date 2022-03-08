export function measurePrevSiblingsHeight(el: HTMLElement): number {
    let height = 0;
    let prev = el.previousElementSibling;
    while (prev) {
        height += prev.getBoundingClientRect().height;
        prev = prev.previousElementSibling;
    }
    return height;
}

export function findParentByAttr(
    el: HTMLElement,
    attr: string
): HTMLElement | null {
    let parent = el.parentElement;

    while (parent && !parent.hasAttribute(attr)) {
        parent = parent.parentElement;
    }

    return parent;
}
