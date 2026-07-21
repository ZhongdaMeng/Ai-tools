import { useThemeStore } from '@/store/useTheme';
import type { ThemeMode } from '@/store/useTheme';
import { Button, Dropdown } from 'antd';
import { SunOutlined, MoonOutlined, DesktopOutlined } from '@ant-design/icons';

const ThemeToggle = () => {
    const { theme, setTheme } = useThemeStore();

    const items = [
        {
            key: 'light',
            icon: <SunOutlined />,
            label: '亮色模式'
        },
        {
            key: 'dark',
            icon: <MoonOutlined />,
            label: '暗色模式'
        },
        {
            key: 'system',
            icon: <DesktopOutlined />,
            label: '跟随系统'
        }
    ];

    const getCurrentIcon = () => {
        switch (theme) {
            case 'light':
                return <SunOutlined />;
            case 'dark':
                return <MoonOutlined />;
            case 'system':
                return <DesktopOutlined />;
            default:
                return <SunOutlined />;
        }
    };

    return (
        <Dropdown
            menu={{
                items,
                selectedKeys: [theme],
                onClick: ({ key }) => setTheme(key as ThemeMode)
            }}
            trigger={['click']}
        >
            <Button type="text" icon={getCurrentIcon()} />
        </Dropdown>
    );
};

export default ThemeToggle;
