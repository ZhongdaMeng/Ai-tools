import { redirect } from 'react-router-dom';
import { useUserStore } from '@/store';

// 获取当前登录用户信息的函数
const getToken = () => {
    const token =
        useUserStore.getState().token || localStorage.getItem('token');
    return token || null;
};

export const requireAuthLoader = () => {
    const token = getToken();
    if (!token) {
        return redirect('/login');
    }
    return null;
};
