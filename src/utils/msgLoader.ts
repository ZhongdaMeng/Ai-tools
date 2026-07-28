import type { LoaderFunctionArgs } from 'react-router-dom';
import { getMsgDetail } from '@/api/ai.ts';

const msgLoader = async ({ params }: LoaderFunctionArgs) => {
    if (params.id && params.id !== 'newchat') {
        // 只有不是新建对话的前提下，才进行会话详情拉取
        return await getMsgDetail(params.id);
    }
    return null;
};

export default msgLoader;
