import type { NextPage } from "next";

import { QueryClient, QueryClientProvider } from "react-query";
import { RouteApp } from "../components/Apps/RouteApp";
import { QueryParamsProvider } from "../contexts/QueryParams";
import { UnitsProvider } from "../contexts/Units";
import { APITokenProvider } from "../contexts/APIToken";
import { AuthStateProvider } from "../contexts/AuthState";
import { GeolocationProvider } from "../contexts/Geolocation";

export const queryClient = new QueryClient();

const Route: NextPage = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <QueryParamsProvider>
                <APITokenProvider>
                    <AuthStateProvider>
                        <UnitsProvider>
                            <GeolocationProvider>
                                <RouteApp />
                            </GeolocationProvider>
                        </UnitsProvider>
                    </AuthStateProvider>
                </APITokenProvider>
            </QueryParamsProvider>
        </QueryClientProvider>
    );
};

export default Route;
