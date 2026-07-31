import { useState, useMemo } from 'react';
import { useModelStore } from '@/store/index';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
    PlusOutlined,
    GlobalOutlined,
    AudioOutlined,
    ArrowUpOutlined,
    DownOutlined
} from '@ant-design/icons';
import './index.scss';

// 支持的模型列表
const MODEL_OPTIONS: MenuProps['items'] = [
    {
        key: 'Gemma 4',
        label: 'Gemma 4 (Uncensored)',
    },
    {
        key: 'mimo-v2.5-pro',
        label: 'MiMo-V2.5-Pro',
    },
    {
        key: 'mimo-v2.5',
        label: 'MiMo-V2.5',
    },
];

interface PropsType {
    canSend: boolean;
    inputToolsClick: () => void;
    allowModelSelect: boolean;
}

const InputTools = (props: PropsType) => {
    const { canSend, inputToolsClick, allowModelSelect } = props;
    const { model, setModel, setUseInterNet } = useModelStore();

    const [activeGOl, setAactiveGOl] = useState<boolean>(false);
    const disabledGOl = useMemo(() => {
        return model === 'Gemma 4' ? true : false;
    }, [model]);
    const disabledSend = useMemo(() => {
        return !canSend;
    }, [canSend]);

    // 模型选择
    const handleModelSelect: MenuProps['onClick'] = ({ key }) => {
        setModel(key);
    };

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
                // 模型选择通过Dropdown处理
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
                <Dropdown
                    menu={{
                        items: MODEL_OPTIONS,
                        onClick: handleModelSelect,
                        selectedKeys: [model],
                    }}
                    trigger={['click']}
                    disabled={!allowModelSelect}
                >
                    <Button
                        autoInsertSpace={false}
                        type="text"
                        disabled={!allowModelSelect}
                        className="model-select-btn"
                    >
                        <span className="icon-size">{model || 'Auto'}</span>
                        <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
                    </Button>
                </Dropdown>
            </div>
            <div className="send-box">
                <Button
                    autoInsertSpace={false}
                    type="text"
                    onClick={() => btnClick(3)}
                    className="auto-btn"
                    disabled
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
