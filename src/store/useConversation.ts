import { create } from 'zustand';

export interface OptimisticConversation {
    id: number;
    title: string;
    createdAt?: string;
}

interface ConversationState {
    selectedId: number | null;
    optimisticConversations: OptimisticConversation[];
    setSelectedId: (id: number | null) => void;
    prependOptimistic: (conversation: OptimisticConversation) => void;
    removeOptimisticId: (id: number) => void;
}

export const useConversationStore = create<ConversationState>()(
    set => ({
        selectedId: null,
        optimisticConversations: [],
        setSelectedId: id => {
            set({ selectedId: id });
        },
        prependOptimistic: conversation => {
            set(state => {
                const exists = state.optimisticConversations.some(
                    item => item.id === conversation.id
                );

                return {
                    selectedId: conversation.id,
                    optimisticConversations: exists
                        ? state.optimisticConversations
                        : [conversation, ...state.optimisticConversations]
                };
            });
        },
        removeOptimisticId: id => {
            set(state => ({
                optimisticConversations: state.optimisticConversations.filter(
                    item => item.id !== id
                )
            }));
        }
    })
);
