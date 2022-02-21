import type { NextPage } from "next";
import { QueryClient, QueryClientProvider } from "react-query";
import { ResultsApp } from "../../components/Apps/ResultsApp";
import { APITokenProvider } from "../../contexts/APIToken";
import { AuthStateProvider } from "../../contexts/AuthState";

const queryClient = new QueryClient();

const Results: NextPage = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <APITokenProvider>
                <AuthStateProvider>
                    <ResultsApp />
                </AuthStateProvider>
            </APITokenProvider>
        </QueryClientProvider>
    );
};

export default Results;
