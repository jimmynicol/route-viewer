import React from "react";
import { useUnitsContext } from "../../contexts/Units";
import { Units } from "../../data/useUnits";
import { unitsStr } from "../../utils/unitConversions";

import styles from "./UnitSwitcher.module.css";

export const UnitSwitcher: React.ComponentType<{ className?: string }> = ({
    className,
}) => {
    const { units, setUnits } = useUnitsContext();

    const toggleUnits = () => {
        setUnits(units === Units.IMPERIAL ? Units.METRIC : Units.IMPERIAL);
    };

    let _classNames = styles.unitSwitcher;
    _classNames += className ? ` ${className}` : "";

    return (
        <div className={_classNames} onClick={toggleUnits}>
            {unitsStr(units, "km")}
        </div>
    );
};
