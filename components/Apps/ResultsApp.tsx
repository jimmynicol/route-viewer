import React from "react";
import { ResultsView } from "../ResultsView/ResultsView";
import { AuthState, useAuthStateContext } from "../../contexts/AuthState";
import { TokenRefresh } from "./TokenRefresh";
import { TokenExchange } from "./TokenExchange";

export const ResultsApp: React.ComponentType = () => {
    const { authState } = useAuthStateContext();

    switch (authState) {
        case AuthState.HAS_REFRESH_TOKEN:
            return <TokenRefresh />;
        case AuthState.HAS_AUTHORIZATION_CODE:
            return <TokenExchange />;
        default:
            return <ResultsView />;
    }
};
