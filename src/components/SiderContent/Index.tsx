import { Input } from 'antd';

import './index.scss';

const SiderContent = () => {
    return (
        <div className="siderContent">
            <Input
                className="input-style"
                placeholder="搜索"
                prefix={<i className="iconfont icon-sousuo search-icon"></i>}
            />
        </div>
    );
};

export default SiderContent;
