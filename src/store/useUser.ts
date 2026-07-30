import { create } from 'zustand';
import { getUserInfo } from '@/api/user';
import { useConversationStore } from '@/store';
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
    /** 标记是否已经完成启动时的用户信息校验 */
    bootstrapped: boolean;
    setToken: (token: string) => void;
    setUserInfo: (userInfo: UserInfoType) => void;
    removeToken: () => void;
    removeUserInfo: () => void;
    clearSession: () => void;
    /**
     * 应用启动时拉取用户信息：
     * 1. 先读取本地 token（store 优先，其次 localStorage）。
     * 2. 有 token 才请求 /auth/userinfo；请求成功写入 userInfo。
     * 3. 若请求失败且属于登录失效（401），则清理 userInfo + 会话列表并移除 token。
     */
    bootstrapUserSession: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            token: '',
            userInfo: null,
            bootstrapped: false,
            setToken: token => set({ token }),
            setUserInfo: userInfo => set({ userInfo }),
            removeToken: () => set({ token: '' }),
            removeUserInfo: () => set({ userInfo: null }),
            clearSession: () => {
                localStorage.removeItem('token');
                set({ token: '', userInfo: null });
                useConversationStore.getState().reset();
            },
            bootstrapUserSession: async () => {
                const token = get().token || localStorage.getItem('token');
                if (!token) {
                    // 未登录：确保不持有残留用户信息，并标记已完成校验
                    set({ userInfo: null, bootstrapped: true });
                    return;
                }

                try {
                    const res = await getUserInfo();
                    set({ userInfo: res, bootstrapped: true });
                } catch {
                    // 只要有本地 token 但 userinfo 获取失败，即视为登录态不可用：统一清理
                    get().clearSession();
                    set({ bootstrapped: true });
                }
            }
        }),
        {
            name: 'token',
            partialize: state => ({ token: state.token })
        }
    )
);
