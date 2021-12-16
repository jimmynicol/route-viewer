import React from "react";

import styles from "./SheetMetadata.module.css";

export const SheetMetadata: React.ComponentType<{
    num: string;
    unit: string;
    description: string;
    onClick?: () => void;
}> = ({ num, unit, description, onClick }) => {
    return (
        <div onClick={onClick}>
            <h3 className={styles.title}>
                <span>{num}</span> <span>{unit}</span>
            </h3>
            <p className={styles.description}>{description}</p>
        </div>
    );
};
