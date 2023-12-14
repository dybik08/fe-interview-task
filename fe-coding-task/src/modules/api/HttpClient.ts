import {AxiosInstance, AxiosResponse} from 'axios'

export interface IHttpClient {
    get<ReturnType>(
        url: string,
        options?: { params?: Record<string, unknown>; headers?: Record<string, string | number | boolean> },
    ): Promise<ReturnType>
    
    post<RequestDataType, ReturnType = void>(
        url: string,
        requestData?: RequestDataType,
        options?: { headers?: Record<string, string | number | boolean>}
    ): Promise<ReturnType>
    
    put<RequestDataType, ReturnType = void>(url: string, requestData: RequestDataType): Promise<ReturnType>
    
    patch<RequestDataType, ReturnType = void>(url: string, requestData: RequestDataType): Promise<ReturnType>
    
    delete<ReturnType = void>(url: string): Promise<ReturnType>
}

export class HttpClient implements IHttpClient {
    constructor(private readonly client: AxiosInstance) {}
    
    async get<ReturnType>(
        url: string,
        options: { params?: Record<string, unknown>; headers?: Record<string, string | number | boolean> } = {}
    ): Promise<ReturnType> {
        return this.client.get<ReturnType>(url, options).then(res => res.data)
    }
    
    async post<RequestDataType, ReturnType = void>(
        url: string,
        requestData: RequestDataType,
        options?: { headers?: Record<string, string | number | boolean>}
    ): Promise<ReturnType> {
        return this.client.post<RequestDataType, AxiosResponse<ReturnType>>(url, requestData,  options).then(res => res.data)
    } 
    
    async put<RequestDataType, ReturnType = void>(
        url: string,
        requestData: RequestDataType,
    ): Promise<ReturnType> {
        return this.client.put<RequestDataType, AxiosResponse<ReturnType>>(url, requestData).then(res => res.data)
    }  
    async patch<RequestDataType, ReturnType = void>(
        url: string,
        requestData: RequestDataType,
    ): Promise<ReturnType> {
        return this.client.patch<RequestDataType, AxiosResponse<ReturnType>>(url, requestData).then(res => res.data)
    } 
    
    async delete<ReturnType = void>(
        url: string,
    ): Promise<ReturnType> {
        return this.client.delete<ReturnType>(url).then(res => res.data)
    }
}