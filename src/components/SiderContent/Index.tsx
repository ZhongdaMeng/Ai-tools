import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useConversationStore } from '@/store';
import Options from './components/Options/Index';
import Messages from './components/Messages/Index';
import './index.scss';

interface PropsType {
    menuClick: (type: string, e: number) => void;
}

const SiderContent = (props: PropsType) => {
    const { menuClick } = props;
    const location = useLocation();
    const selectedId = useConversationStore(state => state.selectedId);
    const setSelectedId = useConversationStore(state => state.setSelectedId);

    // 从 pathname + selectedId 派生 activeMenu，确保互斥选中
    const activeMenu = useMemo(() => {
        // 有会话被选中时，Options 不高亮
        if (selectedId !== null) return -1;
        const pathname = location.pathname;
        if (pathname === '/note') return 1;
        if (pathname.startsWith('/chat/')) {
            const id = pathname.split('/')[2];
            if (id && id !== 'newchat') return -1;
        }
        return 0;
    }, [location.pathname, selectedId]);

    return (
        <div className="siderContent">
            <Options
                activeMenu={activeMenu}
                clickOptions={e => {
                    setSelectedId(null);
                    menuClick('top', e);
                }}
            />
            <Messages />
        </div>
    );
};

export default SiderContent;
