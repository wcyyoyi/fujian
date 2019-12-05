export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: '首页',
            icon: 'cion-home',
            selected: false,
            expanded: false,
            hidden: false,
            order: 0,
            url: "",
            target: ""
          }
        }
      },
      {
        path: 'editors',
        // path: 'editors/ckeditor1/WCRM,MONT',
        data: {
          menu: {
            title: '服务产品制作',
            icon: 'cion-info',
            selected: false,
            expanded: false,
            hidden: false,
            order: 200
          }
        }
      },
      {
        path: 'datas',
        // path: 'datas/index/viewer',
        data: {
          menu: {
            title: '农业气象数据',
            icon: 'cion-db',
            selected: false,
            expanded: false,
            hidden: false,
            order: 100
          }
        }
      },
      {
        path: 'analyses',
        // path: 'analyses/v12052:[300,]/1',
        data: {
          menu: {
            title: '农业气候资源',
            icon: 'cion-anls',
            selected: false,
            expanded: false,
            hidden: false,
            order: 500
          }
        }
      },
      {
        path: 'product',
        // path: 'product/homePage/BEFZ',
        data: {
          menu: {
            title: '农气产品展示',
            icon: 'cion-prod',
            selected: false,
            expanded: false,
            hidden: false,
            order: 600
          }
        }
      },
      {
        path: 'forms',
        data: {
          menu: {
            title: '农气产品管理',
            icon: 'cion-qa',
            selected: false,
            expanded: false,
            hidden: false,
            order: 400
          }
        }
      },
      {
        path: 'quality',
        data: {
          menu: {
            title: '气候品质认证',
            icon: 'cion-weath',
            selected: false,
            expanded: false,
            hidden: false,
            order: 600
          }
        },
      },
    ]
  }
];
