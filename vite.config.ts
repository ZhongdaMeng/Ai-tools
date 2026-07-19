import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// 使用函数式定义，以便获取当前运行模式（mode）
export default defineConfig(({ mode }) => {
    // 加载当前模式下的环境变量（第三个参数 '' 表示加载所有前缀的变量）
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        resolve: {
            alias: {
                // 将 @ 映射到 src 目录
                '@': path.resolve(__dirname, './src')
            }
        },
        server: {
            // 配置代理，解决开发环境跨域问题
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: env.VITE_API_TARGET_URL, // 动态读取后端真实地址
                    changeOrigin: true // 跨域必备
                }
            }
        }
    };
});
