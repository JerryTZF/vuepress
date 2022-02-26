module.exports = {
    lang: 'zh-CN',
    title: 'Jerry\'s Wiki',
    description: 'This is Jerry\'s first Vuepress',
    head: [['link', {rel: 'icon', href: '/images/logo.png'}]],

    theme: '@vuepress/theme-default',
    themeConfig: {
        logo: '/images/logo.png',
        repo: 'https://github.com/JerryTZF/vuepress',
        backToHome: '页面未找到，请检查 :(',
        navbar: [
            {
                text: '概述',
                link: '/zh/homepage'
            },
            {
                text: '编程语言',
                children: [
                    {
                        text: 'php', children: [
                            {text: '🐘-语法', link: '/zh/lang/php/php-01'},
                            {text: '🐘-FPM', link: '/zh/lang/php/php-02'},
                            {text: '🐘-SWOOLE', link: '/zh/lang/php/php-03'},
                            {text: '🐘-进阶', link: '/zh/lang/php/php-04'},
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
            {text: 'Linux', link: '/zh/linux/linux-01'}
        ]
    },
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
}