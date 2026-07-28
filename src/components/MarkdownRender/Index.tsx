import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import './index.scss';

interface PropsType {
    content: string;
}

const MarkdownRender = (props: PropsType) => {
    const { content } = props;
    return (
        <div className="markdown-body ">
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
            >
                {content}
            </Markdown>
        </div>
    );
};
export default MarkdownRender;
