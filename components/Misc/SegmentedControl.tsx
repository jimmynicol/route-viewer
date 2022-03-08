import React, { useRef } from "react";
import cw from "classnames";

import styles from "./SegmentedControl.module.css";
import typography from "../../styles/Typography.module.css";
import { animated, useSpring, config } from "react-spring";

const INSET = 2;

export interface SegmentedControlValue {
    label: string;
    index: number;
}

export const SegmentedControl: React.ComponentType<
    {
        labels: string[];
        onValueChanged?: (value: SegmentedControlValue) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ labels, onValueChanged, ...props }) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [{ x }, api] = useSpring(() => ({ x: 2 }));

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        const el = event.currentTarget;
        const itemNum = Number(el.dataset.num) || 0;
        const dims = componentRef.current?.getBoundingClientRect();

        if (!dims) return;

        const newX =
            itemNum > 0
                ? (dims.width / labels.length) * itemNum - INSET / 2
                : INSET;

        api.start({
            x: newX,
            immediate: false,
            config: config.stiff,
        });

        if (onValueChanged) {
            onValueChanged({
                label: labels[itemNum],
                index: itemNum,
            } as SegmentedControlValue);
        }
    };

    return (
        <div
            {...props}
            className={cw(styles.segmentedControl, props.className)}
            ref={componentRef}
        >
            <animated.div
                className={styles.background}
                style={{
                    width: `calc(${100 / labels.length}% - ${INSET}px)`,
                    x,
                }}
            ></animated.div>
            {labels.map((label: string, i: number) => (
                <div
                    className={cw(typography.bodySmall, styles.label)}
                    key={i}
                    data-num={i}
                    onClick={handleClick}
                >
                    {label}
                </div>
            ))}
        </div>
    );
};
