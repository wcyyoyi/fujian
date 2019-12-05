export const ANALS_MENU = [
    {
        path: 'pages',
        children: [{
            path: 'analyses',
            data: {
                menu: {
                    title: '高温',
                    icon: 'ion-grid',
                    selected: false,
                    expanded: true,
                    order: 100
                }
            },
            children: [
                {
                    path: 'v12052:[300,]/7',
                    data: {
                        menu: {
                            title: '常规统计',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 101
                        }
                    }
                },
                {
                    path: 'v12052:[300,]/1',
                    data: {
                        menu: {
                            title: '高温日数',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 101
                        }
                    }
                },
                {
                    path: 'v12052:[300,]/2',
                    data: {
                        menu: {
                            title: '最早出现高温日期',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 102
                        }
                    }
                },
                {
                    path: 'v12052:[300,]/3',
                    data: {
                        menu: {
                            title: '最晚出现高温日期',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 103
                        }
                    }
                },
                {
                    path: 'v12052/4',
                    data: {
                        menu: {
                            title: '极端最高气温及日期',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 103
                        }
                    }
                },
                {
                    path: 'v12052:[300,]/6',
                    data: {
                        menu: {
                            title: '连续高温日数',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 101
                        }
                    }
                },
            ]
        },
        {
            path: 'analyses',
            data: {
                menu: {
                    title: '低温',
                    icon: 'ion-grid',
                    selected: false,
                    expanded: false,
                    order: 200
                }
            },
            children: [
                {
                    path: 'v12053:[,0]/7',
                    data: {
                        menu: {
                            title: '常规统计',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 101
                        }
                    }
                },
                {
                    path: 'v12053:[,0]/1',
                    data: {
                        menu: {
                            title: '低温日数',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 203
                        }
                    }
                },
                {
                    path: 'v12053:[,0]/2',
                    data: {
                        menu: {
                            title: '最早出现低温日期',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 204
                        }
                    }
                },
                {
                    path: 'v12053:[,0]/3',
                    data: {
                        menu: {
                            title: '最晚出现低温日期',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 205
                        }
                    }
                },
                {
                    path: 'v12053/5',
                    data: {
                        menu: {
                            title: '极端最低气温及日期',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 206
                        }
                    }
                },
                {
                    path: 'v12053:[,0]/6',
                    data: {
                        menu: {
                            title: '连续低温日数',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 206
                        }
                    }
                },
            ]
        },
        {
            path: 'analyses',
            data: {
                menu: {
                    title: '降水',
                    icon: 'ion-grid',
                    selected: false,
                    expanded: false,
                    order: 300
                }
            },
            children: [
                {
                    path: 'v13201:[0,]/7',
                    data: {
                        menu: {
                            title: '常规统计',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 101
                        }
                    }
                },
                {
                    path: 'v13201:[0.1,]/1',
                    data: {
                        menu: {
                            title: '降水日数',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 303
                        }
                    }
                },
                {
                    path: 'v13201:[10,]/1',
                    data: {
                        menu: {
                            title: '中雨日数',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 304
                        }
                    }
                },
                {
                    path: 'v13201:[25,]/1',
                    data: {
                        menu: {
                            title: '大雨日数',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 305
                        }
                    }
                },
                {
                    path: 'v13201:[50,]/1',
                    data: {
                        menu: {
                            title: '暴雨日数',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 306
                        }
                    }
                },
                {
                    path: 'v13201/4',
                    data: {
                        menu: {
                            title: '日极端降水量及日期',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 307
                        }
                    }
                },
                {
                    path: 'v13201:[,0.09]/6',
                    data: {
                        menu: {
                            title: '连续无雨日数',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 307
                        }
                    }
                },
            ]
        },
        {
            path: 'analyses',
            data: {
                menu: {
                    title: '日照',
                    icon: 'ion-grid',
                    selected: false,
                    expanded: false,
                    order: 400
                }
            },
            children: [
                {
                    path: 'v14032:[,0]/7',
                    data: {
                        menu: {
                            title: '常规统计',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 101
                        }
                    }
                },
                {
                    path: 'v14032:[,0]/6',
                    data: {
                        menu: {
                            title: '连续无日照日数',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 403
                        }
                    }
                },

            ]
        },
        {
            path: 'analyses',
            data: {
                menu: {
                    title: '积温',
                    icon: 'ion-grid',
                    selected: false,
                    expanded: false,
                    order: 500
                }
            },
            children: [
                {
                    path: 'v12001/7',
                    data: {
                        menu: {
                            title: '常规统计',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 101
                        }
                    }
                }
            ]
        },
        ]
    }
];
