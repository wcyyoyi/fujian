export const DATAS_MENU = [
    {
        path: 'pages',
        children: [{
            path: 'datas',
            data: {
                menu: {
                    title: '指标建议库',
                    icon: 'ion-grid',
                    selected: false,
                    expanded: false,
                    order: 100
                }
            },
            children: [
                {
                    path: 'index/viewer',
                    data: {
                        menu: {
                            title: '指标查询',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 102
                        }
                    }
                },
                {
                    path: 'editor/index',
                    data: {
                        menu: {
                            title: '指标填报',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 101
                        }
                    }
                },
                {
                    path: 'meta/crop',
                    data: {
                        menu: {
                            title: '作物信息管理',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 103
                        }
                    }
                }
            ]
        },
        {
            path: 'datas',
            data: {
                menu: {
                    title: '农气数据库',
                    icon: 'ion-grid',
                    selected: false,
                    expanded: false,
                    order: 100
                }
            },
            children: [
                {
                    path: 'view/surface',
                    data: {
                        menu: {
                            title: '日资料',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 103
                        }
                    }
                },
                {
                    path: 'view/shour',
                    data: {
                        menu: {
                            title: '小时资料',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 104
                        }
                    }
                },
                {
                    path: 'view/asmm',
                    data: {
                        menu: {
                            title: '土壤水分',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 105
                        }
                    }
                },
                {
                    path: 'view/c01',
                    data: {
                        menu: {
                            title: '作物生长发育期',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 106
                        }
                    }
                },
                {
                    path: 'view/mos',
                    data: {
                        menu: {
                            title: '预报资料',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 107
                        }
                    }
                }
            ]
        }]
    }
];
