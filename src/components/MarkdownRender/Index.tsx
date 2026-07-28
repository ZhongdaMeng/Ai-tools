import React, { useState, useCallback, useRef, type ReactNode } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import './index.scss'

interface PropsType {
    content: string
    streamContent?: string
    isStreaming?: boolean
}

// 从 ReactNode 中提取纯文本
const extractText = (node: ReactNode): string => {
    if (typeof node === 'string') return node
    if (typeof node === 'number') return String(node)
    if (!node) return ''
    if (Array.isArray(node)) return node.map(extractText).join('')
    if (
        React.isValidElement(node) &&
        typeof node.props === 'object' &&
        node.props !== null &&
        'children' in node.props
    ) {
        return extractText(
            (node.props as Record<string, unknown>).children as ReactNode
        )
    }
    return ''
}

// 复制文本到剪贴板（带回退方案）
const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
            return true
        }
        // 回退方案
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        return true
    } catch (err) {
        console.error('复制失败:', err)
        return false
    }
}

// 代码块组件 —— 语言标签 + 复制按钮
const CodeBlock = ({
    className,
    children,
}: {
    className?: string
    children: ReactNode
}) => {
    const [copied, setCopied] = useState(false)
    const codeRef = useRef<HTMLElement>(null)

    // 从 className 中提取语言名称
    const language =
        className
            ?.split(/\s+/)
            .find((c) => c.startsWith('language-'))
            ?.replace('language-', '') || ''

    const handleCopy = useCallback(async () => {
        const codeText = codeRef.current?.textContent || extractText(children)
        if (!codeText) return
        const ok = await copyToClipboard(codeText)
        if (ok) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }, [children])

    return (
        <div className="code-block">
            <div className="code-header">
                <span className="code-language">{language || 'code'}</span>
                <button
                    className={`copy-button${copied ? ' copied' : ''}`}
                    onClick={handleCopy}
                    title="复制代码"
                >
                    {copied ? '✓ 已复制' : '复制'}
                </button>
            </div>
            <pre>
                <code ref={codeRef} className={className}>
                    {children}
                </code>
            </pre>
        </div>
    )
}

const MarkdownRender = ({ content, streamContent, isStreaming = false }: PropsType) => {
    // 决定显示的内容：如果有流式内容且正在流式输出，则显示流式内容，否则显示完整内容
    const displayContent = isStreaming && streamContent ? streamContent : content;
    
    return (
        <div className={`markdown-body ${isStreaming ? 'streaming' : ''}`}>
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    // ---- 代码块 / 行内代码 ----
                    code({ className, children, ...props }) {
                        const isBlock =
                            className &&
                            (className.includes('hljs') ||
                                className.includes('language-'))

                        if (isBlock) {
                            return (
                                <CodeBlock className={className}>
                                    {children}
                                </CodeBlock>
                            )
                        }
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    },

                    // ---- 链接（外部链接新窗口打开） ----
                    a({ href, children, ...props }) {
                        const isExternal =
                            href &&
                            (href.startsWith('http://') ||
                                href.startsWith('https://'))
                        return (
                            <a
                                href={href}
                                target={isExternal ? '_blank' : undefined}
                                rel={
                                    isExternal
                                        ? 'noopener noreferrer'
                                        : undefined
                                }
                                {...props}
                            >
                                {children}
                            </a>
                        )
                    },

                    // ---- 图片懒加载 ----
                    img({ src, alt, ...props }) {
                        return (
                            <img
                                src={src}
                                alt={alt}
                                loading="lazy"
                                {...props}
                            />
                        )
                    },

                    // ---- 表格加横向滚动容器 ----
                    table({ children, ...props }) {
                        return (
                            <div className="table-container">
                                <table {...props}>{children}</table>
                            </div>
                        )
                    },
                }}
            >
                {displayContent}
            </Markdown>
            {isStreaming && <span className="streaming-cursor"></span>}
        </div>
    )
}

export default MarkdownRender
