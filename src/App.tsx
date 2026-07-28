import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useThemeStore } from '@/store/useTheme';
import { useEffect } from 'react';

function App() {
    const { initSystemTheme, theme } = useThemeStore();

    useEffect(() => {
        // 初始化主题系统
        const cleanup = initSystemTheme();

        // 应用当前主题
        if (theme !== 'system') {
            document.documentElement.setAttribute('data-theme', theme);
        }

        return cleanup;
    }, [initSystemTheme, theme]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
