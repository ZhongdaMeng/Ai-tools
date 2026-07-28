import { useRef, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { getMsgList } from '@/api/ai';
import type { GetMsgListParams, GetMsgListItem } from '@/api/ai';
import { useConversationStore } from '@/store';
import './index.scss';

const Messages = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const selectedId = useConversationStore(state => state.selectedId);
    const setSelectedId = useConversationStore(state => state.setSelectedId);
    const optimisticConversations = useConversationStore(state => state.optimisticConversations);
    const removeOptimisticId = useConversationStore(state => state.removeOptimisticId);
    const [params, setParams] = useState<GetMsgListParams>({
        page: 1,
        pageSize: 20
    });
    const [total, setTotal] = useState<number>(0);
    const [msgList, setMsgList] = useState<GetMsgListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const hasNextPage = msgList.length < total;

    useEffect(() => {
        getMsgList(params)
            .then(res => {
                setMsgList(pre => {
                    const existingIds = new Set(pre.map(item => Number(item.id)));
                    const next = [...pre];

                    for (const item of res.list) {
                        if (!existingIds.has(Number(item.id))) {
                            next.push(item);
                        }
                    }

                    return next;
                });
                setTotal(res.total);

                // 后端已返回的乐观会话，清理掉
                const loadedIds = new Set(res.list.map(item => Number(item.id)));
                for (const conversation of optimisticConversations) {
                    if (loadedIds.has(conversation.id)) {
                        removeOptimisticId(conversation.id);
                    }
                }
            })
            .catch(err => {
                messageApi.open({
                    type: 'error',
                    content: err.message
                });
            })
            .finally(() => setLoading(false));
    }, [params, messageApi]);

    // 渲染时合并乐观会话，避免在 useEffect 中同步 setState
    const displayList = useMemo(() => {
        const existingIds = new Set(msgList.map(item => Number(item.id)));
        const optimisticItems: GetMsgListItem[] = [];

        for (const conversation of optimisticConversations) {
            if (!existingIds.has(conversation.id)) {
                optimisticItems.push({
                    id: String(conversation.id),
                    title: conversation.title,
                    createdAt: conversation.createdAt || new Date().toISOString(),
                    updatedAt: conversation.createdAt || new Date().toISOString()
                });
            }
        }

        return optimisticItems.length > 0 ? [...optimisticItems, ...msgList] : msgList;
    }, [msgList, optimisticConversations]);

    useEffect(() => {
        const node = loadMoreRef.current;
        if (!node || !hasNextPage) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0]?.isIntersecting && !loading && hasNextPage) {
                    setParams(pre => ({ ...pre, page: pre.page + 1 }));
                }
            },
            {
                rootMargin: '200px 0px'
            }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [loading, hasNextPage]);

    const handleClickMsg = (id: string) => {
        setSelectedId(Number(id));
        navigate(`/chat/${id}`);
    };

    return (
        <div className="siderContent-msgBox">
            <div className="title">最近</div>

            {displayList.length > 0 ? (
                <div className="msgList-box">
                    {displayList.map(item => {
                        return (
                            <div
                                key={item.id}
                                className={`msgList-item ${selectedId === Number(item.id) ? 'msgList-item-active' : ''}`}
                            >
                                <div
                                    className="msgListItem-title"
                                    onClick={() => handleClickMsg(item.id)}
                                >
                                    {item.title}
                                </div>
                                <div className="msgListItem-icon">
                                    <EllipsisOutlined
                                        className={`msgListItem-icon ${selectedId === Number(item.id) ? 'msgListItemIcon-active' : ''}`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
            {/* 哨兵元素：列表底部 */}
            {hasNextPage && (
                <div ref={loadMoreRef} className="load-more-sentinel">
                    {loading ? '正在加载更多...' : ''}
                </div>
            )}
            {contextHolder}
        </div>
    );
};

export default Messages;
