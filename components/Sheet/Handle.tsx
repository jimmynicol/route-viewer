import React, { useEffect } from "react";
import { animated, useSpring, config } from "react-spring";

export enum HandleDirection {
    UP,
    DOWN,
    STRAIGHT,
}

export const Handle: React.ComponentType<{
    height: number;
    width: number;
    lineThickness: number;
    fillColor: string;
    direction: HandleDirection;
}> = ({ height, width, lineThickness, fillColor, direction }) => {
    const midLine = height / 2;
    const radius = lineThickness / 2;
    const tickLength = width / 2 + radius;

    const [leftTick, leftTickApi] = useSpring(() => {
        return {
            transform: `rotate(0deg)`,
            transformOrigin: `${tickLength - radius}px ${midLine}px`,
        };
    });
    const [rightTick, rightTickApi] = useSpring(() => {
        return {
            transform: `rotate(0deg)`,
            transformOrigin: `${tickLength - radius}px ${midLine}px`,
        };
    });

    useEffect(() => {
        let angle = 0;

        switch (direction) {
            case HandleDirection.DOWN:
                angle = -15;
                break;
            case HandleDirection.UP:
                angle = 15;
                break;
        }
        leftTickApi.start({
            to: {
                transform: `rotate(${-angle}deg)`,
            },
            config: config.wobbly,
        });
        rightTickApi.start({
            to: {
                transform: `rotate(${angle}deg)`,
            },
            config: config.wobbly,
        });
    }, [direction, leftTickApi, rightTickApi]);

    return (
        <svg
            height={height}
            width={width}
            viewBox={[0, 0, width, height].join(" ")}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g fill={fillColor}>
                <animated.rect
                    style={leftTick}
                    x="0"
                    y={midLine - radius}
                    width={tickLength}
                    height={lineThickness}
                    rx={radius}
                />
                <animated.rect
                    style={rightTick}
                    x={tickLength - lineThickness}
                    y={midLine - radius}
                    width={tickLength}
                    height={lineThickness}
                    rx={radius}
                />
            </g>
        </svg>
    );
};
