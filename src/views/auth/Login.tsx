import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store';
import { login } from '@/api/user';
import type { LoginParams } from '@/api/user';

export const Login = () => {
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: (data: LoginParams) => login(data),
        onSuccess: data => {
            console.log(data);
            useUserStore.getState().setToken(data.token);
            navigate('/');
        }
    });

    const handleLogin = () => {
        mutation.mutate({
            account: 'admin',
            password: 'admin123'
        });
    };

    return (
        <div>
            <button onClick={handleLogin}>登录</button>
            {mutation.isPending && <div>登录中...</div>}
            {mutation.isError && <div>登录失败</div>}
            {mutation.isSuccess && (
                <div>{JSON.stringify(mutation.data.token)}</div>
            )}
        </div>
    );
};
