// MUI Imports
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Component Imports
import HorizontalNav, { Menu, SubMenu, MenuItem } from '@menu/horizontal-menu'

// import { GenerateHorizontalMenu } from '@components/GenerateMenu'
// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuRootStyles from '@core/styles/horizontal/menuRootStyles'
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'
import verticalNavigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import verticalMenuItemStyles from '@core/styles/vertical/menuItemStyles'
import verticalMenuSectionStyles from '@core/styles/vertical/menuSectionStyles'

import VerticalNavContent from './VerticalNavContent'

const RenderExpandIcon = ({ level }) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <i className='ri-arrow-right-s-line' />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const HorizontalMenu = ({}) => {
  // Hooks
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()
  const { settings } = useSettings()

  // Vars
  const { skin } = settings
  const { transitionDuration } = verticalNavOptions

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor:
          skin === 'bordered' ? 'var(--mui-palette-background-paper)' : 'var(--mui-palette-background-default)'
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuItemStyles={menuItemStyles(theme, 'ri-circle-line')}
        popoutMenuOffset={{
          mainAxis: ({ level }) => (level && level > 0 ? 4 : 16),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='ri-circle-line' /> },
          menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme)
        }}
      >
        <SubMenu label='dashboards' icon={<i className='ri-home-smile-line' />}>
          <MenuItem href='/dashboards/crm' icon={<i className='ri-pie-chart-2-line' />}>
            crm
          </MenuItem>
          <MenuItem href='/dashboards/analytics' icon={<i className='ri-bar-chart-line' />}>
            analytics
          </MenuItem>
          <MenuItem href='/dashboards/ecommerce' icon={<i className='ri-shopping-bag-3-line' />}>
            eCommerce
          </MenuItem>
          <MenuItem href='/dashboards/academy' icon={<i className='ri-graduation-cap-line' />}>
            academy
          </MenuItem>
          <MenuItem href='/dashboards/logistics' icon={<i className='ri-car-line' />}>
            logistics
          </MenuItem>
        </SubMenu>

        <SubMenu label='apps' icon={<i className='ri-mail-open-line' />}>
          <SubMenu label='eCommerce' icon={<i className='ri-shopping-bag-3-line' />}>
            <MenuItem href='/ecommerce/dashboard'>dashboard</MenuItem>
            <SubMenu label='products'>
              <MenuItem href='/ecommerce/products/list'>list</MenuItem>
              <MenuItem href='/ecommerce/products/add'>add</MenuItem>
              <MenuItem href='/ecommerce/products/category'>category</MenuItem>
            </SubMenu>
            <SubMenu label='orders'>
              <MenuItem href='/ecommerce/orders/list'>list</MenuItem>
              <MenuItem href='/ecommerce/orders/details/5434' exactMatch={false} activeUrl='/ecommerce/orders/details'>
                details
              </MenuItem>
            </SubMenu>
            <SubMenu label='customers'>
              <MenuItem href='/ecommerce/customers/list'>list</MenuItem>
              <MenuItem
                href='/ecommerce/customers/details/879861'
                exactMatch={false}
                activeUrl='/ecommerce/customers/details'
              >
                details
              </MenuItem>
            </SubMenu>
            <MenuItem href='/ecommerce/manage-reviews'>manageReviews</MenuItem>
            <MenuItem href='/ecommerce/referrals'>referrals</MenuItem>
            <MenuItem href='/ecommerce/settings'>settings</MenuItem>
          </SubMenu>
          <SubMenu label='academy' icon={<i className='ri-graduation-cap-line' />}>
            <MenuItem href='/academy/dashboard'>dashboard</MenuItem>
            <MenuItem href='/academy/my-courses'>myCourses</MenuItem>
            <MenuItem href='/academy/course-details'>courseDetails</MenuItem>
          </SubMenu>
          <SubMenu label='logistics' icon={<i className='ri-car-line' />}>
            <MenuItem href='/logistics/dashboard'>dashboard</MenuItem>
            <MenuItem href='/logistics/fleet'>fleet</MenuItem>
          </SubMenu>
          <MenuItem href='/email' exactMatch={false} activeUrl='/email' icon={<i className='ri-mail-open-line' />}>
            email
          </MenuItem>
          <MenuItem href='/chat' icon={<i className='ri-wechat-line' />}>
            chat
          </MenuItem>
          <MenuItem href='/calendar' icon={<i className='ri-calendar-line' />}>
            calendar
          </MenuItem>
          <MenuItem href='/kanban' icon={<i className='ri-drag-drop-line' />}>
            kanban
          </MenuItem>
          <SubMenu label='invoice' icon={<i className='ri-file-list-2-line' />}>
            <MenuItem href='/invoice/list'>list</MenuItem>
            <MenuItem href='/invoice/preview/4987' exactMatch={false} activeUrl='/invoice/preview'>
              preview
            </MenuItem>
            <MenuItem href='/invoice/edit/4987' exactMatch={false} activeUrl='/invoice/edit'>
              edit
            </MenuItem>
            <MenuItem href='/invoice/add'>add</MenuItem>
          </SubMenu>
          <SubMenu label='user' icon={<i className='ri-user-line' />}>
            <MenuItem href='/user/list'>list</MenuItem>
            <MenuItem href='/user/view'>view</MenuItem>
          </SubMenu>
          <SubMenu label='rolesPermissions' icon={<i className='ri-lock-line' />}>
            <MenuItem href='/roles'>roles</MenuItem>
            <MenuItem href='/permissions'>permissions</MenuItem>
          </SubMenu>
        </SubMenu>
        <SubMenu label='pages' icon={<i className='ri-file-list-2-line' />}>
          <MenuItem href='/pages/user-profile' icon={<i className='ri-user-line' />}>
            userProfile
          </MenuItem>
          <MenuItem href='/pages/account-settings' icon={<i className='ri-user-settings-line' />}>
            accountSettings
          </MenuItem>
          <MenuItem href='/pages/faq' icon={<i className='ri-question-line' />}>
            faq
          </MenuItem>
          <MenuItem href='/pages/pricing' icon={<i className='ri-money-dollar-circle-line' />}>
            pricing
          </MenuItem>
          <SubMenu label='miscellaneous' icon={<i className='ri-file-info-line' />}>
            <MenuItem href='/pages/misc/coming-soon' target='_blank'>
              comingSoon
            </MenuItem>
            <MenuItem href='/pages/misc/under-maintenance' target='_blank'>
              underMaintenance
            </MenuItem>
            <MenuItem href='/pages/misc/404-not-found' target='_blank'>
              pageNotFound404
            </MenuItem>
            <MenuItem href='/pages/misc/401-not-authorized' target='_blank'>
              notAuthorized401
            </MenuItem>
          </SubMenu>
          <SubMenu label='authPages' icon={<i className='ri-shield-keyhole-line' />}>
            <SubMenu label='login'>
              <MenuItem href='/pages/auth/login-v1' target='_blank'>
                loginV1
              </MenuItem>
              <MenuItem href='/pages/auth/login-v2' target='_blank'>
                loginV2
              </MenuItem>
            </SubMenu>
            <SubMenu label='register'>
              <MenuItem href='/pages/auth/register-v1' target='_blank'>
                registerV1
              </MenuItem>
              <MenuItem href='/pages/auth/register-v2' target='_blank'>
                registerV2
              </MenuItem>
              <MenuItem href='/pages/auth/register-multi-steps' target='_blank'>
                registerMultiSteps
              </MenuItem>
            </SubMenu>
            <SubMenu label='verifyEmail'>
              <MenuItem href='/pages/auth/verify-email-v1' target='_blank'>
                verifyEmailV1
              </MenuItem>
              <MenuItem href='/pages/auth/verify-email-v2' target='_blank'>
                verifyEmailV2
              </MenuItem>
            </SubMenu>
            <SubMenu label='forgotPassword'>
              <MenuItem href='/pages/auth/forgot-password-v1' target='_blank'>
                forgotPasswordV1
              </MenuItem>
              <MenuItem href='/pages/auth/forgot-password-v2' target='_blank'>
                forgotPasswordV2
              </MenuItem>
            </SubMenu>
            <SubMenu label='resetPassword'>
              <MenuItem href='/pages/auth/reset-password-v1' target='_blank'>
                resetPasswordV1
              </MenuItem>
              <MenuItem href='/pages/auth/reset-password-v2' target='_blank'>
                resetPasswordV2
              </MenuItem>
            </SubMenu>
            <SubMenu label='twoSteps'>
              <MenuItem href='/pages/auth/two-steps-v1' target='_blank'>
                twoStepsV1
              </MenuItem>
              <MenuItem href='/pages/auth/two-steps-v2' target='_blank'>
                twoStepsV2
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu label='wizardExamples' icon={<i className='ri-git-commit-line' />}>
            <MenuItem href='/pages/wizard-examples/checkout'>checkout</MenuItem>
            <MenuItem href='/pages/wizard-examples/property-listing'>propertyListing</MenuItem>
            <MenuItem href='/pages/wizard-examples/create-deal'>createDeal</MenuItem>
          </SubMenu>
          <MenuItem href='/pages/dialog-examples' icon={<i className='ri-tv-2-line' />}>
            dialogExamples
          </MenuItem>
          <SubMenu label='widgetExamples' icon={<i className='ri-bar-chart-box-line' />}>
            <MenuItem href='/pages/widget-examples/basic'>basic</MenuItem>
            <MenuItem href='/pages/widget-examples/advanced'>advanced</MenuItem>
            <MenuItem href='/pages/widget-examples/statistics'>statistics</MenuItem>
            <MenuItem href='/pages/widget-examples/charts'>charts</MenuItem>
            <MenuItem href='/pages/widget-examples/gamification'>gamification</MenuItem>
            <MenuItem href='/pages/widget-examples/actions'>actions</MenuItem>
          </SubMenu>
          <SubMenu label='frontPages' icon={<i className='ri-file-copy-line' />}>
            <MenuItem href='/front-pages/landing-page' target='_blank'>
              landing
            </MenuItem>
            <MenuItem href='/front-pages/pricing' target='_blank'>
              pricing
            </MenuItem>
            <MenuItem href='/front-pages/payment' target='_blank'>
              payment
            </MenuItem>
            <MenuItem href='/front-pages/checkout' target='_blank'>
              checkout
            </MenuItem>
            <MenuItem href='/front-pages/help-center' target='_blank'>
              helpCenter
            </MenuItem>
          </SubMenu>
        </SubMenu>
        <SubMenu label='formsAndTables' icon={<i className='ri-pages-line' />}>
          <MenuItem href='/forms/form-layouts' icon={<i className='ri-layout-4-line' />}>
            formLayouts
          </MenuItem>
          <MenuItem href='/forms/form-validation' icon={<i className='ri-checkbox-multiple-line' />}>
            formValidation
          </MenuItem>
          <MenuItem href='/forms/form-wizard' icon={<i className='ri-git-commit-line' />}>
            formWizard
          </MenuItem>
          <MenuItem href='/react-table' icon={<i className='ri-table-alt-line' />}>
            reactTable
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-radio-button-line' />}
          >
            formELements
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/mui-table`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-table-2' />}
          >
            muiTables
          </MenuItem>
        </SubMenu>
        <SubMenu label='charts' icon={<i className='ri-bar-chart-2-line' />}>
          <MenuItem href='/charts/apex-charts' icon={<i className='ri-line-chart-line' />}>
            apex
          </MenuItem>
          <MenuItem href='/charts/recharts' icon={<i className='ri-bar-chart-line' />}>
            recharts
          </MenuItem>
        </SubMenu>
        <SubMenu label='others' icon={<i className='ri-more-line' />}>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/foundation`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-pantone-line' />}
          >
            foundation
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-toggle-line' />}
          >
            components
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/menu-examples/overview`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-menu-search-line' />}
          >
            menuExamples
          </MenuItem>
          <MenuItem
            href='https://themeselection.com/support'
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-lifebuoy-line' />}
          >
            raiseSupport
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-book-line' />}
          >
            documentation
          </MenuItem>
          <MenuItem
            suffix={<Chip label='New' size='small' color='info' />}
            icon={<i className='ri-notification-badge-line' />}
          >
            itemWithBadge
          </MenuItem>
          <MenuItem
            href='https://mui.com/store/contributors/themeselection'
            target='_blank'
            suffix={<i className='ri-external-link-line text-xl' />}
            icon={<i className='ri-link' />}
          >
            externalLink
          </MenuItem>
          <SubMenu label='menuLevels' icon={<i className='ri-menu-2-line' />}>
            <MenuItem>menuLevel2</MenuItem>
            <SubMenu label='menuLevel2'>
              <MenuItem>menuLevel3</MenuItem>
              <MenuItem>menuLevel3</MenuItem>
            </SubMenu>
          </SubMenu>
          <MenuItem disabled>disabledMenu</MenuItem>
        </SubMenu>
      </Menu>

      {/* <Menu
          rootStyles={menuRootStyles(theme)}
          renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
          renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
          menuItemStyles={menuItemStyles(theme, 'ri-circle-line')}
          popoutMenuOffset={{
            mainAxis: ({ level }) => (level && level > 0 ? 4 : 16),
            alignmentAxis: 0
          }}
          verticalMenuProps={{
            menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
            renderExpandIcon: ({ open }) => (
              <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
            ),
            renderExpandedMenuItemIcon: { icon: <i className='ri-circle-line' /> },
            menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme)
          }}
        >
          <GenerateHorizontalMenu menuData={menuData(dictionary)} />
        </Menu> */}
    </HorizontalNav>
  )
}

export default HorizontalMenu
