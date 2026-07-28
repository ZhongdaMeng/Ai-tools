import type { GetMsgDetailResponse } from '@/api/ai.ts';
import MarkdownRender from '@/components/MarkdownRender/Index';
import './index.scss';

interface PropType {
    msgList: GetMsgDetailResponse[];
    streamingMessageId?: string | null;
    streamingContent?: string;
    isStreaming?: boolean;
}

const MsgBox = (props: PropType) => {
    const { msgList, streamingMessageId, streamingContent, isStreaming } = props;
    
    return (
        <div className="msg-box">
            <div className="msgBox-main">
                {msgList.map(item => {
                    if (item.role === 'user') {
                        return (
                            <div className="userMsg-box" key={item.id}>
                                <div className="userMsg">{item.content}</div>
                            </div>
                        );
                    } else {
                        // 判断是否是正在流式输出的消息
                        const isCurrentStreaming = isStreaming && item.id === streamingMessageId;
                        
                        return (
                            <div className="model-msg" key={item.id}>
                                <MarkdownRender 
                                    content={item.content}
                                    streamContent={isCurrentStreaming ? streamingContent : undefined}
                                    isStreaming={isCurrentStreaming}
                                />
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default MsgBox;
