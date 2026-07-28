import { Input, ConfigProvider } from 'antd';
const { TextArea } = Input;

interface PropsType {
    onChange: (e: string) => void;
    inputInfo: string;
}
const InputBox = (props: PropsType) => {
    const { onChange, inputInfo } = props;

    return (
        <ConfigProvider
            theme={{
                components: {
                    Input: {
                        activeBorderColor: 'none',
                        activeBg: 'transparent',
                        activeShadow: 'none'
                    }
                }
            }}
        >
            <TextArea
                value={inputInfo}
                placeholder="有问题，尽管问"
                onChange={e => onChange(e.target.value)}
                autoSize={{ minRows: 3, maxRows: 8 }}
                className="text-area"
            />
        </ConfigProvider>
    );
};

export default InputBox;
