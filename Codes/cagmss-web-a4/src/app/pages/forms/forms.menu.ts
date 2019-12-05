export const FORMS_MENU = [
    {
        path: 'pages',
        children: [{
            path: 'forms',
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
                {
                    path: 'disasterview',
                    data: {
                        menu: {
                            title: '灾情查询',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 102
                        }
                    }
                },
                {
                    path: 'agmeView',
                    data: {
                        menu: {
                            title: '农业观测图片查询',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 102
                        }
                    }
                },
                {
                    path: 'agmeCli',
                    data: {
                        menu: {
                            title: '农田小气候数据监控',
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
                {
                    path: 'disaster',
                    data: {
                        menu: {
                            title: '灾情上报',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 102
                        }
                    }
                },
                {
                    path: 'agme',
                    data: {
                        menu: {
                            title: '农业观测图片上报',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 101
                        }
                    }
                },
                {
                    path: 'product',
                    data: {
                        menu: {
                            title: '产品上传',
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
