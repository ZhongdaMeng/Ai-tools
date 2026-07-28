import http from '@/utils/request';

export interface LoginParams {
    account: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface UserInfoType {
    id: number;
    userId: string;
    nickname: string;
    avatar: string | null;
    username: string;
    account: string;
    phone: string;
    email: string;
    gender: number;
    status: number;
    deleted: number;
    role: string;
    lastLoginAt: string | null;
    remark: string | null;
    createdAt: string;
    updatedAt: string;
}

export const login = (data: LoginParams) => {
    return http.post<LoginParams, LoginResponse>('/auth/login', data);
};

export const getUserInfo = () => {
    return http.get<UserInfoType>('/auth/userinfo');
};
