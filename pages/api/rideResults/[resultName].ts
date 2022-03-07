import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { RideEfforts } from "../../../data/stravaDataTypes";

// get the file name for all ride results upfront
const rideResultsDir = resolve(
    __dirname,
    // "..",
    "..",
    "..",
    "..",
    "public",
    "ride-results"
);
const files = readdirSync(rideResultsDir);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<RideEfforts>
) {
    console.log(req);

    // try {
    //     const data = readFileSync()
    //     res.status(status).json(data);
    // } catch (err: any) {
    //     console.error(err.response);
    //     res.status(err.response.status).json(err.response.data);
    // }
}
