import { useQuery } from "react-query";
import { RideEfforts } from "./stravaDataTypes";

const S3_BUCKET = process.env.S3_BUCKET_AWS;
const queryOptions = {
    cacheTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
};

export function useResultsData(resultsName: string) {
    const url = `${S3_BUCKET}rides/${resultsName}.json`;

    return useQuery<RideEfforts, Error>(
        "results-from-s3",
        () => fetch(url).then((res) => res.json()),
        queryOptions
    );
}
