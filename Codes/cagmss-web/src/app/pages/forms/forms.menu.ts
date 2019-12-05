export const FORMS_MENU = [
    {
        path: 'pages',
        children: [{
            path: 'forms',
            data: {
                menu: {
                    title: '上报',
                    icon: 'ion-grid',
                    selected: false,
                    expanded: false,
                    order: 100
                }
            },
            children: [
                // {
                //     path: ' ',
                //     data: {
                //         menu: {
                //             title: '农情',
                //             icon: 'ion-edit',
                //             selected: false,
                //             expanded: false,
                //             order: 101
                //         }
                //     }
                // },
                {
                    path: 'disaster',
                    data: {
                        menu: {
                            title: '灾情',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 102
                        }
                    }
                }
            ]
        },
        {
            path: ' ',
            data: {
                menu: {
                    title: '浏览查询',
                    icon: 'ion-grid',
                    selected: false,
                    expanded: false,
                    order: 100
                }
            },
            children: [
                // {
                //     path: ' ',
                //     data: {
                //         menu: {
                //             title: '农情',
                //             icon: 'ion-edit',
                //             selected: false,
                //             expanded: false,
                //             order: 101
                //         }
                //     }
                // },
                {
                    path: 'disasterview',
                    data: {
                        menu: {
                            title: '灾情',
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
