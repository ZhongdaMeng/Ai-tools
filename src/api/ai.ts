import http from '@/utils/request';

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

// 重命名会话
export const renameConversation = (id: number, title: string) => {
    return http.patch<unknown, unknown>(`/ai/conversations/${id}/title`, { title });
};

// 删除会话
export const deleteConversation = (id: number) => {
    return http.delete<unknown>(`/ai/conversations/${id}`);
};

// 搜索会话
export interface SearchConversationsParams {
    keyword: string;
    page: number;
    pageSize: number;
}

export const searchConversations = (params: SearchConversationsParams) => {
    return http.get<GetMsgListResponse, SearchConversationsParams>(
        '/ai/conversations/search',
        params
    );
};

// SSE流式聊天API
export interface StreamChatCallbacks {
    onChunk: (chunk: string) => void;
    onComplete: (fullContent: string) => void;
    onConversationId?: (conversationId: string) => void;
    onConversationCreated?: (conversationId: string) => void;
    onError?: (error: Error) => void;
}

// 模型名称映射
// Gemma 4: Local Provider (LM Studio)，前端传 'Gemma 4'，后端自动映射为实际模型名
// mimo-v2.5-pro / mimo-v2.5: MiMo Provider
const MODEL_MAPPING: Record<string, string> = {
    'Gemma 4': 'Gemma 4',
    'mimo-v2.5-pro': 'mimo-v2.5-pro',
    'mimo-v2.5': 'mimo-v2.5',
};

// Provider映射
const PROVIDER_MAPPING: Record<string, 'mimo' | 'local'> = {
    'Gemma 4': 'local',
    'mimo-v2.5-pro': 'mimo',
    'mimo-v2.5': 'mimo',
};

export const streamChat = async (
    message: string,
    token: string,
    modelName: string,
    callbacks: StreamChatCallbacks,
    conversationId?: string
): Promise<(() => void)> => {
    const { onChunk, onComplete, onConversationId, onConversationCreated, onError } = callbacks;
    
    // 映射模型和provider
    const model = MODEL_MAPPING[modelName] || 'mimo-v2-pro';
    const provider = PROVIDER_MAPPING[modelName] || 'mimo';
    
    let isCancelled = false;
    let fullContent = '';
    
    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: message }],
                model,
                provider,
                stream: true,
                ...(conversationId ? { conversationId } : {}),
            }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('无法获取响应流');
        }
        
        const decoder = new TextDecoder();
        let buffer = '';
        
        // 处理流式数据
        const processStream = async () => {
            try {
                while (true) {
                    if (isCancelled) {
                        reader.cancel();
                        break;
                    }
                    
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';
                    
                    for (const line of lines) {
                        if (isCancelled) break;
                        
                        // 忽略心跳注释
                        if (line.startsWith(':')) continue;
                        
                        // 处理data行
                        if (line.startsWith('data: ')) {
                            const payload = line.slice(6).trim();
                            
                            // 流结束
                            if (payload === '[DONE]') {
                                onComplete(fullContent);
                                return;
                            }
                            
                            try {
                                const data = JSON.parse(payload);
                                
                                // 第一条消息包含conversationId
                                if (data.conversationId) {
                                    if (onConversationId) {
                                        onConversationId(data.conversationId);
                                    }
                                    if (onConversationCreated) {
                                        onConversationCreated(data.conversationId);
                                    }
                                    continue;
                                }
                                
                                // AI回复的增量内容
                                const delta = data.choices?.[0]?.delta?.content;
                                if (delta) {
                                    fullContent += delta;
                                    onChunk(delta);
                                }
                            } catch (e) {
                                // 解析错误，忽略
                                console.warn('解析SSE数据失败:', e);
                            }
                        }
                    }
                }
                
                // 如果循环正常结束（没有[DONE]标记），也调用onComplete
                if (!isCancelled) {
                    onComplete(fullContent);
                }
            } catch (error) {
                if (!isCancelled && onError) {
                    onError(error instanceof Error ? error : new Error('流式读取失败'));
                }
            }
        };
        
        processStream();
        
    } catch (error) {
        if (onError) {
            onError(error instanceof Error ? error : new Error('请求失败'));
        }
    }
    
    // 返回取消函数
    return () => {
        isCancelled = true;
    };
};
