import { useState, useRef, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { getMsgDetail } from '@/api/ai.ts';
import type { GetMsgDetailResponse } from '@/api/ai.ts';

import InputBox from './components/InputBox/Index.tsx';
import InputTools from './components/InputTools/Index.tsx';
import MsgBox from './components/MsgBox/Index.tsx';
import './index.scss';

interface ContextType {
    isCollapsed: boolean;
}
export const HomeContent = () => {
    const { isCollapsed } = useOutletContext<ContextType>();
    const { id } = useParams();

    const inputRef = useRef<HTMLInputElement>(null);
    const [inputBoxHeight, setInputBoxHeight] = useState<number>(0);
    const [inputInfo, setInputInfo] = useState<string>('');
    const [msgList, setMsgList] = useState<GetMsgDetailResponse[]>([]);

    const sendMsg = () => {
        // setMsgList(prv => {
        //     return [...prv, { type: 0, data: inputInfo }];
        // });
        // setInputInfo('');
    };

    useEffect(() => {
        if (id && id !== 'newchat') {
            // 只有不是新建对话的前提下，才进行会话详情拉取
            getMsgDetail(id)
                .then(res => {
                    setMsgList([...res]);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [id]);

    // 监听高度变化 输入框自动增高
    useEffect(() => {
        const el = inputRef.current;
        if (!el) return;
        // 首次测量
        setInputBoxHeight(el.clientHeight);

        // 监听高度变化 输入框自动增高
        const observer = new ResizeObserver(([entry]) => {
            setInputBoxHeight(entry.contentRect.height);
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="homeContent">
            <div
                className={`content-header ${isCollapsed ? 'collapsed' : 'not-collapsed'}`}
            >
                Model
            </div>
            <div
                className="content-box"
                style={{ paddingBottom: `${inputBoxHeight + 20}px` }}
            >
                {msgList.length > 0 && <MsgBox msgList={msgList} />}

                <div className="content-input" ref={inputRef}>
                    <div className="input-box">
                        <InputBox
                            inputInfo={inputInfo}
                            onChange={e => setInputInfo(e)}
                        />
                    </div>
                    <InputTools
                        canSend={inputInfo.length > 0}
                        inputToolsClick={sendMsg}
                    />
                </div>
            </div>
        </div>
    );
};
