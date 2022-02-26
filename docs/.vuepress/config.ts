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
        navbar: [
            {
                text: '概述',
                link: '/zh/overview'
            },
            {
                text: '编程语言',
                children: [
                    {
                        text: 'php', children: [
                            {text: '配置相关', link: '/zh/lang/php/php-ini-config'},
                            {text: 'cli模式', link: '/zh/lang/php/php-cli'},
                            {text: '常用函数', link: '/zh/lang/php/php-normal-func'},
                            {text: 'swoole', link: '/zh/lang/php/php-swoole'},
                        ]
                    },
                    {
                        text: 'golang', children: [
                            {text: '🐘-语法', link: '/zh/lang/golang/go-01'},
                            {text: '🐘-FPM', link: '/zh/lang/golang/go-02'},
                            {text: '🐘-SWOOLE', link: '/zh/lang/golang/go-03'},
                        ]
                    }
                ]
            },
            {
                text: 'Hyperf框架',
                children: [
                    {text: '奇技淫巧', link: '/zh/lang/php/php-01'}
                ]
            },
            {
                text: '友谊万岁', children: [
                    {
                        text: '前端',
                        children: [
                            {text: '前端-01', link: '/zh/lang/golang/go-01'},
                            {text: '前端-02', link: '/zh/lang/golang/go-01'},
                            {text: '前端-03', link: '/zh/lang/golang/go-01'},
                        ]
                    },
                    {
                        text: '后端',
                        children: [
                            {text: '后端-01', link: '/zh/lang/golang/go-01'},
                            {text: '后端-02', link: '/zh/lang/golang/go-01'},
                            {text: '后端-03', link: '/zh/lang/golang/go-01'},
                        ]
                    }
                ]
            },
            {text: '项目文档', link: '/zh/project/gift-point'},
            {text: '接口文档', link: '/zh/linux/linux-01'}
        ],
        sidebar: [
            {
                text: '概述',
                link: '/zh/overview'
            },
            {
                text: '编程语言',
                collapsible: true,
                children: [
                    {
                        text: 'PHP',
                        collapsible: true,
                        children: [
                            '/zh/lang/php/php-ini-config.md',
                            '/zh/lang/php/php-cli',
                            '/zh/lang/php/php-normal-func',
                            '/zh/lang/php/php-swoole',
                        ]
                    },
                    {
                        text: 'Golang',
                        collapsible: true,
                        children: [
                            '/zh/lang/golang/go-01',
                            '/zh/lang/golang/go-02',
                            '/zh/lang/golang/go-03',
                        ]
                    }
                ]
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