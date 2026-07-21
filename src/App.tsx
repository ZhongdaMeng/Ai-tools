import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useThemeStore } from '@/store/useTheme';
import { useEffect } from 'react';

const queryClient = new QueryClient();

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
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    );
}

export default App;
