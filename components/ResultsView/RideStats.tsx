import React from "react";
import cw from "classnames";

import { SheetMetadata } from "../SheetMetadata/SheetMetadata";
import { useUnitsContext } from "../../contexts/Units";
import {
    distanceStr,
    elevationStr,
    unitsStr,
} from "../../utils/unitConversions";

export const RideStats: React.ComponentType<{
    distance: number;
    elevationGain: number;
    numberOfSegments: number;
    classNames?: string[];
}> = ({ distance, elevationGain, numberOfSegments, classNames }) => {
    const { units } = useUnitsContext();

    const _distance = distanceStr(units, distance, 2);
    const _elevation = elevationStr(units, elevationGain, 0);

    return (
        <div className={cw(...(classNames || []))}>
            <SheetMetadata
                num={_distance}
                unit={unitsStr(units, "km")}
                description={"Distance"}
            />
            <SheetMetadata
                num={_elevation}
                unit={unitsStr(units, "m")}
                description={"Elevation"}
            />
            <SheetMetadata
                num={numberOfSegments}
                unit={""}
                description={"Segments"}
            />
        </div>
    );
};
