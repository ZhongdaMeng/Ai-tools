import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
    model: string;
    useInterNet: boolean;
    setModel: (Model: string) => void;
    removeModel: () => void;
    setUseInterNet: (isUse: boolean) => void;
}

export const useModelStore = create<UserStore>()(
    persist(
        set => ({
            model: 'Gemma 4',
            useInterNet: false,
            setModel: model => set({ model }),
            removeModel: () => set({ model: '' }),
            setUseInterNet: isUse => set({ useInterNet: isUse })
        }),
        {
            name: 'model',
            partialize: state => ({ Model: state.model })
        }
    )
);
