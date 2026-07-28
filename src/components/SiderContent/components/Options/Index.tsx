import { Input } from 'antd';
import { OpenAIOutlined } from '@ant-design/icons';

interface PropsType {
    activeMenu: number;
    clickOptions: (e: number) => void;
    keyword: string;
    onSearchChange: (keyword: string) => void;
}

const Options = (props: PropsType) => {
    const { activeMenu, clickOptions, keyword, onSearchChange } = props;
    return (
        <>
            <Input
                className="input-style"
                placeholder="搜索"
                allowClear
                value={keyword}
                onChange={e => onSearchChange(e.target.value)}
                prefix={<i className="iconfont icon-sousuo search-icon"></i>}
            />
            {!keyword && (
                <>
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
                        <i className="sider-item-icon iconfont icon-resume-line"></i>
                        <div className="sider-item-name">简历</div>
                    </div>
                </>
            )}
        </>
    );
};

export default Options;
