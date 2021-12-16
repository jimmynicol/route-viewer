import { useMedia } from "react-use";

const COMPACT_HEIGHT_THRESHOLD = 480;
const COMPACT_WIDTH_THRESHOLD = 667;

export enum SizeClass {
    COMPACT = 1,
    REGULAR = 2,
}

function isVerticalSizeClassCompact(): boolean {
    if (typeof window === "undefined") return false;
    return window.innerHeight <= COMPACT_HEIGHT_THRESHOLD;
}

export function useVerticalSizeClass() {
    const isCompact = useMedia(
        `(min-height: ${COMPACT_HEIGHT_THRESHOLD}px)`,
        isVerticalSizeClassCompact()
    );
    return isCompact ? SizeClass.REGULAR : SizeClass.COMPACT;
}

function isHorizontalSizeClassCompact(): boolean {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= COMPACT_WIDTH_THRESHOLD;
}

export function useHorizontalSizeClass() {
    const isCompact = useMedia(
        `(min-width: ${COMPACT_WIDTH_THRESHOLD}px)`,
        isHorizontalSizeClassCompact()
    );
    return isCompact ? SizeClass.REGULAR : SizeClass.COMPACT;
}
