import { useState } from 'react';
import { Layout, Menu } from 'antd';
import SiderHeader from '@/components/SiderHeader/Index';
import SiderFooter from '@/components/SiderFooter/Index';
import SiderContent from '@/components/SiderContent/Index';
// import ThemeToggle from '@/components/ThemeToggle/Index';
import './home.scss';

const { Sider } = Layout;

export const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const closeSider = () => {
        setCollapsed(!collapsed);
    };
    return (
        <div className="home-main">
            <div className="home-sider">
                <SiderHeader
                    clickCloseBtn={closeSider}
                    isCollapsed={collapsed}
                />
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width="230"
                    collapsedWidth="0"
                >
                    <SiderContent />
                    <Menu />
                    <SiderFooter />
                </Sider>
            </div>
            <div className="home-content">{/* <ThemeToggle /> */}</div>
        </div>
    );
};
