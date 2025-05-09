const horizontalMenuData = () => [
  // This is how you will normally render submenu
  {
    label: 'dashboards',
    icon: 'ri-home-smile-line',
    children: [
      // This is how you will normally render menu item
      {
        label: 'crm',
        icon: 'ri-pie-chart-2-line',
        href: '/dashboards/crm'
      },
      {
        label: 'analytics',
        icon: 'ri-bar-chart-line',
        href: '/dashboards/analytics'
      },
      {
        label: 'eCommerce',
        icon: 'ri-shopping-bag-3-line',
        href: '/dashboards/ecommerce'
      },
      {
        label: 'academy',
        icon: 'ri-graduation-cap-line',
        href: '/dashboards/academy'
      },
      {
        label: 'logistics',
        icon: 'ri-car-line',
        href: '/dashboards/logistics'
      }
    ]
  },
  {
    label: 'apps',
    icon: 'ri-mail-open-line',
    children: [
      {
        label: 'eCommerce',
        icon: 'ri-shopping-bag-3-line',
        children: [
          {
            label: 'dashboard',
            href: '/ecommerce/dashboard'
          },
          {
            label: 'products',
            children: [
              {
                label: 'list',
                href: '/ecommerce/products/list'
              },
              {
                label: 'add',
                href: '/ecommerce/products/add'
              },
              {
                label: 'category',
                href: '/ecommerce/products/category'
              }
            ]
          },
          {
            label: 'orders',
            children: [
              {
                label: 'list',
                href: '/ecommerce/orders/list'
              },
              {
                label: 'details',
                href: '/ecommerce/orders/details/5434',
                exactMatch: false,
                activeUrl: '/ecommerce/orders/details'
              }
            ]
          },
          {
            label: 'customers',
            children: [
              {
                label: 'list',
                href: '/ecommerce/customers/list'
              },
              {
                label: 'details',
                href: '/ecommerce/customers/details/879861',
                exactMatch: false,
                activeUrl: '/ecommerce/customers/details'
              }
            ]
          },
          {
            label: 'manageReviews',
            href: '/ecommerce/manage-reviews'
          },
          {
            label: 'referrals',
            href: '/ecommerce/referrals'
          },
          {
            label: 'settings',
            href: '/ecommerce/settings'
          }
        ]
      },
      {
        label: 'academy',
        icon: 'ri-graduation-cap-line',
        children: [
          {
            label: 'dashboard',
            href: '/academy/dashboard'
          },
          {
            label: 'myCourses',
            href: '/academy/my-courses'
          },
          {
            label: 'courseDetails',
            href: '/academy/course-details'
          }
        ]
      },
      {
        label: 'logistics',
        icon: 'ri-car-line',
        children: [
          {
            label: 'dashboard',
            href: '/logistics/dashboard'
          },
          {
            label: 'fleet',
            href: '/logistics/fleet'
          }
        ]
      },
      {
        label: 'email',
        icon: 'ri-mail-open-line',
        href: '/email',
        exactMatch: false,
        activeUrl: '/email'
      },
      {
        label: 'chat',
        icon: 'ri-wechat-line',
        href: '/chat'
      },
      {
        label: 'calendar',
        href: '/calendar',
        icon: 'ri-calendar-line'
      },
      {
        label: 'kanban',
        icon: 'ri-drag-drop-line',
        href: '/kanban'
      },
      {
        label: 'invoice',
        icon: 'ri-file-list-2-line',
        children: [
          {
            label: 'list',
            href: '/invoice/list'
          },
          {
            label: 'preview',
            href: '/invoice/preview/4987',
            exactMatch: false,
            activeUrl: '/invoice/preview'
          },
          {
            label: 'edit',
            href: '/invoice/edit/4987',
            exactMatch: false,
            activeUrl: '/invoice/edit'
          },
          {
            label: 'add',
            href: '/invoice/add'
          }
        ]
      },
      {
        label: 'user',
        icon: 'ri-user-line',
        children: [
          {
            label: 'list',
            href: '/user/list'
          },
          {
            label: 'view',
            href: '/user/view'
          }
        ]
      },
      {
        label: 'rolesPermissions',
        icon: 'ri-lock-line',
        children: [
          {
            label: 'roles',
            href: '/roles'
          },
          {
            label: 'permissions',
            href: '/permissions'
          }
        ]
      }
    ]
  },
  {
    label: 'pages',
    icon: 'ri-file-list-2-line',
    children: [
      {
        label: 'userProfile',
        icon: 'ri-user-3-line',
        href: '/pages/user-profile'
      },
      {
        label: 'accountSettings',
        icon: 'ri-user-settings-line',
        href: '/pages/account-settings'
      },
      {
        label: 'faq',
        icon: 'ri-question-line',
        href: '/pages/faq'
      },
      {
        label: 'pricing',
        icon: 'ri-money-dollar-circle-line',
        href: '/pages/pricing'
      },
      {
        label: 'miscellaneous',
        icon: 'ri-file-info-line',
        children: [
          {
            label: 'comingSoon',
            href: '/pages/misc/coming-soon',
            target: '_blank'
          },
          {
            label: 'underMaintenance',
            href: '/pages/misc/under-maintenance',
            target: '_blank'
          },
          {
            label: 'pageNotFound404',
            href: '/pages/misc/404-not-found',
            target: '_blank'
          },
          {
            label: 'notAuthorized401',
            href: '/pages/misc/401-not-authorized',
            target: '_blank'
          }
        ]
      },
      {
        label: 'authPages',
        icon: 'ri-shield-keyhole-line',
        children: [
          {
            label: 'login',
            children: [
              {
                label: 'loginV1',
                href: '/pages/auth/login-v1',
                target: '_blank'
              },
              {
                label: 'loginV2',
                href: '/pages/auth/login-v2',
                target: '_blank'
              }
            ]
          },
          {
            label: 'register',
            children: [
              {
                label: 'registerV1',
                href: '/pages/auth/register-v1',
                target: '_blank'
              },
              {
                label: 'registerV2',
                href: '/pages/auth/register-v2',
                target: '_blank'
              },
              {
                label: 'registerMultiSteps',
                href: '/pages/auth/register-multi-steps',
                target: '_blank'
              }
            ]
          },
          {
            label: 'verifyEmail',
            children: [
              {
                label: 'verifyEmailV1',
                href: '/pages/auth/verify-email-v1',
                target: '_blank'
              },
              {
                label: 'verifyEmailV2',
                href: '/pages/auth/verify-email-v2',
                target: '_blank'
              }
            ]
          },
          {
            label: 'forgotPassword',
            children: [
              {
                label: 'forgotPasswordV1',
                href: '/pages/auth/forgot-password-v1',
                target: '_blank'
              },
              {
                label: 'forgotPasswordV2',
                href: '/pages/auth/forgot-password-v2',
                target: '_blank'
              }
            ]
          },
          {
            label: 'resetPassword',
            children: [
              {
                label: 'resetPasswordV1',
                href: '/pages/auth/reset-password-v1',
                target: '_blank'
              },
              {
                label: 'resetPasswordV2',
                href: '/pages/auth/reset-password-v2',
                target: '_blank'
              }
            ]
          },
          {
            label: 'twoSteps',
            children: [
              {
                label: 'twoStepsV1',
                href: '/pages/auth/two-steps-v1',
                target: '_blank'
              },
              {
                label: 'twoStepsV2',
                href: '/pages/auth/two-steps-v2',
                target: '_blank'
              }
            ]
          }
        ]
      },
      {
        label: 'wizardExamples',
        icon: 'ri-git-commit-line',
        children: [
          {
            label: 'checkout',
            href: '/pages/wizard-examples/checkout'
          },
          {
            label: 'propertyListing',
            href: '/pages/wizard-examples/property-listing'
          },
          {
            label: 'createDeal',
            href: '/pages/wizard-examples/create-deal'
          }
        ]
      },
      {
        label: 'dialogExamples',
        icon: 'ri-tv-2-line',
        href: '/pages/dialog-examples'
      },
      {
        label: 'widgetExamples',
        icon: 'ri-bar-chart-box-line',
        children: [
          {
            label: 'basic',
            href: '/pages/widget-examples/basic'
          },
          {
            label: 'advanced',
            href: '/pages/widget-examples/advanced'
          },
          {
            label: 'statistics',
            href: '/pages/widget-examples/statistics'
          },
          {
            label: 'charts',
            href: '/pages/widget-examples/charts'
          },
          {
            label: 'gamification',
            href: '/pages/widget-examples/gamification'
          },
          {
            label: 'actions',
            href: '/pages/widget-examples/actions'
          }
        ]
      },
      {
        label: 'frontPages',
        icon: 'ri-file-copy-line',
        children: [
          {
            label: 'landing',
            href: '/front-pages/landing-page',
            target: '_blank'
          },
          {
            label: 'pricing',
            href: '/front-pages/pricing',
            target: '_blank'
          },
          {
            label: 'payment',
            href: '/front-pages/payment',
            target: '_blank'
          },
          {
            label: 'checkout',
            href: '/front-pages/checkout',
            target: '_blank'
          },
          {
            label: 'helpCenter',
            href: '/front-pages/help-center',
            target: '_blank'
          }
        ]
      }
    ]
  },
  {
    label: 'formsAndTables',
    icon: 'ri-pages-line',
    children: [
      {
        label: 'formLayouts',
        icon: 'ri-layout-4-line',
        href: '/forms/form-layouts'
      },
      {
        label: 'formValidation',
        icon: 'ri-checkbox-multiple-line',
        href: '/forms/form-validation'
      },
      {
        label: 'formWizard',
        icon: 'ri-git-commit-line',
        href: '/forms/form-wizard'
      },
      {
        label: 'reactTable',
        icon: 'ri-table-alt-line',
        href: '/react-table'
      },
      {
        label: 'formELements',
        icon: 'ri-radio-button-line',
        suffix: <i className='ri-external-link-line text-xl' />,
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements`,
        target: '_blank'
      },
      {
        label: 'muiTables',
        icon: 'ri-table-2',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/mui-table`,
        suffix: <i className='ri-external-link-line text-xl' />,
        target: '_blank'
      }
    ]
  },
  {
    label: 'charts',
    icon: 'ri-bar-chart-2-line',
    children: [
      {
        label: 'apex',
        icon: 'ri-line-chart-line',
        href: '/charts/apex-charts'
      },
      {
        label: 'recharts',
        icon: 'ri-bar-chart-line',
        href: '/charts/recharts'
      }
    ]
  },
  {
    label: 'others',
    icon: 'ri-more-line',
    children: [
      {
        label: 'foundation',
        icon: 'ri-pantone-line',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/foundation`,
        suffix: <i className='ri-external-link-line text-xl' />,
        target: '_blank'
      },
      {
        label: 'components',
        icon: 'ri-toggle-line',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components`,
        suffix: <i className='ri-external-link-line text-xl' />,
        target: '_blank'
      },
      {
        label: 'menuExamples',
        icon: 'ri-menu-search-line',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/menu-examples/overview`,
        suffix: <i className='ri-external-link-line text-xl' />,
        target: '_blank'
      },
      {
        label: 'raiseSupport',
        icon: 'ri-lifebuoy-line',
        href: 'https://themeselection.com/support',
        suffix: <i className='ri-external-link-line text-xl' />,
        target: '_blank'
      },
      {
        label: 'documentation',
        icon: 'ri-book-line',
        href: `${process.env.NEXT_PUBLIC_DOCS_URL}`,
        suffix: <i className='ri-external-link-line text-xl' />,
        target: '_blank'
      },
      {
        suffix: {
          label: 'New',
          color: 'info'
        },
        label: 'itemWithBadge',
        icon: 'ri-notification-badge-line'
      },
      {
        label: 'externalLink',
        icon: 'ri-link',
        href: 'https://mui.com/store/contributors/themeselection',
        target: '_blank',
        suffix: <i className='ri-external-link-line text-xl' />
      },
      {
        label: 'menuLevels',
        icon: 'ri-menu-2-line',
        children: [
          {
            label: 'menuLevel2'
          },
          {
            label: 'menuLevel2',
            children: [
              {
                label: 'menuLevel3'
              },
              {
                label: 'menuLevel3'
              }
            ]
          }
        ]
      },
      {
        label: 'disabledMenu',
        disabled: true
      }
    ]
  }
]

export default horizontalMenuData
