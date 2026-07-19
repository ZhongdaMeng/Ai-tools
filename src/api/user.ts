import http from '@/utils/request';

export interface LoginParams {
    account: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export const login = (data: LoginParams) => {
    return http.post<LoginParams, LoginResponse>('/auth/login', data);
};
