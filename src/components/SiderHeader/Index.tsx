import { Button } from 'antd';
import './index.scss';

interface Props {
    isCollapsed: boolean;
    clickCloseBtn: () => void;
}
const SiderHeader = (props: Props) => {
    const { isCollapsed, clickCloseBtn } = props;
    const radioColor = ['#ff5c5f', '#fac800', '#34c759'];
    return (
        <div className="sider-header">
            <div className="icon-btn">
                {radioColor.map(item => (
                    <div
                        className="icon-btn-box"
                        style={{ backgroundColor: item }}
                    />
                ))}
            </div>
            <div
                className={`sider-header-btn ${isCollapsed ? 'collapsed' : 'notCollapsed'} `}
            >
                <Button
                    autoInsertSpace={false}
                    type="text"
                    onClick={() => {
                        clickCloseBtn();
                    }}
                >
                    <i className="iconfont icon-icon_cebianlan closeSider-icon"></i>
                </Button>
                <Button autoInsertSpace={false} type="text">
                    <i className="iconfont icon-bianji addInfo-icon"></i>
                </Button>
            </div>
        </div>
    );
};

export default SiderHeader;
