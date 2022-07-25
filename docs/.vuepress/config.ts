import clipboardPlugin from "vuepress-plugin-clipboard";

const {defaultTheme} = require('@vuepress/theme-default')
const {searchPlugin} = require('@vuepress/plugin-search');

module.exports = {
    lang: 'zh-CN',
    title: 'Jerry\'s Wiki',
    description: 'This is Jerry\'s first Vuepress',
    head: [['link', {rel: 'icon', href: '/images/logo_bak.png'}]],
    home: '/',
    theme: defaultTheme({
        logo: '/images/logo_bak.png',
        repo: 'JerryTZF/vuepress',
        backToHome: '页面未找到，请检查路由 :(',
        notFound: ['抱歉，当前页面文档未找到，请联系管理员~'],
        lastUpdatedText: '更新时间',
        contributorsText: '贡献者',
        editLink: false,
        tip: '【注意】',
        warning: '【警告】',
        danger: '【危险】',
        sidebarDepth: 1,
        navbar: [
            {text: '概述', link: '/zh/overview'},
            {
                text: 'Hyperf框架',
                children: [
                    {text: 'web使用', link: '/zh/hyperf/hyperf-web'},
                    {text: '常用组件', link: '/zh/hyperf/hyperf-component'},
                    {text: '奇技淫巧', link: '/zh/hyperf/hyperf-skills'},
                    {text: '使用规范', link: '/zh/hyperf/hyperf-standard'},
                ]
            },
            {
                text: 'Docker相关',
                children: [
                    {text: '常用命令', link: '/zh/docker/cli-order'},
                    {text: '基础知识', link: '/zh/docker/basic'},
                    {text: '容器编排', link: '/zh/docker/docker-compose'},
                    {text: 'Docker Swarm', link: '/zh/docker/swarm'},
                    {text: '卷的使用', link: '/zh/docker/volume'},
                    {text: '网络相关', link: '/zh/docker/network'},
                ]
            },
            {
                text: '项目文档',
                children: [
                    {text: '文档说明', link: '/zh/project/overview',},
                    {text: '积分有礼', link: '/zh/project/gift_point/gift-point-db'},
                    {text: '运营商', link: '/zh/project/operator/operator-db'},
                    {text: '银行申卡', link: '/zh/project/bank/bank-db'},
                ]
            },
            {
                text: '杂谈', link: '/zh/harvest/overview'
            }
        ],
    }),
    plugins: [
        [
            searchPlugin({
                locales: {
                    '/': {
                        placeholder: '搜索',
                    },
                },
                hotKeys: ['s', '/'],
                maxSuggestions: 10
            }),
            clipboardPlugin({
                align: "top"
            })
        ],
    ],
}