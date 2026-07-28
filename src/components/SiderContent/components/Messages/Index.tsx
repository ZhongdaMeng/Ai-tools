import { useRef, useEffect, useState } from 'react';
import { message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { getMsgList } from '@/api/ai';
import type { GetMsgListParams, GetMsgListItem } from '@/api/ai';
import './index.scss';

interface PropsType {
    activeMsg: number;
    clickMsgItem: (e: number) => void;
}

const Messages = (props: PropsType) => {
    const { activeMsg, clickMsgItem } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
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
                    return [...pre, ...res.list];
                });
                setTotal(res.total);
            })
            .catch(err => {
                messageApi.open({
                    type: 'error',
                    content: err.message
                });
            })
            .finally(() => setLoading(false));
    }, [params, messageApi]);

    useEffect(() => {
        const node = loadMoreRef.current;
        if (!node || !hasNextPage) return;

        const observer = new IntersectionObserver(
            entries => {
                // 哨兵进入视口 && 不在加载中 && 还有下一页
                if (entries[0]?.isIntersecting && !loading && hasNextPage) {
                    setParams(pre => ({ ...pre, page: pre.page + 1 }));
                }
            },
            {
                rootMargin: '200px 0px' // 提前 200px 触发，体验更丝滑
            }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [loading, hasNextPage]);

    return (
        <div className="siderContent-msgBox">
            <div className="title">最近</div>

            {msgList.length > 0 ? (
                <div className="msgList-box">
                    {msgList.map(item => {
                        return (
                            <div
                                key={item.id}
                                className={`msgList-item ${activeMsg === Number(item.id) ? 'msgList-item-active' : ''}`}
                            >
                                <div
                                    className="msgListItem-title"
                                    onClick={() => {
                                        clickMsgItem(Number(item.id));
                                    }}
                                >
                                    {item.title}
                                </div>
                                <div className="msgListItem-icon">
                                    <EllipsisOutlined
                                        className={`msgListItem-icon ${activeMsg === Number(item.id) ? 'msgListItemIcon-active' : ''}`}
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
