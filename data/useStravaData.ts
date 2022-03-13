import { useQuery } from "react-query";
import { useAPITokenContext } from "../contexts/APIToken";
import { DetailedAthlete, DetailedSegment, Route } from "./stravaDataTypes";

export enum StravaQueryKeys {
    ATHLETE = "athlete",
    ROUTE = "route",
    SEGMENTS = "segments",
}

const STRAVA_API_ENDPOINT = "https://www.strava.com/api/v3";

async function stravaAPI(path: string, token: string) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);

    const response = await fetch(`${STRAVA_API_ENDPOINT}${path}`, {
        headers,
    });
    if (!response.ok) {
        const msg = await response.json();
        throw new Error(msg.message);
    }

    return await response.json();
}

const queryOptions = {
    cacheTime: Infinity,
    // cacheTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
};

export function useAthlete(token: string) {
    const path = "/athlete";
    return useQuery<DetailedAthlete, Error>(
        StravaQueryKeys.ATHLETE,
        () => stravaAPI(path, token),
        queryOptions
    );
}

export function useAthleteWithToken() {
    const {
        tokenResponse: { access_token },
    } = useAPITokenContext();
    return useAthlete(access_token);
}

export function useRoute(routeId: string, token: string) {
    const path = `/routes/${routeId}`;
    return useQuery<Route, Error>(
        StravaQueryKeys.ROUTE,
        () => stravaAPI(path, token),
        queryOptions
    );
}

export function useSegments(segmentIds: string[], token: string) {
    return useQuery<DetailedSegment[], Error>(
        StravaQueryKeys.SEGMENTS,
        () => {
            const requests = segmentIds.map((segmentId) => {
                return stravaAPI(`/segments/${segmentId}`, token);
            });
            return Promise.all(requests);
        },
        queryOptions
    );
}
