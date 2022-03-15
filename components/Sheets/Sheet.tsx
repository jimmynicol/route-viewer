import React, { useEffect, useRef, useState } from "react";
import { animated, useSpring, config } from "react-spring";
import cw from "classnames";

import styles from "./Sheet.module.css";
import { SizeClass, useHorizontalSizeClass } from "../../utils/useSizeClass";
import { Handle, HandleDirection } from "../Icons/Handle";
import { useColorScheme } from "../../utils/useColorScheme";
import { rgba } from "@react-spring/shared";

export enum SheetViewState {
    HIDE = 1,
    DEFAULT = 2,
    FULL = 3,
}

const DEFAULT_HEIGHT = 180;
const FULL_HEIGHT =
    (typeof window === "undefined" ? 840 : window.innerHeight) -
    DEFAULT_HEIGHT -
    50;

export const Sheet: React.ComponentType<
    {
        viewState: SheetViewState;
        onChangeViewState?: (value: SheetViewState) => void;
        defaultHeight?: number;
        fullHeight?: number;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({
    viewState,
    onChangeViewState,
    defaultHeight = DEFAULT_HEIGHT,
    fullHeight = FULL_HEIGHT,
    children,
    className,
    style,
    ...props
}) => {
    const sizeClass = useHorizontalSizeClass();
    const darkMode = useColorScheme();
    const [{ y }, api] = useSpring(() => ({ y: 0 }));

    const handleRef = useRef<HTMLDivElement>(null);
    const [childWrapperHeight, setChildWrapperHeight] = useState(0);

    useEffect(() => {
        const FULL_Y = -1 * fullHeight;
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

        const handleEl = handleRef.current;
        if (handleEl) {
            const handleHeight = handleEl.getBoundingClientRect().height;
            setChildWrapperHeight(fullHeight + defaultHeight - handleHeight);
        }
    }, [
        viewState,
        api,
        defaultHeight,
        fullHeight,
        handleRef,
        setChildWrapperHeight,
    ]);

    const toggleMove = () => {
        if (onChangeViewState) {
            onChangeViewState(
                y.get() < 0 ? SheetViewState.DEFAULT : SheetViewState.FULL
            );
        }
    };

    const _classNames = [styles.sheet];
    if (className) _classNames.push(className);
    _classNames.push(
        sizeClass === SizeClass.COMPACT
            ? styles.compactSizeClass
            : styles.regularSizeClass
    );

    const handleFill = darkMode ? "rgba(160, 160, 160)" : "rgba(110, 110, 110)";

    return (
        <animated.div
            className={cw(_classNames)}
            style={{
                ...style,
                display: "block",
                bottom: `calc(-100vh + ${defaultHeight - 100}px)`,
                y,
            }}
            {...props}
        >
            <div
                ref={handleRef}
                className={styles.handleWrapper}
                onClick={toggleMove}
            >
                <Handle
                    width={40}
                    height={20}
                    lineThickness={6}
                    fillColor={handleFill}
                    direction={
                        viewState === SheetViewState.FULL
                            ? HandleDirection.DOWN
                            : HandleDirection.UP
                    }
                />
            </div>
            <div
                data-scroll-container={true}
                style={{ height: childWrapperHeight, position: "relative" }}
            >
                {children}
            </div>
        </animated.div>
    );
};
