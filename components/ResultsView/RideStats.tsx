import React from "react";

import { SheetMetadata } from "../Misc/SheetMetadata";
import { useUnitsContext } from "../../contexts/Units";
import {
    distanceStr,
    elevationStr,
    unitsStr,
} from "../../utils/unitConversions";
import { MetadataContainer } from "../Misc/MetadataContainer";

export const RideStats: React.ComponentType<{
    distance: number;
    elevationGain: number;
    numberOfSegments: number;
    onSegmentsClick?: () => void;
}> = ({ distance, elevationGain, numberOfSegments, onSegmentsClick }) => {
    const { units } = useUnitsContext();

    const _distance = distanceStr(units, distance, 2);
    const _elevation = elevationStr(units, elevationGain, 0);

    return (
        <MetadataContainer>
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
                onClick={() => (onSegmentsClick ? onSegmentsClick() : null)}
            />
        </MetadataContainer>
    );
};
