import React from "react";
import { AuthState, useAuthStateContext } from "../../contexts/AuthState";
import { OAuth } from "../OAuth/OAuth";
import { RouteView } from "../RouteView/RouteView";
import { QueryParamsError } from "./QueryParamError";

import { TokenExchange } from "./TokenExchange";
import { TokenRefresh } from "./TokenRefresh";

export const App: React.ComponentType = () => {
    const { authState } = useAuthStateContext();

    switch (authState) {
        case AuthState.QUERY_PARAMS_ERROR:
            return <QueryParamsError />;
        case AuthState.UN_AUTH:
            return <OAuth />;
        case AuthState.HAS_REFRESH_TOKEN:
            return <TokenRefresh />;
        case AuthState.HAS_AUTHORIZATION_CODE:
            return <TokenExchange />;
        case AuthState.VALID:
        default:
            return <RouteView />;
    }
};
