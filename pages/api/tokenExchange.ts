import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { TokenExchangeResponse } from "../../data/stravaDataTypes";

const STRAVA_API_ENDPOINT = "https://www.strava.com/api/v3/oauth/token";

interface TokenExchangeRequest {
    client_id: string;
    client_secret: string;
    code: string;
    grant_type: string;
}

const CLIENT_ID = process.env.CLIENT_ID || "client_id";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "client_secret";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TokenExchangeResponse>
) {
    const { code } = JSON.parse(req.body);

    const payload: TokenExchangeRequest = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
    };

    try {
        const { status, data } = await axios.post(STRAVA_API_ENDPOINT, payload);
        res.status(status).json(data);
    } catch (err: any) {
        console.error(err.response);
        res.status(err.response.status).json(err.response.data);
    }
}
