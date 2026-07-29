import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getUserInfo, register, logout, changePassword, updateUserInfo } from '@/api/user';
import type { LoginParams, RegisterParams, ChangePasswordParams, UpdateUserInfoParams } from '@/api/user';
import { useUserStore, useConversationStore } from '@/store';
import { UserOutlined, SettingOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {
    Avatar,
    Button,
    Modal,
    Input,
    ConfigProvider,
    Divider,
    Form,
    message,
    Dropdown,
    Select
} from 'antd';
import './index.scss';

interface PropsType {
    collapsed: boolean;
}

const SiderFooter = (props: PropsType) => {
    const { collapsed } = props;
    const navigate = useNavigate();
    const { token, setToken, setUserInfo } = useUserStore();
    const removeToken = useUserStore(state => state.removeToken);
    const removeUserInfo = useUserStore(state => state.removeUserInfo);
    const userInfo = useUserStore(state => state.userInfo);
    const resetConversation = useConversationStore(state => state.reset);
    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'login' | 'register' | 'changePassword'>('login');
    const [form, setForm] = useState<LoginParams>({
        account: '',
        password: ''
    });
    const [registerForm, setRegisterForm] = useState<RegisterParams>({
        username: '',
        account: '',
        password: ''
    });
    const [changePasswordForm, setChangePasswordForm] = useState<ChangePasswordParams>({
        newPassword: ''
    });
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settingsForm, setSettingsForm] = useState<UpdateUserInfoParams>({});
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
        setMode('login');
        setOpen(true);
    };
    // 关闭登录弹窗
    const handleCancel = () => {
        setOpen(false);
        setErrMsg('');
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
            const { username, account, password } = registerForm;
            if (username.length > 0 && account.length > 0 && password.length > 0) {
                register(registerForm)
                    .then(() => {
                        messageApi.open({
                            type: 'success',
                            content: '注册成功'
                        });
                        setMode('login');
                        setRegisterForm({ username: '', account: '', password: '' });
                        setErrMsg('');
                    })
                    .catch(err => {
                        messageApi.open({
                            type: 'error',
                            content: err.message
                        });
                        setErrMsg(err.message);
                    });
            } else {
                setErrMsg('请填写完整注册信息');
            }
        }
    };

    const handleLogout = () => {
        logout()
            .then(() => {
                removeToken();
                removeUserInfo();
                resetConversation();
                navigate('/chat/newchat');
                messageApi.open({
                    type: 'success',
                    content: '退出登录成功'
                });
            })
            .catch(err => {
                messageApi.open({
                    type: 'error',
                    content: err.message
                });
            });
    };

    const handleChangePassword = () => {
        if (changePasswordForm.newPassword.length === 0) {
            setErrMsg('请输入新密码');
            return;
        }
        changePassword(changePasswordForm)
            .then(() => {
                messageApi.open({
                    type: 'success',
                    content: '密码修改成功，请重新登录'
                });
                removeToken();
                removeUserInfo();
                resetConversation();
                setOpen(false);
                setMode('login');
                setChangePasswordForm({ newPassword: '' });
                setErrMsg('');
                navigate('/chat/newchat');
            })
            .catch(err => {
                messageApi.open({
                    type: 'error',
                    content: err.message
                });
                setErrMsg(err.message);
            });
    };

    const handleOpenSettings = () => {
        const initForm = (info: typeof userInfo) => {
            if (info) {
                setSettingsForm({
                    username: info.username ?? '',
                    nickname: info.nickname ?? '',
                    phone: info.phone ?? '',
                    email: info.email ?? '',
                    gender: info.gender ?? 0
                });
            }
        };

        if (userInfo) {
            initForm(userInfo);
        } else {
            getUserInfo()
                .then(res => {
                    setUserInfo(res);
                    initForm(res);
                })
                .catch(err => {
                    messageApi.open({
                        type: 'error',
                        content: err.message
                    });
                });
        }
        setErrMsg('');
        setSettingsOpen(true);
    };

    const handleUpdateUserInfo = () => {
        if (!userInfo) return;
        // 只传与原值不同的字段
        const changed: UpdateUserInfoParams = {};
        if (settingsForm.username !== userInfo.username) changed.username = settingsForm.username;
        if (settingsForm.nickname !== userInfo.nickname) changed.nickname = settingsForm.nickname;
        if (settingsForm.phone !== userInfo.phone) changed.phone = settingsForm.phone;
        if (settingsForm.email !== userInfo.email) changed.email = settingsForm.email;
        if (settingsForm.gender !== userInfo.gender) changed.gender = settingsForm.gender;

        if (Object.keys(changed).length === 0) {
            setSettingsOpen(false);
            return;
        }

        updateUserInfo(changed)
            .then(res => {
                setUserInfo(res);
                setSettingsOpen(false);
                messageApi.open({
                    type: 'success',
                    content: '个人信息更新成功'
                });
            })
            .catch(err => {
                messageApi.open({
                    type: 'error',
                    content: err.message
                });
                setErrMsg(err.message);
            });
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'settings',
            label: '个人设置',
            icon: <SettingOutlined />,
            onClick: handleOpenSettings
        },
        {
            key: 'changePassword',
            label: '修改密码',
            icon: <KeyOutlined />,
            onClick: () => {
                setErrMsg('');
                setChangePasswordForm({ newPassword: '' });
                setMode('changePassword');
                setOpen(true);
            }
        },
        { type: 'divider' },
        {
            key: 'logout',
            label: '退出登录',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout
        }
    ];

    return (
        <div
            className={`siderFooter ${token ? '' : 'not-login'} ${collapsed ? 'hidden-style ' : ''}`}
        >
            <div className="siderFooter-box">
                {token ? (
                    <Dropdown
                        menu={{ items: userMenuItems }}
                        trigger={['click']}
                        placement="topLeft"
                    >
                        <div className="siderFooter-loginbox">
                            <Avatar
                                style={{
                                    backgroundColor: '#87d068'
                                }}
                                icon={<UserOutlined />}
                            />
                            <div className="user-name">
                                {userInfo?.username || '用户'}
                            </div>
                        </div>
                    </Dropdown>
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
                title={mode === 'login' ? '登录' : mode === 'register' ? '注册' : '修改密码'}
                open={open}
                onCancel={handleCancel}
                mask={{ blur: true }}
                footer={null}
                className="login-model"
            >
                <div className="login-model-content">
                    {mode === 'login' && '登录后你将获得为你量身定制的回复，以及基于已保存聊天的回答。'}
                    {mode === 'register' && '注册账号以获取更多功能。'}
                    {mode === 'changePassword' && '请输入新密码，修改后需要重新登录。'}
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
                        {mode === 'changePassword' ? (
                            <>
                                <Input
                                    type="password"
                                    className="login-input"
                                    placeholder="新密码"
                                    value={changePasswordForm.newPassword}
                                    onChange={e =>
                                        setChangePasswordForm(pre => {
                                            return { ...pre, newPassword: e.target.value };
                                        })
                                    }
                                />
                                <Form.Item validateStatus="error" help={<>{errMsg}</>} style={{ marginTop: '20px' }}>
                                    <Button
                                        type="default"
                                        autoInsertSpace={false}
                                        block
                                        className="login-model-btn"
                                        onClick={handleChangePassword}
                                    >
                                        确认修改
                                    </Button>
                                </Form.Item>
                            </>
                        ) : mode === 'login' ? (
                            <>
                                <Input
                                    type="text"
                                    className="login-input"
                                    placeholder="账号"
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
                                    placeholder="密码"
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
                                    onClick={() => {
                                        setErrMsg('');
                                        setMode('register');
                                    }}
                                >
                                    注册
                                </Button>
                            </>
                        ) : (
                            <>
                                <Input
                                    type="text"
                                    className="login-input"
                                    placeholder="用户名"
                                    value={registerForm.username}
                                    onChange={e =>
                                        setRegisterForm(pre => {
                                            return { ...pre, username: e.target.value };
                                        })
                                    }
                                />
                                <Input
                                    type="text"
                                    className="login-input"
                                    placeholder="账号"
                                    value={registerForm.account}
                                    onChange={e =>
                                        setRegisterForm(pre => {
                                            return { ...pre, account: e.target.value };
                                        })
                                    }
                                />
                                <Input
                                    type="password"
                                    className="login-input"
                                    placeholder="密码"
                                    value={registerForm.password}
                                    onChange={e =>
                                        setRegisterForm(pre => {
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
                                        onClick={() => modelBtn(1)}
                                    >
                                        注册
                                    </Button>
                                </Form.Item>
                                <Divider>或</Divider>
                                <Button
                                    type="default"
                                    autoInsertSpace={false}
                                    block
                                    className="login-model-btn"
                                    onClick={() => {
                                        setErrMsg('');
                                        setMode('login');
                                    }}
                                >
                                    返回登录
                                </Button>
                            </>
                        )}
                    </ConfigProvider>
                </div>
            </Modal>
            <Modal
                title="个人设置"
                open={settingsOpen}
                onCancel={() => {
                    setSettingsOpen(false);
                    setErrMsg('');
                }}
                mask={{ blur: true }}
                footer={null}
                className="login-model"
            >
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
                        <div className="settings-field">
                            <label>用户名</label>
                            <Input
                                type="text"
                                className="login-input"
                                placeholder="请输入用户名"
                                value={settingsForm.username ?? ''}
                                onChange={e =>
                                    setSettingsForm(pre => ({ ...pre, username: e.target.value }))
                                }
                            />
                        </div>
                        <div className="settings-field">
                            <label>昵称</label>
                            <Input
                                type="text"
                                className="login-input"
                                placeholder="请输入昵称"
                                value={settingsForm.nickname ?? ''}
                                onChange={e =>
                                    setSettingsForm(pre => ({ ...pre, nickname: e.target.value }))
                                }
                            />
                        </div>
                        <div className="settings-field">
                            <label>手机号</label>
                            <Input
                                type="text"
                                className="login-input"
                                placeholder="请输入手机号"
                                value={settingsForm.phone ?? ''}
                                onChange={e =>
                                    setSettingsForm(pre => ({ ...pre, phone: e.target.value }))
                                }
                            />
                        </div>
                        <div className="settings-field">
                            <label>邮箱</label>
                            <Input
                                type="text"
                                className="login-input"
                                placeholder="请输入邮箱"
                                value={settingsForm.email ?? ''}
                                onChange={e =>
                                    setSettingsForm(pre => ({ ...pre, email: e.target.value }))
                                }
                            />
                        </div>
                        <div className="settings-field">
                            <label>性别</label>
                            <Select
                                className="login-input"
                                placeholder="请选择性别"
                                value={settingsForm.gender ?? 0}
                                onChange={val => setSettingsForm(pre => ({ ...pre, gender: val }))}
                                options={[
                                    { value: 0, label: '未知' },
                                    { value: 1, label: '男' },
                                    { value: 2, label: '女' }
                                ]}
                            />
                        </div>
                        <Form.Item validateStatus="error" help={<>{errMsg}</>} style={{ marginTop: '16px' }}>
                            <Button
                                type="default"
                                autoInsertSpace={false}
                                block
                                className="login-model-btn"
                                onClick={handleUpdateUserInfo}
                            >
                                确认修改
                            </Button>
                        </Form.Item>
                    </ConfigProvider>
                </div>
            </Modal>
            {contextHolder}
        </div>
    );
};

export default SiderFooter;
