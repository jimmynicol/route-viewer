import React, { useState } from "react";
import { TokenExchangeResponse } from "../data/stravaDataTypes";
import {
    canTokenBeRefreshed,
    isTokenValid,
    useAPITokenContext,
} from "./APIToken";
import {
    isQueryParamsValid,
    QueryParams,
    useQueryParamsContext,
} from "./QueryParams";

export enum AuthState {
    QUERY_PARAMS_ERROR = 0,
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
    const { queryParams } = useQueryParamsContext();
    const [authState, setAuthState] = useState<AuthState>(
        determineAuthState(tokenResponse, queryParams)
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

export function determineAuthState(
    tokenResponse: TokenExchangeResponse,
    queryParams: QueryParams
): AuthState {
    if (!isQueryParamsValid()) return AuthState.QUERY_PARAMS_ERROR;
    if (isTokenValid(tokenResponse)) return AuthState.VALID;
    if (canTokenBeRefreshed(tokenResponse)) return AuthState.HAS_REFRESH_TOKEN;
    if (queryParams.authorizationCode) return AuthState.HAS_AUTHORIZATION_CODE;
    return AuthState.UN_AUTH;
}
