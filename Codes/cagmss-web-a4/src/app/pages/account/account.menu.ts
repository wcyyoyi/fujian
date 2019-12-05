export const ACCOUNT_MENU = [
    {
        path: 'pages',
        children: [
            {
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
                    },
                    {
                        path: 'customSetting',
                        data: {
                            menu: {
                                title: '自定义配置',
                                icon: 'ion-edit',
                                selected: false,
                                expanded: false,
                                order: 103
                            }
                        }
                    },
                    {
                        path: 'changeColor',
                        data: {
                            menu: {
                                title: '主题选择',
                                icon: 'ion-edit',
                                selected: false,
                                expanded: false,
                                order: 104
                            }
                        }
                    },
                    {
                        path: 'imgSetting',
                        data: {
                            menu: {
                                title: '背景图片设置',
                                icon: 'ion-edit',
                                selected: false,
                                expanded: false,
                                order: 105
                            }
                        }
                    }
                ]
            },
            {
                path: 'account',
                data: {
                    menu: {
                        title: '用户管理',
                        icon: 'ion-grid',
                        selected: false,
                        expanded: true,
                        hidden: false,
                        order: 100
                    }
                },
                children: [
                    {
                        path: 'adduser',
                        data: {
                            menu: {
                                title: '新建用户',
                                icon: 'ion-edit',
                                selected: false,
                                expanded: false,
                                order: 101
                            }
                        }
                    }
                ]
            },
            {
                path: 'account',
                data: {
                    menu: {
                        title: '区域管理',
                        icon: 'ion-grid',
                        selected: false,
                        expanded: true,
                        order: 100
                    }
                },
                children: [
                    {
                        path: 'addarea',
                        data: {
                            menu: {
                                title: '新建区域',
                                icon: 'ion-edit',
                                selected: false,
                                expanded: false,
                                order: 101
                            }
                        }
                    },
                    {
                        path: 'areaview',
                        data: {
                            menu: {
                                title: '查看区域',
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
                path: 'account',
                data: {
                    menu: {
                        title: '站点管理',
                        icon: 'ion-grid',
                        selected: false,
                        expanded: true,
                        order: 100
                    }
                },
                children: [
                    {
                        path: 'addstation',
                        data: {
                            menu: {
                                title: '新建站点',
                                icon: 'ion-edit',
                                selected: false,
                                expanded: false,
                                order: 101
                            }
                        }
                    },
                    {
                        path: 'stationview',
                        data: {
                            menu: {
                                title: '查看站点',
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
                path: 'account',
                data: {
                    menu: {
                        title: '配置管理',
                        icon: 'ion-grid',
                        selected: false,
                        expanded: true,
                        hidden: false,
                        order: 100
                    }
                },
                children: [
                    {
                        path: 'modalmanage',
                        data: {
                            menu: {
                                title: '模版管理',
                                icon: 'ion-edit',
                                selected: false,
                                expanded: false,
                                order: 101
                            }
                        }
                    },
                    {
                        path: 'bookMark',
                        data: {
                            menu: {
                                title: '书签管理',
                                icon: 'ion-edit',
                                selected: false,
                                expanded: false,
                                order: 102
                            }
                        }
                    },
                    {
                        path: 'attentionEdit',
                        data: {
                            menu: {
                                title: '关注内容编辑',
                                icon: 'ion-edit',
                                selected: false,
                                expanded: false,
                                order: 103
                            }
                        }
                    },
                    {
                        path: 'warning',
                        data: {
                            menu: {
                                title: '预警信息管理',
                                icon: 'ion-edit',
                                selected: false,
                                expanded: false,
                                order: 104
                            }
                        }
                    },
                    // {
                    //     path: 'cacheSetting',
                    //     data: {
                    //         menu: {
                    //             title: '缓存设置',
                    //             icon: 'ion-edit',
                    //             selected: false,
                    //             expanded: false,
                    //             order: 105
                    //         }
                    //     }
                    // }
                ]
            },
        ]
    }
];
