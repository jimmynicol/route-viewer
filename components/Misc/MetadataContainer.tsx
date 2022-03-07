import React from "react";
import cw from "classnames";

import styles from "./MetadataContainer.module.css";

export const MetadataContainer: React.ComponentType<
    React.HTMLAttributes<HTMLDivElement>
> = ({ ...props }) => {
    return (
        <div
            className={cw(styles.metadataContainer, props.className)}
            {...props}
        >
            {props.children}
        </div>
    );
};
