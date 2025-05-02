// MUI Imports
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
import { MdGroup } from 'react-icons/md'
import { RiHotelLine } from 'react-icons/ri'
import { FaChartBar, FaRegPenToSquare } from 'react-icons/fa6'
import { LuNotebookPen } from 'react-icons/lu'
import { FaMoneyCheckAlt } from 'react-icons/fa'
import { PiHandDeposit } from 'react-icons/pi'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

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
          href='/dashboard'
          exactMatch={false}
          activeUrl='/dashboard'
          icon={<i className='ri-home-smile-line' />}
        >
          dashboard
        </MenuItem>

        <MenuSection label='sales'>
          <SubMenu label='Sell' icon={<i className='ri-organization-chart'></i>}>
            <MenuItem href='/book-flights' icon={<i className='ri-plane-fill'></i>}>
              flight
            </MenuItem>
            <MenuItem href='/group-flights' icon={<MdGroup />}>
              groupFlight
            </MenuItem>
            <MenuItem href='/umrah-hotels' icon={<RiHotelLine />}>
              umrahHotels
            </MenuItem>
            <MenuItem href='/umrah-visa'>umrahVisa</MenuItem>
            <MenuItem href='/bookings'>bookings</MenuItem>
          </SubMenu>

          <SubMenu label='Requests' icon={<i className='ri-organization-chart'></i>}>
            <MenuItem
              href='/refund-request'
              exactMatch={false}
              activeUrl='/refund-request'
              icon={<i className='ri-calendar-line'></i>}
            >
              refundRequest
            </MenuItem>
          </SubMenu>
          {/* For Agencies */}
          {/* <MenuItem
            href='/my-refund-request'
            exactMatch={false}
            activeUrl='/my-refund-request'
            icon={<i className='ri-calendar-line'></i>}
          >
            myRefundRequest
          </MenuItem> */}

          <SubMenu label='organization' icon={<i className='ri-group-line'></i>}>
            <MenuItem href='/organization/branches' icon={<i className='ri-organization-chart'></i>}>
              branches
            </MenuItem>
            <MenuItem href='/organization/agencies'>agencies</MenuItem>
            <MenuItem href='/organization/employees' icon={<MdGroup />}>
              employees
            </MenuItem>
          </SubMenu>

          <SubMenu label='accounts' icon={<i className='ri-calculator-line'></i>}>
            <MenuItem href='/accounts/chart-of-account' icon={<FaChartBar />}>
              chartOfAccount
            </MenuItem>
            <MenuItem href='/accounts/general-legder' icon={<LuNotebookPen />}>
              generalLegder
            </MenuItem>
            <MenuItem href='/accounts/journal-entries' icon={<FaRegPenToSquare />}>
              journalEntries
            </MenuItem>
            <MenuItem href='/accounts/account-statement'>accountStatement</MenuItem>
            <MenuItem href='/accounts/trail-balance' icon={<FaMoneyCheckAlt />}>
              trailBalance
            </MenuItem>
          </SubMenu>

          <SubMenu label='deposites' icon={<i className='ri-luggage-deposit-line'></i>}>
            <MenuItem href='/deposites/agency-deposite' icon={<PiHandDeposit />}>
              agencyDeposite
            </MenuItem>
            {/* <MenuItem href='/deposites/branch-deposite' icon={<PiHandDeposit />}>
              branchDeposite
            </MenuItem> */}
            <MenuItem href='/deposites/my-deposite'>myDeposite</MenuItem>
            <MenuItem href='/deposites/bank-accounts'>bankDeposite</MenuItem>
          </SubMenu>

          <SubMenu label='reports' icon={<i className='ri-file-chart-fill'></i>}>
            <MenuItem href='/reports/sales-reports'>salesReports</MenuItem>
            <MenuItem href='/reports/refund-reports'>refundReports</MenuItem>
            <MenuItem href='/reports/supplier-reports'>supplierReports</MenuItem>
            {/* <MenuItem href='/reports/un-used-tickets'>
              unUsedTickets
            </MenuItem> */}
          </SubMenu>

          <SubMenu label='settings' icon={<i className='ri-settings-2-line'></i>}>
            <MenuItem href='/settings/bank-accounts'>bankAccounts</MenuItem>
            <MenuItem href='/settings/airline-margins'>airlineMargins</MenuItem>
            <MenuItem href='/settings/connectors'>connectors</MenuItem>
            <MenuItem href='/settings/suppliers'>suppliers</MenuItem>

            <MenuItem href='/settings/airlines'>airlines</MenuItem>
            <MenuItem href='/settings/airpots'>airpots</MenuItem>
            <MenuItem href='/settings/countries'>countries</MenuItem>
            <MenuItem href='/settings/news-alerts'>newsAlerts</MenuItem>
          </SubMenu>
          <SubMenu label='management' icon={<i className='ri-luggage-deposit-line'></i>}>
            <MenuItem href='/management/groups'>groups</MenuItem>
          </SubMenu>

          <MenuItem
            href='/notifications'
            exactMatch={false}
            activeUrl='/notifications'
            icon={<i className='ri-calendar-line'></i>}
          >
            notifications
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
