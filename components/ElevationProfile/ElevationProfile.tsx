import React, { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
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
    height: number;
}> = ({ segment, height }) => {
    const { units } = useUnitsContext();
    const [chartData, set] = useState<Elevation[]>();
    const [chartHeight, setChartHeight] = useState(250);

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

    useEffect(() => {
        const elevationHeight = height - 70;
        setChartHeight(elevationHeight > 400 ? 400 : elevationHeight);
    }, [segment, height, setChartHeight]);

    if (!chartData) return null;

    return (
        <div style={{ padding: "0 20px", height }}>
            <h3 style={{ margin: 0, padding: "15px 0" }}>Elevation</h3>
            <ResponsiveContainer height={chartHeight} width={"100%"}>
                <AreaChart data={chartData}>
                    <YAxis width={30} tick={{ fontSize: 10 }} />
                    <Area
                        type="monotone"
                        dataKey="elevation"
                        stroke="#ccc"
                        fill="#ccc"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
