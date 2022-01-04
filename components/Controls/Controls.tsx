import React, { cloneElement, CSSProperties } from "react";
import cw from "classnames";

import styles from "./Controls.module.css";

export const Controls: React.ComponentType<{
    children: React.ReactNode;
    className?: string;
    style?: CSSProperties;
    map?: google.maps.Map;
}> = ({ children, className, style, map }) => {
    return (
        <div className={cw(styles.controls, className)} style={style}>
            {children &&
                React.Children.map(
                    children as JSX.Element[],
                    (child: React.ReactElement, i: number) => {
                        return (
                            <>
                                {i > 0 && <hr />}
                                {cloneElement(child, { ...child.props, map })}
                            </>
                        );
                    }
                )}
        </div>
    );
};
