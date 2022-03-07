import React, { useState } from "react";
import { TokenExchangeResponse } from "../data/stravaDataTypes";
import {
    canTokenBeRefreshed,
    isTokenValid,
    useAPITokenContext,
} from "./APIToken";

export enum AuthState {
    UN_AUTH = 1,
    HAS_REFRESH_TOKEN = 2,
    HAS_AUTHORIZATION_CODE = 3,
    VALID = 4,
}

export interface AuthStateCtx {
    authState: AuthState;
    setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const AuthStateContext = React.createContext<AuthStateCtx>(
    {} as AuthStateCtx
);

export const AuthStateProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { tokenResponse } = useAPITokenContext();
    const authCode = parseAuthQueryParam();
    const [authState, setAuthState] = useState<AuthState>(
        determineAuthState(tokenResponse, authCode)
    );

    return (
        <AuthStateContext.Provider value={{ authState, setAuthState }}>
            {children}
        </AuthStateContext.Provider>
    );
};

export const useAuthStateContext = (): AuthStateCtx => {
    return React.useContext(AuthStateContext);
};

export function parseAuthQueryParam(): string | null {
    const params =
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : new URLSearchParams();

    return params.get("code");
}

export function determineAuthState(
    tokenResponse: TokenExchangeResponse,
    authCode: string | null
): AuthState {
    if (isTokenValid(tokenResponse)) return AuthState.VALID;
    if (canTokenBeRefreshed(tokenResponse)) return AuthState.HAS_REFRESH_TOKEN;
    if (authCode) return AuthState.HAS_AUTHORIZATION_CODE;
    return AuthState.UN_AUTH;
}
