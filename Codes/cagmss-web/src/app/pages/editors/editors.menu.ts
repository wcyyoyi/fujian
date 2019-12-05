export const EDITORS_MENU = [
    {
        path: 'pages',
        children: [{
            path: 'editors',
            data: {
                menu: {
                    title: '农业气象情报',
                    icon: 'ion-grid',
                    selected: false,
                    expanded: false,
                    order: 100
                }
            },
            children: [
                {
                    path: 'ckeditor1/WCRM,MONT',
                    data: {
                        menu: {
                            title: '月报',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 101
                        }
                    }
                },
                {
                    path: 'ckeditor2/WCRM,TEND',
                    data: {
                        menu: {
                            title: '旬报',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 102
                        }
                    }
                },
                {
                    path: 'ckeditor3/WCRM,WEEK',
                    data: {
                        menu: {
                            title: '周报',
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
            path: 'editors',
            data: {
                menu: {
                    title: '农业天气预报',
                    icon: 'ion-grid',
                    selected: false,
                    expanded: false,
                    order: 200
                }
            },
            children: [
                {
                    path: 'ckeditor4/AWFC,SPRS-PLO-SOW',
                    data: {
                        menu: {
                            title: '春耕春播',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 201
                        }
                    }
                },
                {
                    path: 'ckeditor5/AWFC,SUMS-HAR-SOW',
                    data: {
                        menu: {
                            title: '夏收夏种',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 202
                        }
                    }
                },
                {
                    path: 'ckeditor6/AWFC,AUTS-HAR-SOW',
                    data: {
                        menu: {
                            title: '秋收秋种',
                            icon: 'ion-edit',
                            selected: false,
                            expanded: false,
                            order: 203
                        }
                    }
                }
            ]
        },
            // {
            //     path: 'editors',
            //     data: {
            //         menu: {
            //             title: '作物长势监测',
            //             icon: 'ion-document',
            //             selected: false,
            //             expanded: false,
            //             order: 100
            //         }
            //     },
            //     children: [
            //         {
            //             path: 'imgs/cgfc_eari-dvs',
            //             data: {
            //                 menu: {
            //                     title: '双季早稻',
            //                     icon: 'ion-document',
            //                     selected: false,
            //                     expanded: false,
            //                     order: 101
            //                 }
            //             }
            //         },
            //         {
            //             path: 'imgs/cgfc_lari-dvs',
            //             data: {
            //                 menu: {
            //                     title: '双季晚稻',
            //                     icon: 'ion-document',
            //                     selected: false,
            //                     expanded: false,
            //                     order: 102
            //                 }
            //             }
            //         },
            //         {
            //             path: ' ',
            //             data: {
            //                 menu: {
            //                     title: '花生',
            //                     icon: 'ion-document',
            //                     selected: false,
            //                     expanded: false,
            //                     order: 103
            //                 }
            //             }
            //         },
            //         {
            //             path: ' ',
            //             data: {
            //                 menu: {
            //                     title: '茶叶',
            //                     icon: 'ion-document',
            //                     selected: false,
            //                     expanded: false,
            //                     order: 104
            //                 }
            //             }
            //         },
            //         {
            //             path: 'words/cgfc_pdf',
            //             data: {
            //                 menu: {
            //                     title: '文字产品',
            //                     icon: 'ion-document',
            //                     selected: false,
            //                     expanded: false,
            //                     order: 104
            //                 }
            //             }
            //         }
            //     ]
            // },
            // {
            //     path: 'editors',
            //     data: {
            //         menu: {
            //             title: '农业气象灾害监测',
            //             icon: 'ion-stats-bars',
            //             selected: false,
            //             expanded: false,
            //             order: 100
            //         }
            //     },
            //     children: [
            //         {
            //             path: 'adrm_lari-dvs',
            //             data: {
            //                 menu: {
            //                     title: '早稻低温阴雨',
            //                     icon: 'ion-stats-bars',
            //                     selected: false,
            //                     expanded: false,
            //                     order: 101
            //                 }
            //             }
            //         },
            //         {
            //             path: 'adrm_lari-dvs',
            //             data: {
            //                 menu: {
            //                     title: '晚稻高温热害',
            //                     icon: 'ion-stats-bars',
            //                     selected: false,
            //                     expanded: false,
            //                     order: 101
            //                 }
            //             }
            //         },
            //         {
            //             path: 'adrm_lari-dvs',
            //             data: {
            //                 menu: {
            //                     title: '晚稻寒露风',
            //                     icon: 'ion-stats-bars',
            //                     selected: false,
            //                     expanded: false,
            //                     order: 101
            //                 }
            //             }
            //         },
            //         {
            //             path: 'adrm_pdf',
            //             data: {
            //                 menu: {
            //                     title: '文字产品',
            //                     icon: 'ion-document',
            //                     selected: false,
            //                     expanded: false,
            //                     order: 104
            //                 }
            //             }
            //         }
            //     ]
            // },
            // {
            //     path: 'editors',
            //     data: {
            //         menu: {
            //             title: '土壤水分监测',
            //             icon: 'ion-stats-bars',
            //             selected: false,
            //             expanded: false,
            //             order: 100
            //         }
            //     },
            //     children: [
            //         {
            //             path: 'swrm_lari-dvs',
            //             data: {
            //                 menu: {
            //                     title: '分类1',
            //                     icon: 'ion-stats-bars',
            //                     selected: false,
            //                     expanded: false,
            //                     order: 101
            //                 }
            //             }
            //         },
            //         {
            //             path: 'swrm_lari-dvs',
            //             data: {
            //                 menu: {
            //                     title: '分类2',
            //                     icon: 'ion-stats-bars',
            //                     selected: false,
            //                     expanded: false,
            //                     order: 101
            //                 }
            //             }
            //         },
            //         {
            //             path: 'swrm_pdf',
            //             data: {
            //                 menu: {
            //                     title: '文字产品',
            //                     icon: 'ion-document',
            //                     selected: false,
            //                     expanded: false,
            //                     order: 104
            //                 }
            //             }
            //         }
            //     ]
            // }
        ]
    }
];
