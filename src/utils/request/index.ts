import server from './http';
import type { ApiResponse } from '@/types/response';
import type { AxiosRequestConfig } from 'axios';

// 包装 get 方法
const get = async <TResponse, TParams = unknown>(
    url: string,
    params?: TParams,
    config?: AxiosRequestConfig
): Promise<TResponse> => {
    const res = await server.get<ApiResponse<TResponse>>(url, {
        ...config,
        params
    });
    return res.data.data;
};

// 包装 post 方法
const post = async <TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
): Promise<TResponse> => {
    const res = await server.post<ApiResponse<TResponse>>(url, data, config);
    return res.data.data;
};

// 包装 put 方法
const put = async <TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
): Promise<TResponse> => {
    const res = await server.put<ApiResponse<TResponse>>(url, data, config);
    return res.data.data;
};

// 包装 del 方法
const del = async <TResponse, TParams = unknown>(
    url: string,
    params?: TParams,
    config?: AxiosRequestConfig
): Promise<TResponse> => {
    const res = await server.delete<ApiResponse<TResponse>>(url, {
        ...config,
        params
    });
    return res.data.data;
};

// 包装 patch 方法
const patch = async <TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
): Promise<TResponse> => {
    const res = await server.patch<ApiResponse<TResponse>>(url, data, config);
    return res.data.data;
};

const http = {
    get,
    post,
    put,
    patch,
    delete: del
} as const;

export default http;
