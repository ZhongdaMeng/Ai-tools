import axios from 'axios';
import type {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse
} from 'axios';
import type { ApiResponse } from '@/types/response';
import { useUserStore } from '@/store/useUser';

// import { redirect } from 'react-router-dom';

// 创建axios实例，并配置默认参数
const server: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' }
});

// 创建请求拦截器
server.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 业务逻辑:在发送请求前，统一从本地存储中获取 Token 并添加到请求头
        const token =
            useUserStore.getState().token || localStorage.getItem('token');
        if (token) {
            // 假设后端要求使用 Bearer 认证格式
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 当请求配置发生错误时（如参数不合法），直接拒绝 Promise
        return Promise.reject(error);
    }
);

// 创建响应拦截器
server.interceptors.response.use(
    // 【情况 A】:HTTP 状态码为 2xx，进入这里
    (response: AxiosResponse<ApiResponse>) => {
        const { code, message } = response.data;
        // code 200 请求成功
        if (code === 200) {
            return response;
        }
        // 如果业务状态码是失败的（比如 401, 403, 500 等）
        // 我们在这里统一处理错误提示，并抛出异常
        handleBusinessError(code, message);
        return Promise.reject(new Error(message)); // 抛出异常，让组件的 catch 捕获
    },
    // 【情况 B】:HTTP 状态码非 2xx（如断网、超时、真实的 404/500），进入这里
    error => {
        // 业务逻辑:请求失败（超出 2xx 范围的状态码或网络错误）

        // 统一处理 HTTP 状态码错误
        if (error.response) {
            // 服务器返回了错误状态码，我们可以拿到 error.response.data
            const { statusCode, message } = error.response.data || {};
            // 同样调用统一的业务错误处理函数
            handleBusinessError(
                statusCode,
                message || '服务器异常，请稍后重试'
            );
        } else {
            // 请求已发出但未收到响应（如断网、超时）
            console.error('网络错误，无法连接到服务器');
        }

        // 将错误继续抛出，以便在组件的 catch 中进行单独的业务处理
        return Promise.reject(error.response?.data ?? error);
    }
);

// 抽离出一个统一的业务错误处理函数, 这样无论是情况 A 还是情况 B，都可以复用这段逻辑
const handleBusinessError = (code: number, message: string) => {
    switch (code) {
        case 401:
            console.warn('登录失效，清理用户信息与会话列表');
            useUserStore.getState().clearSession();
            break;
        case 403:
            // alert('登录失败');
            break;
        case 404:
            // alert('请求的资源不存在');
            break;
        case 500:
            // alert('服务器内部错误');
            break;
        default:
            // 其他业务错误，直接弹出后端返回的 message
            console.error(message || '操作失败');
            break;
    }
};

export default server;
