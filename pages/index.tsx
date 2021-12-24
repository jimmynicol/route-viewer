import type { NextPage } from "next";
import { QueryClient, QueryClientProvider } from "react-query";
import { App } from "../components/App/App";
import { QueryParamsProvider } from "../contexts/QueryParams";
import { UnitsProvider } from "../contexts/Units";
import { APITokenProvider } from "../contexts/APIToken";
import { AuthStateProvider } from "../contexts/AuthState";
import { GeolocationProvider } from "../contexts/GeoLocation";

export const queryClient = new QueryClient();

const Home: NextPage = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <QueryParamsProvider>
                <APITokenProvider>
                    <AuthStateProvider>
                        <UnitsProvider>
                            <GeolocationProvider>
                                <App />
                            </GeolocationProvider>
                        </UnitsProvider>
                    </AuthStateProvider>
                </APITokenProvider>
            </QueryParamsProvider>
        </QueryClientProvider>
    );
};

export default Home;
