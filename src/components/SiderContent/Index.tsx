import { useState } from 'react';
import Options from './components/Options/Index';
import Messages from './components/Messages/Index';
import './index.scss';

interface PropsType {
    menuClick: (type: string, e: number) => void;
}

const SiderContent = (props: PropsType) => {
    const { menuClick } = props;
    const [activeMenu, setActiveMenu] = useState<number>(0);
    const [activeMsg, setActiveMsg] = useState(-1);
    return (
        <div className="siderContent">
            <Options
                activeMenu={activeMenu}
                clickOptions={e => {
                    setActiveMenu(e);
                    setActiveMsg(-1);
                    menuClick('top', e);
                }}
            />
            <Messages
                activeMsg={activeMsg}
                clickMsgItem={e => {
                    setActiveMsg(e);
                    setActiveMenu(-1);
                    menuClick('bottom', e);
                }}
            />
        </div>
    );
};

export default SiderContent;
