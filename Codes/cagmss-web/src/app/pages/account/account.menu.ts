export const ACCOUNT_MENU = [
    {
        path: 'pages',
        children: [{
            path: 'account',
            data: {
                menu: {
                    title: '个人中心',
                    icon: 'ion-grid',
                    selected: false,
                    expanded: true,
                    order: 100
                }
            },
            children: [
                {
                    path: 'info',
                    data: {
                        menu: {
                            title: '基本信息',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 101
                        }
                    }
                },
                {
                    path: 'change',
                    data: {
                        menu: {
                            title: '修改密码',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 102
                        }
                    }
                }
            ]
        }]
    }
];
