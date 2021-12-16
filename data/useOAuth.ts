import { useQuery } from "react-query";
import { TokenExchangeResponse, TokenRefreshResponse } from "./stravaDataTypes";

export function useTokenExchange(code: string) {
    return useQuery<TokenExchangeResponse, Error>(
        "tokenExchange",
        async () => {
            const response = await fetch("/api/tokenExchange", {
                method: "POST",
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                const msg = await response.json();
                throw new Error(msg.message);
            }

            return await response.json();
        },
        {
            retry: 2,
        }
    );
}

export function useTokenRefresh(refreshToken: string) {
    return useQuery<TokenRefreshResponse, Error>(
        "tokenRefresh",
        async () => {
            const response = await fetch("/api/tokenRefresh", {
                method: "POST",
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (!response.ok) {
                const msg = await response.json();
                throw new Error(msg.message);
            }

            return await response.json();
        },
        {
            retry: 2,
        }
    );
}
