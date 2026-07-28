import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Input, Dropdown, Modal } from 'antd';
import type { MenuProps } from 'antd';
import { EllipsisOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getMsgList, renameConversation, deleteConversation } from '@/api/ai';
import type { GetMsgListParams, GetMsgListItem } from '@/api/ai';
import { useConversationStore } from '@/store';
import './index.scss';

interface Props {
    searchResults: GetMsgListItem[] | null;
    searchTotal: number;
    searchLoading: boolean;
    onLoadMoreSearch: () => void;
}

const Messages = ({ searchResults, searchTotal, searchLoading, onLoadMoreSearch }: Props) => {
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

    // 是否处于搜索模式
    const isSearching = searchResults !== null;
    const hasNextPage = isSearching
        ? searchResults.length < searchTotal
        : msgList.length < total;
    const isLoading = isSearching ? searchLoading : loading;

    // 正在重命名的会话 id
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    // 普通列表加载
    useEffect(() => {
        if (isSearching) return;

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
    }, [params, messageApi, isSearching]);

    // 渲染列表
    const displayList = useMemo(() => {
        if (isSearching) return searchResults;

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
    }, [msgList, optimisticConversations, isSearching, searchResults]);

    // 无限滚动：普通列表和搜索结果共用同一个哨兵
    useEffect(() => {
        const node = loadMoreRef.current;
        if (!node || !hasNextPage || isLoading) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0]?.isIntersecting && hasNextPage && !isLoading) {
                    if (isSearching) {
                        onLoadMoreSearch();
                    } else {
                        setParams(pre => ({ ...pre, page: pre.page + 1 }));
                    }
                }
            },
            { rootMargin: '200px 0px' }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [isLoading, hasNextPage, isSearching, onLoadMoreSearch]);

    const handleClickMsg = (id: string) => {
        if (editingId === id) return;
        setSelectedId(Number(id));
        navigate(`/chat/${id}`);
    };

    const handleStartRename = useCallback((item: GetMsgListItem) => {
        setEditingId(item.id);
        setEditTitle(item.title);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, []);

    const handleRenameConfirm = useCallback(
        (id: string, originalTitle: string) => {
            const title = editTitle.trim();
            setEditingId(null);
            if (!title || title === originalTitle) return;
            renameConversation(Number(id), title)
                .then(() => {
                    setMsgList(pre =>
                        pre.map(item => (item.id === id ? { ...item, title } : item))
                    );
                })
                .catch((err: unknown) => {
                    const msg = err instanceof Error ? err.message : '重命名失败';
                    messageApi.open({ type: 'error', content: msg });
                });
        },
        [editTitle, messageApi]
    );

    const handleDelete = useCallback(
        (id: string) => {
            Modal.confirm({
                className: 'macos-modal',
                title: '确认删除',
                content: '删除后无法恢复，确认删除该会话？',
                okText: '删除',
                cancelText: '取消',
                okButtonProps: { danger: true },
                centered: true,
                onOk: async () => {
                    try {
                        await deleteConversation(Number(id));
                        setMsgList(pre => pre.filter(item => item.id !== id));
                        if (selectedId === Number(id)) {
                            setSelectedId(null);
                            navigate('/chat/newchat');
                        }
                    } catch (err: unknown) {
                        const msg = err instanceof Error ? err.message : '删除失败';
                        messageApi.open({ type: 'error', content: msg });
                    }
                }
            });
        },
        [selectedId, setSelectedId, navigate, messageApi]
    );

    const getMenuItems = useCallback(
        (item: GetMsgListItem): MenuProps['items'] => [
            {
                key: 'rename',
                label: '重命名',
                icon: <EditOutlined />,
                onClick: () => handleStartRename(item)
            },
            { type: 'divider' },
            {
                key: 'delete',
                label: '删除',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDelete(item.id)
            }
        ],
        [handleStartRename, handleDelete]
    );

    return (
        <div className="siderContent-msgBox">
            {!isSearching && <div className="title">最近</div>}

            {displayList.length > 0 ? (
                <div className="msgList-box">
                    {displayList.map(item => {
                        const isEditing = editingId === item.id;
                        return (
                            <div
                                key={item.id}
                                className={`msgList-item ${selectedId === Number(item.id) ? 'msgList-item-active' : ''}`}
                            >
                                {isEditing ? (
                                    <Input
                                        ref={inputRef as never}
                                        className="input-style msgListItem-editInput"
                                        size="small"
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                        onPressEnter={() => handleRenameConfirm(item.id, item.title)}
                                        onBlur={() => handleRenameConfirm(item.id, item.title)}
                                    />
                                ) : (
                                    <div
                                        className="msgListItem-title"
                                        onClick={() => handleClickMsg(item.id)}
                                    >
                                        {item.title}
                                    </div>
                                )}
                                {!isEditing && (
                                    <Dropdown
                                        menu={{ items: getMenuItems(item) }}
                                        trigger={['click']}
                                        placement="bottomRight"
                                    >
                                        <div className="msgListItem-icon">
                                            <EllipsisOutlined
                                                className={`${selectedId === Number(item.id) ? 'msgListItemIcon-active' : ''}`}
                                            />
                                        </div>
                                    </Dropdown>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                isSearching && <div className="search-empty">无匹配结果</div>
            )}
            {/* 哨兵元素：搜索和普通列表共用 */}
            {hasNextPage && (
                <div ref={loadMoreRef} className="load-more-sentinel">
                    {isLoading ? '正在加载更多...' : ''}
                </div>
            )}
            {contextHolder}
        </div>
    );
};

export default Messages;
