import { useThemeStore } from '@/store/useTheme';
import type { ThemeMode } from '@/store/useTheme';
import { Dropdown } from 'antd';
import './index.scss'

const ThemeToggle = () => {
    const { theme, setTheme } = useThemeStore();

    const items = [
        {
            key: 'light',
            icon: <i className="iconfont icon-baisezhuti"></i>,
            label: '亮色模式'
        },
        {
            key: 'dark',
            icon: <i className="iconfont icon-anse"></i>,
            label: '暗色模式'
        },
        {
            key: 'system',
            icon: <i className="iconfont icon-xitong"></i>,
            label: '跟随系统'
        }
    ];

    const getCurrentIcon = () => {
        switch (theme) {
            case 'light':
                return 'icon-baisezhuti';
            case 'dark':
                return 'icon-anse';
            case 'system':
                return 'icon-xitong';
            default:
                return 'icon-baisezhuti';
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
            <i className={`iconfont ${getCurrentIcon()}`}></i>
        </Dropdown>
    );
};

export default ThemeToggle;
