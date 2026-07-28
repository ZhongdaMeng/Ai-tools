import type { GetMsgDetailResponse } from '@/api/ai.ts';
import MarkdownRender from '@/components/MarkdownRender/Index';
import './index.scss';

interface PropType {
    msgList: GetMsgDetailResponse[];
}

const MsgBox = (props: PropType) => {
    const { msgList } = props;
    console.log('1', msgList);
    return (
        <div className="msg-box">
            <div className="msgBox-main">
                {msgList.map(item => {
                    if (item.role === 'user') {
                        return (
                            <div className="userMsg-box">
                                <div className="userMsg">{item.content}</div>
                            </div>
                        );
                    } else {
                        return (
                            <div className="model-msg">
                                <MarkdownRender content={item.content} />
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default MsgBox;
