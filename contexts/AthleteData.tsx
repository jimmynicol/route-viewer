import React, { useEffect, useState } from "react";
import { DetailedAthlete } from "../data/stravaDataTypes";
import { useAthlete } from "../data/useStravaData";
import { useAPITokenContext } from "./APIToken";

export enum AthleteDataState {
    IDLE = 0,
    LOADING = 1,
    ERROR = 2,
    COMPLETE = 3,
}

export interface AthleteDataCtx {
    state: AthleteDataState;
    athleteData: DetailedAthlete;
}

export const AthleteDataContext = React.createContext<AthleteDataCtx>(
    {} as AthleteDataCtx
);

export const AthleteDataProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [state, setState] = useState<AthleteDataState>(AthleteDataState.IDLE);
    const [athleteData, setAthleteData] = useState<DetailedAthlete>(
        {} as DetailedAthlete
    );
    const {
        tokenResponse: { access_token },
    } = useAPITokenContext();
    const { isLoading, isError, data } = useAthlete(access_token);

    useEffect(() => {
        if (isLoading) {
            setState(AthleteDataState.LOADING);
        } else if (isError) {
            setState(AthleteDataState.ERROR);
        } else {
            setState(AthleteDataState.COMPLETE);
        }

        if (data) setAthleteData(data);
    }, [isLoading, isError, data, setState]);

    return (
        <AthleteDataContext.Provider value={{ state, athleteData }}>
            {children}
        </AthleteDataContext.Provider>
    );
};

export const useAthleteDataContext = (): AthleteDataCtx => {
    return React.useContext(AthleteDataContext);
};
