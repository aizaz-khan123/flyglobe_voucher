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

      <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem
          href={`/${locale}/dashboard`}
          exactMatch={false}
          activeUrl='/dashboard'
          icon={<i className='ri-home-smile-line' />}
        >
          {dictionary['navigation'].dashboard}
        </MenuItem>

        <MenuSection label={dictionary['navigation'].sales}>

          <SubMenu label={dictionary['navigation'].Sell} icon={<i className='ri-organization-chart'></i>}>
            <MenuItem href={`/${locale}/book-flights`}>{dictionary['navigation'].flight}</MenuItem>
            <MenuItem href={`/${locale}/group-flights`}>{dictionary['navigation'].groupFlight}</MenuItem>
            <MenuItem href={`/${locale}/umrah-hotels`}>{dictionary['navigation'].umrahHotels}</MenuItem>
            <MenuItem href={`/${locale}/umrah-visa`}>{dictionary['navigation'].umrahVisa}</MenuItem>
            <MenuItem href={`/${locale}/bookings`}>{dictionary['navigation'].bookings}</MenuItem>
          </SubMenu>

          <SubMenu label={dictionary['navigation'].Requests} icon={<i className='ri-organization-chart'></i>}>
            <MenuItem
              href={`/${locale}/refund-request`}
              exactMatch={false}
              activeUrl='/refund-request'
              icon={<i className='ri-calendar-line'></i>}
            >
              {dictionary['navigation'].refundRequest}
            </MenuItem>
          </SubMenu>
          {/* For Agencies */}
          {/* <MenuItem
            href={`/${locale}/my-refund-request`}
            exactMatch={false}
            activeUrl='/my-refund-request'
            icon={<i className='ri-calendar-line'></i>}
          >
            {dictionary['navigation'].myRefundRequest}
          </MenuItem> */}




          <SubMenu label={dictionary['navigation'].organization} icon={<i class="ri-group-line"></i>}>
            <MenuItem href={`/${locale}/organization/branches`}>{dictionary['navigation'].branches}</MenuItem>
            <MenuItem href={`/${locale}/organization/agencies`}>{dictionary['navigation'].agencies}</MenuItem>
            <MenuItem href={`/${locale}/organization/employees`}>{dictionary['navigation'].employees}</MenuItem>
          </SubMenu>

          <SubMenu label={dictionary['navigation'].accounts} icon={<i className='ri-calculator-line'></i>}>
            <MenuItem href={`/${locale}/accounts/chart-of-account`}>
              {dictionary['navigation'].chartOfAccount}
            </MenuItem>
            <MenuItem href={`/${locale}/accounts/general-legder`}>
              {dictionary['navigation'].generalLegder}
            </MenuItem>
            <MenuItem href={`/${locale}/accounts/journal-entries`}>
              {dictionary['navigation'].journalEntries}
            </MenuItem>
            <MenuItem href={`/${locale}/accounts/account-statement`}>
              {dictionary['navigation'].accountStatement}
            </MenuItem>
            <MenuItem href={`/${locale}/accounts/trail-balance`}>{dictionary['navigation'].trailBalance}</MenuItem>
          </SubMenu>

          <SubMenu label={dictionary['navigation'].deposites} icon={<i className='ri-luggage-deposit-line'></i>}>
            <MenuItem href={`/${locale}/deposites/agency-deposite`}>
              {dictionary['navigation'].agencyDeposite}
            </MenuItem>
            <MenuItem href={`/${locale}/deposites/branch-deposite`}>
              {dictionary['navigation'].branchDeposite}
            </MenuItem>
          </SubMenu>

          <SubMenu label={dictionary['navigation'].reports} icon={<i class="ri-file-chart-fill"></i>}>
            <MenuItem href={`/${locale}/reports/sales-reports`}>{dictionary['navigation'].salesReports}</MenuItem>
            <MenuItem href={`/${locale}/reports/refund-reports`}>
              {dictionary['navigation'].refundReports}
            </MenuItem>
            <MenuItem href={`/${locale}/reports/supplier-reports`}>
              {dictionary['navigation'].supplierReports}
            </MenuItem>
            <MenuItem href={`/${locale}/reports/un-used-tickets`}>
              {dictionary['navigation'].unUsedTickets}
            </MenuItem>
          </SubMenu>

          <SubMenu label={dictionary['navigation'].settings} icon={<i class="ri-settings-2-line"></i>}>
            <MenuItem href={`/${locale}/settings/bank-accounts`}>{dictionary['navigation'].bankAccounts}</MenuItem>
            <MenuItem href={`/${locale}/settings/airline-margins`}>
              {dictionary['navigation'].airlineMargins}
            </MenuItem>
            <MenuItem href={`/${locale}/settings/connectors`}>{dictionary['navigation'].connectors}</MenuItem>
            <MenuItem href={`/${locale}/settings/suppliers`}>{dictionary['navigation'].suppliers}</MenuItem>

            <MenuItem href={`/${locale}/settings/airlines`}>{dictionary['navigation'].airlines}</MenuItem>
            <MenuItem href={`/${locale}/settings/airpots`}>{dictionary['navigation'].airpots}</MenuItem>
            <MenuItem href={`/${locale}/settings/countries`}>{dictionary['navigation'].countries}</MenuItem>
            <MenuItem href={`/${locale}/settings/news-alerts`}>{dictionary['navigation'].newsAlerts}</MenuItem>
          </SubMenu>


          <MenuItem
            href={`/${locale}/notifications`}
            exactMatch={false}
            activeUrl='/notifications'
            icon={<i className='ri-calendar-line'></i>}
          >
            {dictionary['navigation'].notifications}
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
