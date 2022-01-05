import React, { useEffect, useState } from "react";

import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { useUnitsContext } from "../../contexts/Units";
import { DetailedSegment } from "../../data/stravaDataTypes";
import { Units } from "../../data/useUnits";
import { metersToFeet, metersToMiles } from "../../utils/unitConversions";

import typography from "../../styles/Typography.module.css";

type Elevation = {
    elevation: number;
    distance: number;
    gradient: number;
};

export const gradientColors: Record<number, string> = {
    5: "#dddddd",
    10: "#FFE045",
    15: "#F56300",
    20: "#AF1E2D",
    25: "#FF3037",
};

function calculateGradient(elevations: Elevation[]): Elevation[] {
    return elevations.map((curr: Elevation, i: number) => {
        if (i === 0) {
            curr.gradient = 0;
            return curr;
        }

        const prev = elevations[i - 1];
        curr.gradient =
            ((curr.elevation - prev.elevation) /
                (curr.distance - prev.distance)) *
            100;

        return curr;
    });
}

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

const CustomTooltip: React.ComponentType<{
    active?: boolean;
    payload?: any[];
    label?: string;
}> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "#fff",
                    padding: "10px",
                    borderRadius: "3px",
                }}
            >
                <p style={{ margin: 0 }}>
                    {payload[0].payload.gradient.toFixed(1)}%
                </p>
            </div>
        );
    }

    return null;
};

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

                if (results) {
                    set(normalizeElevation(calculateGradient(elevations)));
                }
            });
    }, [segment, set, units]);

    useEffect(() => {
        const elevationHeight = height - 70;
        setChartHeight(elevationHeight > 400 ? 400 : elevationHeight);
    }, [segment, height, setChartHeight]);

    if (!chartData) return null;

    const gradientStops = chartData.map(
        (curr: Elevation, i: number, arr: Elevation[]) => {
            if (i === 0) {
                return (
                    <stop offset="0%" stopColor={gradientColors[5]} key={i} />
                );
            }

            const { gradient } = curr;
            const colorBucket = Math.ceil(gradient / 5) * 5;
            const stopColor =
                gradient < 0 ? gradientColors[5] : gradientColors[colorBucket];

            return (
                <stop
                    offset={`${i}%`}
                    stopColor={stopColor || gradientColors[25]}
                    key={i}
                />
            );
        }
    );

    return (
        <div style={{ padding: "0 20px", height }}>
            <h3
                className={typography.subTitle}
                style={{ margin: 0, padding: "15px 0" }}
            >
                Elevation
            </h3>
            <ResponsiveContainer height={chartHeight} width={"100%"}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="gradientDisplay">
                            {gradientStops}
                        </linearGradient>
                    </defs>
                    <Tooltip content={<CustomTooltip />} />
                    <YAxis width={30} tick={{ fontSize: 10 }} />
                    <Area
                        type="monotone"
                        dataKey="elevation"
                        stroke="#bbb"
                        fill="url(#gradientDisplay)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
