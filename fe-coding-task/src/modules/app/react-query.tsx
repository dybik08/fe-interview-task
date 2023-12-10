import {QueryClient, QueryClientProvider} from "react-query";
import {PropsWithChildren} from "react";


const defaultQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: ((failureCount, error) => {
                return failureCount <= 3;
            }),
            refetchOnWindowFocus: false
        }
    }
})

interface IReactQueryProviderProps {
    queryClient?: QueryClient
}

export const ReactQueryProvider = ({ children, queryClient = defaultQueryClient }: PropsWithChildren<IReactQueryProviderProps>) => {
    return (
        <QueryClientProvider client={queryClient} >
            {children}
        </QueryClientProvider>
    )
}