import { useState, useRef, useEffect } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { getMsgDetail, streamChat } from '@/api/ai.ts';
import type { GetMsgDetailResponse } from '@/api/ai.ts';
import { useUserStore } from '@/store/useUser.ts';
import { useModelStore } from '@/store/useModel.ts';

import InputBox from './components/InputBox/Index.tsx';
import InputTools from './components/InputTools/Index.tsx';
import MsgBox from './components/MsgBox/Index.tsx';
// import ThemeToggle from '@/components/ThemeToggle/Index.tsx';
import './index.scss';

interface ContextType {
    isCollapsed: boolean;
    onConversationCreated?: (conversationId: string, firstUserContent?: string) => void;
}
export const HomeContent = () => {
    const { onConversationCreated } = useOutletContext<ContextType>();
    const navigate = useNavigate();
    const { id } = useParams();
    const token = useUserStore(state => state.token);
    const model = useModelStore(state => state.model);

    const inputRef = useRef<HTMLInputElement>(null);
    const [inputBoxHeight, setInputBoxHeight] = useState<number>(0);
    const [inputInfo, setInputInfo] = useState<string>('');
    const [msgList, setMsgList] = useState<GetMsgDetailResponse[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(id);
    const currentConversationIdRef = useRef<string | undefined>(id === 'newchat' ? undefined : id);

    // 流式输出状态
    const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
    const [streamingContent, setStreamingContent] = useState<string>('');
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const cancelStreamRef = useRef<(() => void) | null>(null);

    const sendMsg = async () => {
        if (!inputInfo.trim() || isStreaming) return;
        if (!token) {
            message.warning('请先登录');
            return;
        }

        const messageContent = inputInfo;
        setInputInfo('');

        const userMessage: GetMsgDetailResponse = {
            id: `user-${Date.now()}`,
            conversationId: currentConversationId || 'newchat',
            role: 'user',
            content: messageContent,
            model: null,
            provider: null,
            createdAt: new Date().toISOString()
        };

        const aiMessageId = `ai-${Date.now()}`;
        const aiMessage: GetMsgDetailResponse = {
            id: aiMessageId,
            conversationId: currentConversationId || 'newchat',
            role: 'assistant',
            content: '',
            model,
            provider: null,
            createdAt: new Date().toISOString()
        };

        // 添加用户消息和AI消息占位
        setMsgList(prev => [...prev, userMessage, aiMessage]);

        // 开始流式输出
        setIsStreaming(true);
        setStreamingMessageId(aiMessageId);
        setStreamingContent('');

        try {
            // 调用真正的SSE流式API
            const cancelStream = await streamChat(
                messageContent,
                token,
                model,
                {
                    onChunk: (chunk) => {
                        setStreamingContent(prev => prev + chunk);
                    },
                    onComplete: (fullContent) => {
                        // 流式完成，更新消息内容
                        setMsgList(prev =>
                            prev.map(msg =>
                                msg.id === aiMessageId
                                    ? { ...msg, content: fullContent }
                                    : msg
                            )
                        );
                        setIsStreaming(false);
                        setStreamingMessageId(null);
                        setStreamingContent('');
                        // 流式完成后导航到新会话（如果当前处于 newchat）
                        const latestId = currentConversationIdRef.current;
                        if (latestId && id === 'newchat') {
                            navigate(`/chat/${latestId}`, { replace: true });
                        }
                    },
                    onConversationId: (conversationId) => {
                        // 保存会话ID
                        setCurrentConversationId(conversationId);
                        currentConversationIdRef.current = conversationId;
                        // 更新用户消息和AI消息的conversationId
                        setMsgList(prev =>
                            prev.map(msg =>
                                msg.id === userMessage.id || msg.id === aiMessageId
                                    ? { ...msg, conversationId }
                                    : msg
                            )
                        );
                    },
                    onConversationCreated: (conversationId) => {
                        // 通知父组件：乐观插入侧边栏 + 导航到新会话
                        onConversationCreated?.(conversationId, messageContent);
                    },
                    onError: (error) => {
                        console.error('流式输出错误:', error);
                        // 更新AI消息为错误提示
                        setMsgList(prev =>
                            prev.map(msg =>
                                msg.id === aiMessageId
                                    ? { ...msg, content: `错误: ${error.message}` }
                                    : msg
                            )
                        );
                        setIsStreaming(false);
                        setStreamingMessageId(null);
                        setStreamingContent('');
                    }
                },
                currentConversationId
            );

            cancelStreamRef.current = cancelStream;
        } catch (error) {
            console.error('发送消息失败:', error);
            setIsStreaming(false);
            setStreamingMessageId(null);
            setStreamingContent('');
        }
    };

    // 当 id 变化时，重置所有会话状态并按需拉取新会话
    useEffect(() => {
        const newConversationId = id === 'newchat' ? undefined : id;

        // 流式完成后导航到同一会话时，跳过重置，避免闪烁
        if (newConversationId && newConversationId === currentConversationIdRef.current) {
            return;
        }

        // 取消进行中的流式输出
        if (cancelStreamRef.current) {
            cancelStreamRef.current();
            cancelStreamRef.current = null;
        }

        // 重置会话相关状态
        setMsgList([]);
        setCurrentConversationId(newConversationId);
        currentConversationIdRef.current = newConversationId;
        setInputInfo('');
        setIsStreaming(false);
        setStreamingMessageId(null);
        setStreamingContent('');

        let cancelled = false;
        if (id && id !== 'newchat') {
            getMsgDetail(id)
                .then(res => {
                    if (!cancelled) setMsgList(res);
                })
                .catch(err => {
                    if (!cancelled) console.log(err);
                });
        }
        return () => { cancelled = true; };
    }, [id]);

    // 监听高度变化 输入框自动增高
    useEffect(() => {
        const el = inputRef.current;
        if (!el) return;
        // 首次测量
        setInputBoxHeight(el.clientHeight);

        // 监听高度变化 输入框自动增高
        const observer = new ResizeObserver(([entry]) => {
            setInputBoxHeight(entry.contentRect.height);
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // 清理流式输出
    useEffect(() => {
        return () => {
            if (cancelStreamRef.current) {
                cancelStreamRef.current();
            }
        };
    }, []);

    return (
        <div className="homeContent">
            {/* <div
                className={`content-header ${isCollapsed ? 'collapsed' : 'not-collapsed'}`}
            >
                <ThemeToggle />
            </div> */}
            <div
                className="content-box"
                style={{ paddingBottom: `${inputBoxHeight + 20}px` }}
            >
                {msgList.length > 0 && (
                    <MsgBox
                        msgList={msgList}
                        streamingMessageId={streamingMessageId}
                        streamingContent={streamingContent}
                        isStreaming={isStreaming}
                    />
                )}

                <div className="content-input" ref={inputRef}>
                    <div className="input-box">
                        <InputBox
                            inputInfo={inputInfo}
                            onChange={e => setInputInfo(e)}
                        />
                    </div>
                    <InputTools
                        canSend={inputInfo.length > 0 && !isStreaming}
                        inputToolsClick={sendMsg}
                        allowModelSelect={id === 'newchat' && !currentConversationId}
                    />
                </div>
            </div>
        </div>
    );
};
