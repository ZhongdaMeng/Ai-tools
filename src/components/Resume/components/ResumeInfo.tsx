import { useCallback } from 'react'
import { message } from 'antd'
import './index.scss'

export const ResumeInfo = () => {
    const handleCopy = useCallback((text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            message.success('已复制到剪贴板')
        })
    }, [])

    return (
        <div className="resume-info">
            {/* 顶部装饰条 */}
            <div className="resume-accent-bar" />

            {/* 个人信息头部 */}
            <header className="resume-header">
                <h1 className="resume-name">孟忠达</h1>
                <p className="resume-title">前端开发工程师 · 五年经验</p>
                <div className="resume-contact">
                    <span className="contact-item copyable" onClick={() => handleCopy('18236246797')}>
                        <span className="contact-icon">📱</span>
                        18236246797
                    </span>
                    <span className="contact-divider">|</span>
                    <span className="contact-item copyable" onClick={() => handleCopy('mengzhongda@foxmail.com')}>
                        <span className="contact-icon">✉️</span>
                        mengzhongda@foxmail.com
                    </span>
                    <span className="contact-divider">|</span>
                    <span className="contact-item">
                        <span className="contact-icon">🎓</span> 本科 · 计算机科学与技术
                    </span>
                </div>
            </header>

            {/* 自我介绍 */}
            <section className="resume-section">
                <h2 className="section-title">自我介绍</h2>
                <div className="section-content">
                    <ul className="intro-list">
                        <li>具有五年的前端开发经验，有AI智能开发平台、后台管理系统、移动端、Uniapp跨平台及vibe coding开发经验。</li>
                        <li>具备独立开发经验、协作开发经验，有从0到1，再到开发迭代维护的项目经验。</li>
                        <li>具备高效的沟通能力，能深入需求评审、接口规范、并根据开发经验提出建议完善细节。</li>
                        <li>熟练掌握Vue2/3、React、Uniapp及配套生态，熟练掌握各前端框架配套UI组件库。</li>
                        <li>熟练掌握Git版本控制工具、前端打包发布部署。</li>
                        <li>熟悉Grafana数据监测平台二次开发、面板插件开发以及leaflet地图开发。</li>
                        <li>善用AI工具进行辅助开发，如Codex、Claude Code，具备快速上手项目能力，对项目具备代码审查、问题定位以及工程质量保障。</li>
                        <li>在AI的协助下具备NestJs后台开发能力，有BFF服务开发经验。</li>
                    </ul>
                </div>
            </section>

            {/* 工作经验 */}
            <section className="resume-section">
                <h2 className="section-title">工作经验</h2>
                <div className="section-content">
                    <div className="experience-item">
                        <div className="exp-header">
                            <div className="exp-company-info">
                                <h3 className="exp-company">腾讯科技有限公司 天美T1工作室</h3>
                                <span className="exp-sub">（上海微创）</span>
                            </div>
                            <span className="exp-date">2024年8月 - 至今</span>
                        </div>
                        <p className="exp-role">前端工程师</p>
                        <ul className="exp-list">
                            <li>负责元梦之星H5游戏活动页面的开发。</li>
                            <li>腾讯内部无极AI智能开发平台开发。</li>
                            <li>独立负责元梦之星的游戏性能监控平台Grafana的二次开发。</li>
                            <li>主导ACJ游戏项目的Web端游戏地图项目开发。</li>
                        </ul>
                    </div>

                    <div className="experience-item">
                        <div className="exp-header">
                            <h3 className="exp-company">太仓全众智能装备有限公司</h3>
                            <span className="exp-date">2022年6月 - 2024年6月</span>
                        </div>
                        <p className="exp-role">前端工程师</p>
                        <ul className="exp-list">
                            <li>独立负责公司OA系统及App项目的搭建和开发迭代维护。</li>
                            <li>与后端同事协作，约定接口传参及数据格式，进行接口调试，实现前后端交互。</li>
                            <li>敏捷式开发，快速响应产品和领导的需求变更，并做出修改迭代。</li>
                        </ul>
                    </div>

                    <div className="experience-item">
                        <div className="exp-header">
                            <h3 className="exp-company">深圳市微特精密科技股份有限公司</h3>
                            <span className="exp-date">2021年5月 - 2022年5月</span>
                        </div>
                        <p className="exp-role">前端工程师</p>
                        <ul className="exp-list">
                            <li>使用Python和Objective-C进行开发，负责串口调试软件的开发与调试。</li>
                            <li>负责公司人力资源管理系统部分模块的开发与维护。</li>
                            <li>对公司网站进行开发维护。</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 项目经验 */}
            <section className="resume-section">
                <h2 className="section-title">项目经验</h2>
                <div className="section-content">
                    <div className="project-item">
                        <div className="proj-header">
                            <h3 className="proj-name">无限制AI Chat 智能对话平台</h3>
                            <span className="proj-badge">个人项目</span>
                            <span className="exp-date">2026年7月 - 至今</span>
                        </div>
                        <p className="proj-tech">
                            <span className="tech-label">技术栈：</span>
                            React、TypeScript、Zustand、NestJS、MySQL、AI辅助开发
                        </p>
                        <ul className="exp-list">
                            <li>独立进行该项目的开发，实现从前端、后端、数据库的设计，并通过该项目巩固了项目从零的搭建，项目基础设施的搭建及配置。</li>
                            <li>项目UI风格仿照ChatGPT桌面端进行开发，实现AI模型回复的SSE流式传输及消息渲染，接入了Mimo模型及部署到本地无审查版本的Gemma4开源模型，完成了多模型切换、登录、注册、会话管理、会话历史、模型鉴权、调用限制等基础功能。</li>
                            <li>后端及数据库通过vibe coding进行开发，也深入学习了AI项目的开发规划、Skill管理、提示词优化，提高了开发效率。</li>
                        </ul>
                    </div>

                    <div className="project-item">
                        <div className="proj-header">
                            <h3 className="proj-name">无极AI智能开发平台</h3>
                            <span className="proj-badge">腾讯天美</span>
                            <span className="exp-date">2024年3月 - 6月</span>
                        </div>
                        <p className="proj-tech">
                            <span className="tech-label">技术栈：</span>
                            Vue3、无极AI协作开发、低代码
                        </p>
                        <ul className="exp-list">
                            <li>该项目是腾讯内部自用的AI生成管理后台的项目，类似于可实时看到页面效果的Agent工具。</li>
                            <li>通过低代码拖拽生成简单页面，复杂的页面及业务逻辑则通过接入该平台的AI生成代码组件，插入到页面中；页面同时向外暴露生命周期等API，形成页面简单功能使用低代码拖拽生成、复杂功能逻辑通过AI生成组件、请求及页面逻辑调用暴露的API实现业务自洽。</li>
                        </ul>
                    </div>

                    <div className="project-item">
                        <div className="proj-header">
                            <h3 className="proj-name">游戏性能监测平台</h3>
                            <span className="proj-badge">腾讯天美</span>
                            <span className="exp-date">2024年12月 - 2026年3月</span>
                        </div>
                        <p className="proj-tech">
                            <span className="tech-label">技术栈：</span>
                            Grafana、React、TypeScript、WSL2、NestJS
                        </p>
                        <ul className="exp-list">
                            <li>该项目是为元梦之星的游戏性能监控平台，针对游戏玩法热度、新版本安装包在不同设备帧率性能跑测数据进行统计监控，独立进行该项目的需求对接、开发、以及后端服务开发工作。</li>
                            <li>该数据监测平台官方提供了一系列插件，社区也提供了第三方插件，但是不满足使用需求，故对原生插件进行二次开发，以及独立开发一些新的插件出来。</li>
                            <li>使用WSL2安装Ubuntu作为Grafana二次开发环境，Grafana自带的预警功能不能满足复杂条件的预警通知，开发独立功能，对接企业微信机器人，实现预警简报功能；部分场景下单页面数据请求量可达2GB，同时面板要处理海量数据后才能渲染，会导致页面卡死，故使用NestJS写了一个BFF服务层，使得页面请求负载从2GB左右、请求时间近两分钟减少到不到1M、30秒左右。</li>
                        </ul>
                    </div>

                    <div className="project-item">
                        <div className="proj-header">
                            <h3 className="proj-name">游戏地图</h3>
                            <span className="proj-badge">腾讯天美</span>
                            <span className="exp-date">2024年8月 - 12月</span>
                        </div>
                        <p className="proj-tech">
                            <span className="tech-label">技术栈：</span>
                            Vue2、Element UI、Leaflet.js、Vue2全家桶
                        </p>
                        <ul className="exp-list">
                            <li>该项目是为某大型游戏项目的游戏数据进行管理，渲染多个场景地图，以及地图资源、玩家轨迹的展示。</li>
                            <li>主导该项目的开发，从零到一的进行项目搭建，需求对接和前后端交互的数据结构的约定。</li>
                            <li>引入Leaflet.js对地图进行渲染，并深度定制弹窗样式、移动轨迹、聚合功能等。</li>
                        </ul>
                    </div>

                    <div className="project-item">
                        <div className="proj-header">
                            <h3 className="proj-name">全众云 APP</h3>
                            <span className="proj-badge">全众智能</span>
                            <span className="exp-date">2022年 - 至今</span>
                        </div>
                        <p className="proj-tech">
                            <span className="tech-label">技术栈：</span>
                            Vue3、Uniapp、Uview Plus
                        </p>
                        <ul className="exp-list">
                            <li>该项目为办公类APP，涵盖了工作审批流、考勤打卡、工作汇报、项目管理、任务管理、快递及访客登记、补贴申报、薪资及各项统计等。</li>
                            <li>负责全众云APP安卓、iOS、H5，三端从零到一的开发，独立负责完成安卓证书的获取、苹果开发版及正式版的证书获取，以及各种第三方Key如高德地图等各种配置。</li>
                            <li>封装公共组件及方法、提高开发效率、代码可读性、复用性，例如后台生成的流程挂载的表单是由form-generator基于Element UI组件库生成，但APP端使用的Uview Plus，通过转化表单配置，实现APP端的表单渲染与提交，完成APP与后台流程模块联动。</li>
                        </ul>
                    </div>

                    <div className="project-item">
                        <div className="proj-header">
                            <h3 className="proj-name">SaaS 云租户后台管理系统</h3>
                            <span className="proj-badge">全众智能</span>
                            <span className="exp-date">2022年 - 至今</span>
                        </div>
                        <p className="proj-tech">
                            <span className="tech-label">技术栈：</span>
                            Vue2、Element UI、Vue2全家桶
                        </p>
                        <ul className="exp-list">
                            <li>该项目是为我们公司开发的办公系统进行管理，分为平台端和租户端，同时为购买并使用我们办公APP客户进行功能权限管理和服务。</li>
                            <li>负责平台端管理系统的开发，对租户进行审核、添加、停用进行管理，并对租户开通的办公功能模块进行管理。</li>
                            <li>负责租户端管理系统的开发，对集团以及子公司的组织架构、角色、权限功能模块进行开发。</li>
                            <li>使用form-generator、BPMN流程引擎实现用户自定义审批工作流，实现功能的可自定义性和可扩展性。</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 教育经历 */}
            <section className="resume-section">
                <h2 className="section-title">教育经历</h2>
                <div className="section-content">
                    <div className="edu-item">
                        <div className="edu-header">
                            <h3 className="edu-school">河南科技大学</h3>
                            <span className="exp-date">2022年 - 2024年</span>
                        </div>
                        <p className="edu-detail">计算机科学与技术 · 本科</p>
                    </div>
                    <div className="edu-item">
                        <div className="edu-header">
                            <h3 className="edu-school">漯河食品职业学院</h3>
                            <span className="exp-date">2018年 - 2021年</span>
                        </div>
                        <p className="edu-detail">计算机网络技术 · 专科</p>
                    </div>
                </div>
            </section>

            {/* 个人总结 */}
            <section className="resume-section">
                <h2 className="section-title">个人总结</h2>
                <div className="section-content">
                    <ul className="intro-list">
                        <li>喜欢钻研学习最新的技术，有较强的自我驱动式学习能力。</li>
                        <li>责任心强，在闲暇之余主动完善项目中冗余复杂的代码，进行项目调优。</li>
                        <li>性格开朗，善于进行沟通，能很快的融入部门团队。</li>
                    </ul>
                </div>
            </section>

        </div>
    )
};
