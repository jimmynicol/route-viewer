import React, { useEffect, useState } from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { useUnitsContext } from "../../contexts/Units";
import { DetailedSegment } from "../../data/stravaDataTypes";
import { Units } from "../../data/useUnits";
import { metersToFeet, metersToMiles } from "../../utils/unitConversions";

type Elevation = {
    elevation: number;
    distance: number;
};

function normalizeElevation(elevations: Elevation[]): Elevation[] {
    let minElevation = elevations[0].elevation;

    elevations.forEach((elevation: Elevation) => {
        if (elevation.elevation < minElevation) {
            minElevation = elevation.elevation;
        }
    });

    return elevations.map((elevation) => {
        elevation.elevation = elevation.elevation - minElevation;
        return elevation;
    });
}

function distanceByUnit(units: Units, distance: number) {
    return units === Units.IMPERIAL ? metersToMiles(distance) : distance;
}

function elevationByUnit(units: Units, elevation: number) {
    return units === Units.IMPERIAL ? metersToFeet(elevation) : elevation;
}

export const ElevationProfile: React.ComponentType<{
    segment: DetailedSegment;
}> = ({ segment }) => {
    const { units } = useUnitsContext();
    const [chartData, set] = useState<Elevation[]>();

    useEffect(() => {
        if (!google?.maps) return;

        const elevator = new google.maps.ElevationService();
        const encodedLine = segment.map.polyline;
        const decode = google.maps.geometry.encoding.decodePath(encodedLine);
        const distance = distanceByUnit(units, segment.distance);
        const samples = 100;

        elevator
            .getElevationAlongPath({ path: decode, samples })
            .then(({ results }) => {
                const elevations: Elevation[] = results.map(
                    (r: google.maps.ElevationResult, i: number) => {
                        return {
                            elevation: elevationByUnit(units, r.elevation),
                            distance: (distance / samples) * i,
                        } as Elevation;
                    }
                );

                if (results) set(normalizeElevation(elevations));
            });
    }, [segment, set, units]);

    if (!chartData) return null;

    return (
        <div style={{ marginTop: 15, padding: "0 20px" }}>
            <h3>Elevation</h3>
            <AreaChart data={chartData} width={345} height={250}>
                {/* <XAxis
                    dataKey="distance"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => parseInt(value).toFixed(0)}
                /> */}
                <YAxis width={30} tick={{ fontSize: 10 }} />
                <Area
                    type="monotone"
                    dataKey="elevation"
                    stroke="#ccc"
                    fill="#ccc"
                />
            </AreaChart>
        </div>
    );
};
