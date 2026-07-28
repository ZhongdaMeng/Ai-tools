import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useConversationStore } from '@/store';
import { searchConversations } from '@/api/ai';
import type { GetMsgListItem } from '@/api/ai';
import Options from './components/Options/Index';
import Messages from './components/Messages/Index';
import './index.scss';

interface PropsType {
    menuClick: (type: string, e: number) => void;
}

const PAGE_SIZE = 20;

const SiderContent = (props: PropsType) => {
    const { menuClick } = props;
    const location = useLocation();
    const selectedId = useConversationStore(state => state.selectedId);
    const setSelectedId = useConversationStore(state => state.setSelectedId);

    // 搜索状态
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<GetMsgListItem[] | null>(null);
    const [searchTotal, setSearchTotal] = useState(0);
    const [searchPage, setSearchPage] = useState(1);
    const [searchLoading, setSearchLoading] = useState(false);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // 搜索关键词快照，翻页时使用
    const searchKeywordRef = useRef('');

    // 从 pathname + selectedId 派生 activeMenu，确保互斥选中
    const activeMenu = useMemo(() => {
        if (selectedId !== null) return -1;
        const pathname = location.pathname;
        if (pathname === '/resume') return 1;
        if (pathname.startsWith('/chat/')) {
            const id = pathname.split('/')[2];
            if (id && id !== 'newchat') return -1;
        }
        return 0;
    }, [location.pathname, selectedId]);

    // 执行搜索请求
    const doSearch = useCallback((kw: string, page: number) => {
        if (!kw.trim()) {
            setSearchResults(null);
            setSearchTotal(0);
            return;
        }
        setSearchLoading(true);
        searchConversations({ keyword: kw.trim(), page, pageSize: PAGE_SIZE })
            .then(res => {
                if (page === 1) {
                    setSearchResults(res.list);
                } else {
                    setSearchResults(prev => (prev ? [...prev, ...res.list] : res.list));
                }
                setSearchTotal(res.total);
                setSearchPage(page);
            })
            .catch(() => {
                if (page === 1) setSearchResults([]);
            })
            .finally(() => setSearchLoading(false));
    }, []);

    const handleSearchChange = useCallback(
        (value: string) => {
            setKeyword(value);
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            if (!value.trim()) {
                setSearchResults(null);
                setSearchTotal(0);
                return;
            }
            searchKeywordRef.current = value;
            debounceTimer.current = setTimeout(() => doSearch(value, 1), 300);
        },
        [doSearch]
    );

    // 加载更多搜索结果
    const loadMoreSearch = useCallback(() => {
        if (searchLoading) return;
        doSearch(searchKeywordRef.current, searchPage + 1);
    }, [searchLoading, searchPage, doSearch]);

    // 组件卸载时清理定时器
    useEffect(() => {
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, []);

    return (
        <div className="siderContent">
            <Options
                activeMenu={activeMenu}
                clickOptions={e => {
                    setSelectedId(null);
                    menuClick('top', e);
                }}
                keyword={keyword}
                onSearchChange={handleSearchChange}
            />
            <Messages
                searchResults={searchResults}
                searchTotal={searchTotal}
                searchLoading={searchLoading}
                onLoadMoreSearch={loadMoreSearch}
            />
        </div>
    );
};

export default SiderContent;
