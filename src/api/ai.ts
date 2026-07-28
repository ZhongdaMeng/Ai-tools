import http from '@/utils/request';

//

// export const getUserInfo = () => {
//     return http.get<UserInfoType>('/auth/userinfo');
// };

// const get = async <TResponse, TParams = unknown>(
//     url: string,
//     params?: TParams,
//     config?: AxiosRequestConfig
// ): Promise<TResponse> => {
//     const res = await server.get<ApiResponse<TResponse>>(url, {
//         ...config,
//         params
//     });
//     return res.data.data;
// };

export interface GetMsgListParams {
    page: number;
    pageSize: number;
}

export interface GetMsgListItem {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetMsgListResponse {
    list: GetMsgListItem[];
    total: number;
    page: number;
    pageSize: number;
}

export interface GetMsgDetailResponse {
    id: string;
    conversationId: string;
    role: string;
    content: string;
    model: string | null;
    provider: string | null;
    createdAt: string;
}

// 获取会话列表
export const getMsgList = (params: GetMsgListParams) => {
    return http.get<GetMsgListResponse, GetMsgListParams>(
        '/ai/conversations',
        params
    );
};

// 获取详细会话
export const getMsgDetail = (id: string) => {
    return http.get<GetMsgDetailResponse[]>(`/ai/conversations/${id}/messages`);
};
