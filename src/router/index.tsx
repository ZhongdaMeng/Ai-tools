import { createBrowserRouter } from 'react-router-dom';
import { requireAuthLoader } from '@/utils/authLoader';

const routes = [
    {
        path: '/',
        lazy: async () => {
            const { Home } = await import('@/views/home/index');
            return { Component: Home };
        },
        loader: requireAuthLoader
    },
    {
        path: '/login',
        lazy: async () => {
            const { Login } = await import('@/views/auth/Login');
            return { Component: Login };
        }
    },
    {
        path: '/register',
        lazy: async () => {
            const { Register } = await import('@/views/auth/Register');
            return { Component: Register };
        }
    }
];

export const router = createBrowserRouter(routes);
