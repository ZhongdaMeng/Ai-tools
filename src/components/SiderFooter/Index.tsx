import { useState } from 'react';
import { login, getUserInfo } from '@/api/user';
import type { LoginParams } from '@/api/user';
import { useUserStore } from '@/store';
import { UserOutlined } from '@ant-design/icons';
import {
    Avatar,
    Button,
    Modal,
    Input,
    ConfigProvider,
    Divider,
    Form,
    message
} from 'antd';
import './index.scss';

interface PropsType {
    collapsed: boolean;
}

const SiderFooter = (props: PropsType) => {
    const { collapsed } = props;
    const { token, setToken, setUserInfo } = useUserStore();
    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<LoginParams>({
        account: '',
        password: ''
    });
    const [errMsg, setErrMsg] = useState<string>('');
    // 获取用户信息
    const getUser = () => {
        getUserInfo()
            .then(res => {
                console.log(res);
                setUserInfo(res);
            })
            .catch(err => {
                messageApi.open({
                    type: 'error',
                    content: err.message
                });
            });
    };
    //点击登录
    const clickLogin = () => {
        setOpen(true);
    };
    // 关闭登录弹窗
    const handleCancel = () => {
        setOpen(false);
    };
    // 点击登录弹窗的按钮
    const modelBtn = (type: number) => {
        if (type === 0) {
            // 登录
            if (form.account.length > 0 && form.password.length > 0) {
                login(form)
                    .then(res => {
                        setToken(res.token);
                        setOpen(false);
                        messageApi.open({
                            type: 'success',
                            content: '登录成功'
                        });
                        getUser();
                    })
                    .catch(err => {
                        messageApi.open({
                            type: 'error',
                            content: err.message
                        });
                        setErrMsg(err.message);
                    });
            } else {
                setErrMsg('请输入账号、密码');
            }
        } else {
            // 注册
        }
    };
    return (
        <div
            className={`siderFooter ${token ? '' : 'not-login'} ${collapsed ? 'hidden-style ' : ''}`}
        >
            <div className="siderFooter-box">
                {token ? (
                    <div className="siderFooter-loginbox">
                        <Avatar
                            style={{
                                backgroundColor: '#87d068'
                            }}
                            icon={<UserOutlined />}
                        />
                        <div className="user-name">Leo</div>
                    </div>
                ) : (
                    <div className="login-box">
                        <div className="login-info">
                            <div className="info-title">
                                获取为你量身定制的回复
                            </div>
                            <div className="info-text">
                                登录以获取基于已保存聊天的回答
                            </div>
                        </div>
                        <Button
                            block
                            className="login-btn"
                            onClick={clickLogin}
                        >
                            登录
                        </Button>
                    </div>
                )}
            </div>
            <Modal
                title="登录或注册"
                open={open}
                onCancel={handleCancel}
                mask={{ blur: true }}
                footer={null}
                className="login-model"
            >
                <div className="login-model-content">
                    登录后你将获得为你量身定制的回复，以及基于已保存聊天的回答。
                </div>
                <div className="login-form">
                    <ConfigProvider
                        theme={{
                            components: {
                                Input: {
                                    activeBorderColor: 'none',
                                    activeBg: 'transparent',
                                    activeShadow: 'none',
                                    hoverBorderColor: 'none'
                                },
                                Button: {
                                    defaultActiveBg: 'black',
                                    defaultActiveBorderColor: 'black',
                                    defaultHoverBg: '#5a5c5e',
                                    defaultHoverColor: '#ffffff',
                                    defaultHoverBorderColor: '#5a5c5e'
                                }
                            }
                        }}
                    >
                        <Input
                            type="text"
                            className="login-input"
                            placeholder="Account"
                            value={form.account}
                            onChange={e =>
                                setForm(pre => {
                                    return { ...pre, account: e.target.value };
                                })
                            }
                        />
                        <Input
                            type="password"
                            className="login-input"
                            placeholder="Password"
                            value={form.password}
                            onChange={e =>
                                setForm(pre => {
                                    return { ...pre, password: e.target.value };
                                })
                            }
                        />
                        <Form.Item validateStatus="error" help={<>{errMsg}</>}>
                            <Button
                                type="default"
                                autoInsertSpace={false}
                                block
                                className="login-model-btn"
                                onClick={() => modelBtn(0)}
                            >
                                登录
                            </Button>
                        </Form.Item>
                        <Divider>或</Divider>
                        <Button
                            type="default"
                            autoInsertSpace={false}
                            block
                            className="login-model-btn"
                            onClick={() => modelBtn(0)}
                        >
                            注册
                        </Button>
                    </ConfigProvider>
                </div>
            </Modal>
            {contextHolder}
        </div>
    );
};

export default SiderFooter;
