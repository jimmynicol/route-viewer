import type { NextPage } from "next";
import { QueryClient, QueryClientProvider } from "react-query";
import { ResultsApp } from "../../components/Apps/ResultsApp";
import { APITokenProvider } from "../../contexts/APIToken";
import { AthleteDataProvider } from "../../contexts/AthleteData";
import { AuthStateProvider } from "../../contexts/AuthState";
import { ResultsDataProvider } from "../../contexts/ResultsData";

const queryClient = new QueryClient();

const Results: NextPage = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <APITokenProvider>
                <AuthStateProvider>
                    <ResultsDataProvider>
                        <AthleteDataProvider>
                            <ResultsApp />
                        </AthleteDataProvider>
                    </ResultsDataProvider>
                </AuthStateProvider>
            </APITokenProvider>
        </QueryClientProvider>
    );
};

export default Results;
