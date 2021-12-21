import React, { useEffect } from "react";
import { animated, useSpring, config } from "react-spring";
import { useDrag } from "@use-gesture/react";

import styles from "./Sheet.module.css";
import { SizeClass, useHorizontalSizeClass } from "../../utils/useSizeClass";
import { Handle, HandleDirection } from "./Handle";

export enum SheetViewState {
    HIDE = 1,
    DEFAULT = 2,
    FULL = 3,
}

export const Sheet: React.ComponentType<{
    viewState: SheetViewState;
    onChangeViewState: (value: SheetViewState) => void;
    children?: React.ReactNode;
    className?: string;
    defaultHeight?: number;
    parentName?: string;
}> = ({
    viewState,
    onChangeViewState,
    children,
    className,
    defaultHeight = 180,
    parentName,
}) => {
    const sizeClass = useHorizontalSizeClass();
    const [{ y }, api] = useSpring(() => ({ y: 0 }));

    useEffect(() => {
        const FULL_Y = -1 * (window.innerHeight - defaultHeight - 50);
        const DEFAULT_Y = 0;
        const HIDE_Y = defaultHeight + 100;

        switch (viewState) {
            case SheetViewState.FULL:
                api.start({
                    y: FULL_Y,
                    immediate: false,
                    config: config.wobbly,
                });
                break;
            case SheetViewState.HIDE:
                api.start({
                    y: HIDE_Y,
                    immediate: false,
                    config: config.stiff,
                });
                break;
            case SheetViewState.DEFAULT:
            default:
                api.start({
                    y: DEFAULT_Y,
                    immediate: false,
                    config: config.stiff,
                });
                break;
        }
    }, [viewState, api, defaultHeight, parentName]);

    const toggleMove = () => {
        onChangeViewState(
            y.get() < 0 ? SheetViewState.DEFAULT : SheetViewState.FULL
        );
    };

    const bind = useDrag(
        ({
            last,
            initial: [, iy],
            velocity: [, vy],
            movement: [, my],
            target,
        }) => {
            if (vy === 0) return;

            // if (target && target["draggable"] === false) return;

            // if (last) {
            //     const currY = y.get();

            //     currY < -50 ? maximize() : minimize(vy);
            // } else {
            //     api.start({ y: my, immediate: true });
            // }
        },
        {
            from: [0, y.get()],
            filterTaps: true,
            bounds: { top: 0 },
            rubberband: true,
        }
    );

    let _classNames = styles.sheet;
    _classNames += className ? ` ${className}` : "";
    _classNames +=
        sizeClass === SizeClass.COMPACT
            ? ` ${styles.compactSizeClass}`
            : ` ${styles.regularSizeClass}`;

    return (
        <animated.div
            {...bind()}
            className={_classNames}
            style={{
                display: "block",
                bottom: `calc(-100vh + ${defaultHeight - 100}px)`,
                y,
            }}
        >
            <div className={styles.handleWrapper} onClick={toggleMove}>
                <Handle
                    width={40}
                    height={20}
                    lineThickness={6}
                    fillColor="rgba(160, 160, 160)"
                    direction={
                        viewState === SheetViewState.FULL
                            ? HandleDirection.DOWN
                            : HandleDirection.UP
                    }
                />
            </div>
            {children}
        </animated.div>
    );
};
