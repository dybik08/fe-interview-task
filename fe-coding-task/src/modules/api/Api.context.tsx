import {createContext, PropsWithChildren, useContext} from "react";
import {IApi} from './Api.interface'
import {HttpClient} from "./HttpClient";
import axios from "axios";
import {PropertyStatisticsApi} from "../PropertyStatistics/api";

type IApiContext = IApi

const ApiContext = createContext({} as IApiContext)

interface IApiProviderProps {
    api?: Partial<IApi>
}

export const ApiContextProvider = ({children, api = {}}: PropsWithChildren<IApiProviderProps>) => {
    const client = axios.create()
    const httpClient = new HttpClient(client)
    
    const API: IApi = {
        propertyStatisticsApi: new PropertyStatisticsApi(httpClient),
        ...api
    }
    
    return (
        <ApiContext.Provider value={API} >
            {children}
        </ApiContext.Provider>
    )
}

export const useApi = () => useContext(ApiContext)