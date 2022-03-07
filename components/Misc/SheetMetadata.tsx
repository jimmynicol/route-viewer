import React from "react";
import cw from "classnames";

import styles from "./SheetMetadata.module.css";
import typography from "../../styles/Typography.module.css";

export const SheetMetadata: React.ComponentType<
    {
        num: string | number;
        unit: string;
        description: string;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ num, unit, description, ...props }) => {
    return (
        <div {...props}>
            <h2 className={cw(styles.title, typography.titleReduced)}>
                <span>{num}</span> <span>{unit}</span>
            </h2>
            <p className={cw(styles.description, typography.caption)}>
                {description}
            </p>
        </div>
    );
};
