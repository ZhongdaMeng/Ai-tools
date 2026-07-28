import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import SiderHeader from '@/components/SiderHeader/Index';
import SiderFooter from '@/components/SiderFooter/Index';
import SiderContent from '@/components/SiderContent/Index';
import { useConversationStore } from '@/store';
// import ThemeToggle from '@/components/ThemeToggle/Index';
import './home.scss';

const { Sider } = Layout;

export const Home = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const conversationStore = useConversationStore();
    const closeSider = () => {
        setCollapsed(!collapsed);
    };
    const menuClick = (type: string, e: number) => {
        switch (type) {
            case 'top':
                if (e === 1) {
                    navigate('/note');
                } else {
                    conversationStore.setSelectedId(null);
                    navigate(`/chat/newchat`);
                }
                break;
            case 'bottom':
                conversationStore.setSelectedId(e);
                navigate(`chat/${e}`);
                break;
        }
    };
    const onConversationCreated = (conversationId: string, firstUserContent?: string) => {
        const id = Number(conversationId);
        if (!Number.isNaN(id)) {
            conversationStore.prependOptimistic({
                id,
                title: firstUserContent?.slice(0, 20) || '新会话',
                createdAt: new Date().toISOString()
            });
            // 不在这里 navigate，避免触发 useEffect([id]) 取消 SSE 流式
        }
    };
    useEffect(() => {
        // 浏览器刷新或首次进入时，统一重置到新聊天页面
        const pathname = window.location.pathname;
        if (pathname === '/' || (pathname.startsWith('/chat/') && pathname !== '/chat/newchat')) {
            const id = Number(pathname.split('/')[2]);
            conversationStore.setSelectedId(Number.isNaN(id) ? null : id);
            navigate('/chat/newchat', { replace: true });
        }
    }, [navigate]);
    return (
        <div className="home-main">
            <SiderHeader clickCloseBtn={closeSider} isCollapsed={collapsed} />
            <div className="home-sider">
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width="230"
                    collapsedWidth="0"
                    className={collapsed ? 'sider-collapsed' : 'not-collapsed'}
                >
                    <SiderContent menuClick={menuClick} />
                    <SiderFooter collapsed={collapsed} />
                </Sider>
            </div>
            <div className="home-content">
                <Outlet context={{ isCollapsed: collapsed, onConversationCreated }} />
                {/* <ThemeToggle /> */}
            </div>
        </div>
    );
};
