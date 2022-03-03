import React, { useEffect, useState } from "react";
import {
    resultsConverter,
    RiderStats,
    TalliedRideEfforts,
} from "../data/resultsConverter";
import { RideEfforts, SegmentEffort } from "../data/stravaDataTypes";
import { useResultsData } from "../data/useResultsData";

export enum ResultsDataState {
    IDLE = 0,
    LOADING = 1,
    ERROR = 2,
    COMPLETE = 3,
}

export interface ResultsDataCtx {
    resultsDataState: ResultsDataState;
    results: RideEfforts;
    talliedResults: TalliedRideEfforts;
    statsByRider: (athleteId: string) => RiderStats;
    effortsByRider: (athleteId: string) => Record<string, SegmentEffort>;
}

export const ResultsDataContext = React.createContext<ResultsDataCtx>(
    {} as ResultsDataCtx
);

function getResultsName(): string {
    const url = new URL(window.location.href);
    return url.pathname.split("/").slice(-1)[0];
}

export const ResultsDataProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const resultsName = getResultsName();
    const [resultsDataState, setResultsDataState] = useState<ResultsDataState>(
        ResultsDataState.IDLE
    );
    const [results, setResults] = useState<RideEfforts>({} as RideEfforts);
    const [talliedResults, setTalliedResults] = useState<TalliedRideEfforts>(
        {} as TalliedRideEfforts
    );

    const { isLoading, isError, data } = useResultsData(resultsName);

    const statsByRider = (athleteId: string) => {
        const athleteLink = `https://www.strava.com/athletes/${athleteId}`;
        const proLink = `https://www.strava.com/pros/${athleteId}`;

        return (
            talliedResults.riders[athleteLink] || talliedResults.riders[proLink]
        );
    };

    const effortsByRider = (athleteId: string) => {
        const athleteLink = `https://www.strava.com/athletes/${athleteId}`;
        const proLink = `https://www.strava.com/pros/${athleteId}`;

        const efforts: Record<string, SegmentEffort> = {};

        results.segmentsInOrder.forEach((segmentId) => {
            const segment = results.segments[segmentId];
            segment.efforts.men.forEach((effort) => {
                if (
                    effort.athlete_link === athleteLink ||
                    effort.athlete_link === proLink
                ) {
                    efforts[segmentId] = effort;
                }
            });
            segment.efforts.women.forEach((effort) => {
                if (
                    effort.athlete_link === athleteLink ||
                    effort.athlete_link === proLink
                ) {
                    efforts[segmentId] = effort;
                }
            });
        });

        return efforts;
    };

    useEffect(() => {
        if (isLoading) {
            setResultsDataState(ResultsDataState.LOADING);
        } else if (isError) {
            setResultsDataState(ResultsDataState.ERROR);
        } else {
            setResultsDataState(ResultsDataState.COMPLETE);
        }

        if (data) {
            setResults(data);
            setTalliedResults(resultsConverter(data));
        }
    }, [isLoading, isError, data, setResultsDataState]);

    return (
        <ResultsDataContext.Provider
            value={{
                resultsDataState,
                results,
                talliedResults,
                statsByRider,
                effortsByRider,
            }}
        >
            {children}
        </ResultsDataContext.Provider>
    );
};

export const useResultsDataContext = (): ResultsDataCtx => {
    return React.useContext(ResultsDataContext);
};
