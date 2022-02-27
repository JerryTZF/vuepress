module.exports = {
    lang: 'zh-CN',
    title: 'Jerry\'s Wiki',
    description: 'This is Jerry\'s first Vuepress',
    head: [['link', {rel: 'icon', href: '/images/logo.png'}]],
    home: '/',
    theme: '@vuepress/theme-default',
    plugins: [
        [
            '@vuepress/plugin-search',
            {
                locales: {
                    '/': {
                        placeholder: '搜索',
                    },
                },
                hotKeys: ['s', '/'],
                maxSuggestions: 10,
            },
        ],
    ],
    themeConfig: {
        logo: '/images/logo.png',
        repo: 'JerryTZF/vuepress',
        backToHome: 'Page not found, please check :(',
        notFound: ['Sorry, the current document does not exist, please contact your administrator'],
        lastUpdatedText: '更新时间',
        contributorsText: '贡献者',
        editLink: false,
        tip: 'INFO',
        warning: 'WARNING',
        danger: 'DANGER',
        sidebarDepth: 1,
        navbar: [
            {
                text: '概述',
                link: '/zh/overview'
            },
            {
                text: 'Hyperf框架',
                children: [
                    {text: '奇技淫巧', link: '/zh/lang/php/php-01'}
                ]
            },
            {text: '常用工具', link: '/zh/tools'},
            {
                text: '项目文档',
                children: [
                    {text: '文档说明', link: '/zh/project/overview',},
                    {text: '积分有礼', link: '/zh/project/gift_point/gift-point-db'},
                    {text: '运营商', link: '/zh/project/operator/operator-db'},
                    {text: '银行申卡', link: '/zh/project/bank/bank-db'},
                ]
            }
        ],
        sidebar: [
            {
                text: '概述',
                link: '/zh/overview'
            },
            {
                text: '杂项',
                collapsible: true,
            },
            {
                text: 'Hyperf框架',
                collapsible: true,
            },
            {
                text: '项目文档',
                collapsible: true,
            },
            {
                text: '接口文档',
                collapsible: true,
            }
        ]
    },
}