import React from "react";
import cw from "classnames";

import styles from "./SheetMetadata.module.css";
import typography from "../../styles/Typography.module.css";

export const SheetMetadata: React.ComponentType<{
    num: string;
    unit: string;
    description: string;
    onClick?: () => void;
}> = ({ num, unit, description, onClick }) => {
    return (
        <div onClick={onClick}>
            <h2 className={cw(styles.title, typography.titleReduced)}>
                <span>{num}</span> <span>{unit}</span>
            </h2>
            <p className={cw(styles.description, typography.caption)}>
                {description}
            </p>
        </div>
    );
};
