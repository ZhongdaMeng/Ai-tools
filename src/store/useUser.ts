import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfoType {
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

interface UserStore {
    token: string;
    userInfo: UserInfoType | null;
    setToken: (token: string) => void;
    setUserInfo: (userInfo: UserInfoType) => void;
    removeToken: () => void;
    removeUserInfo: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        set => ({
            token: '',
            userInfo: null,
            setToken: token => set({ token }),
            setUserInfo: userInfo => set({ userInfo }),
            removeToken: () => set({ token: '' }),
            removeUserInfo: () => set({ userInfo: null })
        }),
        {
            name: 'token',
            partialize: state => ({ token: state.token })
        }
    )
);
