import React from "react";
import { useRouter } from "next/router";
import { ResultsView } from "../ResultsView/ResultsView";
import { AuthState, useAuthStateContext } from "../../contexts/AuthState";
import { TokenRefresh } from "./TokenRefresh";
import { TokenExchange } from "./TokenExchange";

export const ResultsApp: React.ComponentType = () => {
    const router = useRouter();
    const { resultsName } = router.query;
    const { authState } = useAuthStateContext();

    if (!resultsName) return <div></div>;

    const _resultsName = Array.isArray(resultsName)
        ? resultsName[0]
        : resultsName || "";

    switch (authState) {
        case AuthState.HAS_REFRESH_TOKEN:
            return <TokenRefresh />;
        case AuthState.HAS_AUTHORIZATION_CODE:
            return <TokenExchange />;
        default:
            return <ResultsView resultsName={_resultsName} />;
    }
};
