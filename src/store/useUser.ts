import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
    token: string;
    setToken: (token: string) => void;
    removeToken: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        set => ({
            token: '',
            setToken: token => set({ token }),
            removeToken: () => set({ token: '' })
        }),
        {
            name: 'token',
            partialize: state => ({ token: state.token })
        }
    )
);
