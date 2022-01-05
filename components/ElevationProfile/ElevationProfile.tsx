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

function calculateGradient(
    curr: Elevation,
    idx: number,
    arr: Elevation[]
): Elevation {
    if (idx === 0) {
        curr.gradient = 0;
        return curr;
    }
    const prev = arr[idx - 1];
    curr.gradient =
        ((curr.elevation - prev.elevation) / (curr.distance - prev.distance)) *
        100;

    return curr;
}

function adjustElevationsByUnit(units: Units) {
    return (curr: Elevation) => {
        curr.elevation = elevationByUnit(units, curr.elevation);
        curr.distance = distanceByUnit(units, curr.distance);
        return curr;
    };
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

const ELEVATION_SAMPLES = 100;

export const ElevationProfile: React.ComponentType<{
    segment: DetailedSegment;
    height: number;
}> = ({ segment, height }) => {
    const { units } = useUnitsContext();
    const [elevations, setElevations] =
        useState<google.maps.ElevationResult[]>();
    const [chartData, setChartData] = useState<Elevation[]>();
    const [chartHeight, setChartHeight] = useState(250);

    useEffect(() => {
        if (!google?.maps) return;

        const elevator = new google.maps.ElevationService();
        const encodedLine = segment.map.polyline;
        const decode = google.maps.geometry.encoding.decodePath(encodedLine);

        elevator
            .getElevationAlongPath({ path: decode, samples: ELEVATION_SAMPLES })
            .then(({ results }) => {
                if (results) setElevations(results);
            });
    }, [segment, setElevations]);

    useEffect(() => {
        if (!elevations) return;

        const distanceInKms = segment.distance;

        const data: Elevation[] = elevations
            .map((item: google.maps.ElevationResult, i: number) => {
                return {
                    elevation: item.elevation,
                    distance: (distanceInKms / ELEVATION_SAMPLES) * i,
                } as Elevation;
            })
            .map(calculateGradient)
            .map(adjustElevationsByUnit(units));

        setChartData(normalizeElevation(data));
    }, [segment, elevations, setChartData, units]);

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
