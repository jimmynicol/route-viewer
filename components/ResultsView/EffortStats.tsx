import React from "react";

import { SheetMetadata } from "../Misc/SheetMetadata";
import { MetadataContainer } from "../Misc/MetadataContainer";

export enum EffortStatsTypes {
    RIDERS,
    PRS,
    XOMS,
    CLUB_XOMS,
}

export const EffortStats: React.ComponentType<{
    riders: number;
    prs: number;
    xoms: number;
    clubXOMs: number;
    onClick?: (value: EffortStatsTypes) => void;
}> = ({ riders, prs, xoms, clubXOMs, onClick }) => {
    return (
        <MetadataContainer>
            <SheetMetadata
                num={riders}
                unit={""}
                description={"Riders"}
                onClick={() =>
                    onClick ? onClick(EffortStatsTypes.RIDERS) : null
                }
            />
            <SheetMetadata
                num={prs}
                unit={""}
                description={"PRs"}
                onClick={() => (onClick ? onClick(EffortStatsTypes.PRS) : null)}
            />
            <SheetMetadata
                num={xoms}
                unit={""}
                description={"XOMs"}
                onClick={() =>
                    onClick ? onClick(EffortStatsTypes.XOMS) : null
                }
            />
            {clubXOMs > 0 && (
                <SheetMetadata
                    num={clubXOMs}
                    unit={""}
                    description={"Club XOMs"}
                    onClick={() =>
                        onClick ? onClick(EffortStatsTypes.CLUB_XOMS) : null
                    }
                />
            )}
        </MetadataContainer>
    );
};
