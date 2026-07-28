import { Input } from 'antd';
import { OpenAIOutlined } from '@ant-design/icons';

interface PropsType {
    activeMenu: number;
    clickOptions: (e: number) => void;
}

const Options = (props: PropsType) => {
    const { activeMenu, clickOptions } = props;
    return (
        <>
            <Input
                className="input-style"
                placeholder="搜索"
                prefix={<i className="iconfont icon-sousuo search-icon"></i>}
            />
            <div
                className={`${activeMenu === 0 ? 'sider-item-active' : 'sider-item'}`}
                onClick={() => clickOptions(0)}
            >
                <OpenAIOutlined className="sider-item-icon" />
                <div className="sider-item-name">Ai Chat</div>
            </div>
            <div
                className={`${activeMenu === 1 ? 'sider-item-active' : 'sider-item'}`}
                onClick={() => clickOptions(1)}
            >
                <i className="sider-item-icon iconfont icon-shujia1"></i>
                <div className="sider-item-name">库</div>
            </div>
        </>
    );
};

export default Options;
