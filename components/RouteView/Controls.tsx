import React, { cloneElement } from "react";
import cw from "classnames";

import styles from "./Controls.module.css";

export const Controls: React.ComponentType<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <div className={cw(styles.controls, className)}>
            {children &&
                React.Children.map(
                    children as JSX.Element[],
                    (child: React.ReactElement, i: number) => {
                        return (
                            <>
                                {i > 0 && <hr />}
                                {cloneElement(child, { ...child.props })}
                            </>
                        );
                    }
                )}
        </div>
    );
};
