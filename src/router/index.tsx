import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
// import { requireAuthLoader } from '@/utils/authLoader';
// import msgLoader from '@/utils/msgLoader';

const routes: RouteObject[] = [
    {
        path: '/',
        lazy: async () => {
            const { Home } = await import('@/views/home/index');
            return { Component: Home };
        },
        // loader: requireAuthLoader
        children: [
            {
                index: true, // 添加默认子路由
                element: <Navigate to="/chat/newchat" replace />
            },
            {
                path: '/chat/:id',
                lazy: async () => {
                    const { HomeContent } =
                        await import('@/components/HomeContent/Index');
                    return { Component: HomeContent };
                }
                // loader: msgLoader
            },
            {
                path: '/note',
                lazy: async () => {
                    const { Note } = await import('@/components/Note/Index');
                    return { Component: Note };
                }
            }
        ]
    }
];

export const router = createBrowserRouter(routes);
