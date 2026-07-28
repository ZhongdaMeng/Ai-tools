import { useState, useMemo } from 'react';
import { useModelStore } from '@/store/index';
import { Button } from 'antd';
import {
    PlusOutlined,
    GlobalOutlined,
    AudioOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';
import './index.scss';

interface PropsType {
    canSend: boolean;
    inputToolsClick: () => void;
}

const InputTools = (props: PropsType) => {
    const { canSend, inputToolsClick } = props;
    const { model, setUseInterNet } = useModelStore();

    const [activeGOl, setAactiveGOl] = useState<boolean>(false);
    const disabledGOl = useMemo(() => {
        return model === 'Gemma 4' ? true : false;
    }, [model]);
    const disabledSend = useMemo(() => {
        return !canSend;
    }, [canSend]);

    const btnClick = (type: number) => {
        switch (type) {
            case 0:
                console.log('+号', type);
                break;
            case 1:
                console.log('网络', type);
                setAactiveGOl(!activeGOl);
                setUseInterNet(!activeGOl);
                break;
            case 2:
                console.log('模型选择', type);
                break;
            case 3:
                console.log('语音', type);
                break;
            case 4:
                console.log('发送', type);
                if (!disabledSend) {
                    inputToolsClick();
                }
                break;
        }
    };

    return (
        <div className="tools-box">
            <div className="input-tools">
                <Button
                    autoInsertSpace={false}
                    type="text"
                    disabled
                    onClick={() => btnClick(0)}
                >
                    <PlusOutlined className="icon-size" />
                </Button>
                <Button
                    autoInsertSpace={false}
                    type="text"
                    disabled={disabledGOl}
                    onClick={() => btnClick(1)}
                >
                    <GlobalOutlined
                        className={`icon-size ${activeGOl ? 'isActive' : ''}`}
                    />
                </Button>
                <Button
                    autoInsertSpace={false}
                    type="text"
                    onClick={() => btnClick(2)}
                >
                    <span className="icon-size">Auto</span>
                </Button>
            </div>
            <div className="send-box">
                <Button
                    autoInsertSpace={false}
                    type="text"
                    onClick={() => btnClick(3)}
                    className="auto-btn"
                >
                    <AudioOutlined className="icon-size" />
                </Button>
                <div
                    onClick={() => btnClick(4)}
                    className={`send-btn ${disabledSend ? 'not-send' : 'can-send'}`}
                >
                    <ArrowUpOutlined className="sendIcon-size" />
                </div>
            </div>
        </div>
    );
};

export default InputTools;
