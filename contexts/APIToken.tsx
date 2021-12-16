import React from "react";
import { TokenExchangeResponse } from "../data/stravaDataTypes";
import { useToken } from "../data/useToken";

type SetTokenResponse = React.Dispatch<
    React.SetStateAction<TokenExchangeResponse>
>;

export interface APITokenCtx {
    tokenResponse: TokenExchangeResponse;
    setTokenResponse: SetTokenResponse;
}

const defaultResponse: TokenExchangeResponse = {
    token_type: "Bearer",
    access_token: "",
    refresh_token: "",
    expires_at: 0,
    expires_in: 0,
};

export const APITokenContext = React.createContext<APITokenCtx>({
    tokenResponse: defaultResponse,
    setTokenResponse: () => defaultResponse,
});

export const APITokenProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [tokenResponse, setTokenResponse] = useToken();

    return (
        <APITokenContext.Provider value={{ tokenResponse, setTokenResponse }}>
            {children}
        </APITokenContext.Provider>
    );
};

export const useAPITokenContext = (): APITokenCtx => {
    return React.useContext(APITokenContext);
};

export function isTokenValid(tokenResponse: TokenExchangeResponse): boolean {
    const { access_token, expires_at } = tokenResponse;

    if (!access_token || access_token === "") return false;

    const now = Date.now();
    const expiresAt = expires_at * 1000;

    return expiresAt > now;
}

export function canTokenBeRefreshed(
    tokenResponse: TokenExchangeResponse
): boolean {
    const { refresh_token } = tokenResponse;
    return Boolean(refresh_token);
}
