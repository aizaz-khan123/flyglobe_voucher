// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'
// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}


      <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >

        <SubMenu
          label={dictionary['navigation'].dashboards}
          icon={<i className='ri-home-smile-line' />}
        // suffix={<Chip label='5' size='small' color='error' />}
        >
          <MenuItem href={`/${locale}/dashboards/crm`}>{dictionary['navigation'].crm}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/logistics`}>{dictionary['navigation'].logistics}</MenuItem>
        </SubMenu>



        <MenuSection label={dictionary['navigation'].appsPages}>
          <MenuItem
            href={`/${locale}/apps/flight`}
            exactMatch={false}
            activeUrl='/apps/flight'
            icon={<i className='ri-mail-open-line' />}
          >
            {dictionary['navigation'].flight}
          </MenuItem>
          <MenuItem
            href={`/${locale}/apps/import-pnr`}
            exactMatch={false}
            activeUrl='/apps/import-pnr'
            icon={<i className='ri-import-line' />}
          >
            {dictionary['navigation'].importPnr}
          </MenuItem>
          <MenuItem
            href={`/${locale}/apps/bookings`}
            exactMatch={false}
            activeUrl='/apps/bookings'
            icon={<i class="ri-calendar-line"></i>}
          >
            {dictionary['navigation'].bookings}
          </MenuItem>
          <MenuItem
            href={`/${locale}/apps/refund-request`}
            exactMatch={false}
            activeUrl='/apps/refund-request'
            icon={<i class="ri-calendar-line"></i>}
          >
            {dictionary['navigation'].refundRequest}
          </MenuItem>

          <SubMenu label={dictionary['navigation'].organization} icon={<i class="ri-organization-chart"></i>}>
            <MenuItem href={`/${locale}/apps/organization/branches`}>{dictionary['navigation'].branches}</MenuItem>
            <MenuItem href={`/${locale}/apps/organization/agencies`}>{dictionary['navigation'].agencies}</MenuItem>
            <MenuItem href={`/${locale}/apps/organization/employees`}>{dictionary['navigation'].employees}</MenuItem>
          </SubMenu>

          <SubMenu label={dictionary['navigation'].accounts} icon={<i class="ri-calculator-line"></i>}>
            <MenuItem href={`/${locale}/apps/accounts/chart-of-account`}>{dictionary['navigation'].chartOfAccount}</MenuItem>
            <MenuItem href={`/${locale}/apps/accounts/general-legder`}>{dictionary['navigation'].generalLegder}</MenuItem>
            <MenuItem href={`/${locale}/apps/accounts/journal-entries`}>{dictionary['navigation'].journalEntries}</MenuItem>
            <MenuItem href={`/${locale}/apps/accounts/account-statement`}>{dictionary['navigation'].accountStatement}</MenuItem>
            <MenuItem href={`/${locale}/apps/accounts/trail-balance`}>{dictionary['navigation'].trailBalance}</MenuItem>
          </SubMenu>

          <SubMenu label={dictionary['navigation'].deposites} icon={<i class="ri-luggage-deposit-line"></i>}>
            <MenuItem href={`/${locale}/apps/deposites/agency-deposite`}>{dictionary['navigation'].agencyDeposite}</MenuItem>
            <MenuItem href={`/${locale}/apps/deposites/branch-deposite`}>{dictionary['navigation'].branchDeposite}</MenuItem>
          </SubMenu>

          <SubMenu label={dictionary['navigation'].reports} icon={<i class="ri-file-chart-line"></i>}>
            <MenuItem href={`/${locale}/apps/reports/sales-reports`}>{dictionary['navigation'].salesReports}</MenuItem>
            <MenuItem href={`/${locale}/apps/reports/refund-reports`}>{dictionary['navigation'].refundReports}</MenuItem>
            <MenuItem href={`/${locale}/apps/reports/supplier-reports`}>{dictionary['navigation'].supplierReports}</MenuItem>
            <MenuItem href={`/${locale}/apps/reports/un-used-tickets`}>{dictionary['navigation'].unUsedTickets}</MenuItem>
          </SubMenu>

          <SubMenu label={dictionary['navigation'].settings} icon={<i class="ri-file-settings-line"></i>}>
            <MenuItem href={`/${locale}/apps/settings/bank-accounts`}>{dictionary['navigation'].bankAccounts}</MenuItem>
            <MenuItem href={`/${locale}/apps/settings/airline-margins`}>{dictionary['navigation'].airlineMargins}</MenuItem>
            <MenuItem href={`/${locale}/apps/settings/connectors`}>{dictionary['navigation'].connectors}</MenuItem>
            <MenuItem href={`/${locale}/apps/settings/suppliers`}>{dictionary['navigation'].suppliers}</MenuItem>

            <MenuItem href={`/${locale}/apps/settings/airlines`}>{dictionary['navigation'].airlines}</MenuItem>
            <MenuItem href={`/${locale}/apps/settings/airpots`}>{dictionary['navigation'].airpots}</MenuItem>
            <MenuItem href={`/${locale}/apps/settings/countries`}>{dictionary['navigation'].countries}</MenuItem>
            <MenuItem href={`/${locale}/apps/settings/news-alerts`}>{dictionary['navigation'].newsAlerts}</MenuItem>
          </SubMenu>
          <MenuItem
            href={`/${locale}/apps/notifications`}
            exactMatch={false}
            activeUrl='/apps/notifications'
            icon={<i class="ri-calendar-line"></i>}
          >
            {dictionary['navigation'].notifications}
          </MenuItem>

          {/* <SubMenu label={dictionary['navigation'].eCommerce} icon={<i className='ri-shopping-bag-3-line' />}>
            <MenuItem href={`/${locale}/apps/ecommerce/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
            <SubMenu label={dictionary['navigation'].products}>
              <MenuItem href={`/${locale}/apps/ecommerce/products/list`}>{dictionary['navigation'].list}</MenuItem>
              <MenuItem href={`/${locale}/apps/ecommerce/products/add`}>{dictionary['navigation'].add}</MenuItem>
              <MenuItem href={`/${locale}/apps/ecommerce/products/category`}>
                {dictionary['navigation'].category}
              </MenuItem>
            </SubMenu>
            <SubMenu label={dictionary['navigation'].orders}>
              <MenuItem href={`/${locale}/apps/ecommerce/orders/list`}>{dictionary['navigation'].list}</MenuItem>
              <MenuItem
                href={`/${locale}/apps/ecommerce/orders/details/5434`}
                exactMatch={false}
                activeUrl='/apps/ecommerce/orders/details'
              >
                {dictionary['navigation'].details}
              </MenuItem>
            </SubMenu>
            <MenuItem href={`/${locale}/apps/ecommerce/settings`}>{dictionary['navigation'].settings}</MenuItem>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].logistics} icon={<i className='ri-car-line' />}>
            <MenuItem href={`/${locale}/apps/logistics/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
            <MenuItem href={`/${locale}/apps/logistics/fleet`}>{dictionary['navigation'].fleet}</MenuItem>
          </SubMenu> */}
        </MenuSection>

      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
