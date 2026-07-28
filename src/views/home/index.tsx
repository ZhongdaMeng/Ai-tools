import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import SiderHeader from '@/components/SiderHeader/Index';
import SiderFooter from '@/components/SiderFooter/Index';
import SiderContent from '@/components/SiderContent/Index';
// import ThemeToggle from '@/components/ThemeToggle/Index';
import './home.scss';

const { Sider } = Layout;

export const Home = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const closeSider = () => {
        setCollapsed(!collapsed);
    };
    const menuClick = (type: string, e: number) => {
        switch (type) {
            case 'top':
                if (e === 1) {
                    navigate('/note');
                } else {
                    navigate(`/chat/newchat`);
                }
                break;
            case 'bottom':
                navigate(`chat/${e}`);
                break;
        }
    };
    useEffect(() => {
        navigate(`/chat/newchat`);
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
                <Outlet context={{ isCollapsed: collapsed }} />
                {/* <ThemeToggle /> */}
            </div>
        </div>
    );
};
