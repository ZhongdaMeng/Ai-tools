import './index.scss';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

const SiderFooter = () => {
    return (
        <div className="siderFooter">
            <div className="siderFooter-box">
                <Avatar
                    style={{ backgroundColor: '#87d068' }}
                    icon={<UserOutlined />}
                />
                <div className="user-name">Leo</div>
            </div>
        </div>
    );
};

export default SiderFooter;
