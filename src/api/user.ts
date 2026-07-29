import http from '@/utils/request';

export interface LoginParams {
    account: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface RegisterParams {
    username: string;
    account: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
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

export const register = (data: RegisterParams) => {
    return http.post<RegisterParams, RegisterResponse>('/auth/register', data);
};

export interface ChangePasswordParams {
    newPassword: string;
}

export const logout = () => {
    return http.post<unknown, RegisterResponse>('/auth/logout');
};

export const changePassword = (data: ChangePasswordParams) => {
    return http.post<ChangePasswordParams, RegisterResponse>('/auth/change-password', data);
};

export const getUserInfo = () => {
    return http.get<UserInfoType>('/auth/userinfo');
};

export interface UpdateUserInfoParams {
    username?: string;
    nickname?: string;
    phone?: string;
    email?: string;
    gender?: number;
}

export const updateUserInfo = (data: UpdateUserInfoParams) => {
    return http.post<UpdateUserInfoParams, UserInfoType>('/auth/update-userinfo', data);
};
