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

        <MenuSection label='Sales'>
          <SubMenu label='Sell' icon={<i className='ri-organization-chart'></i>}>
            <MenuItem href='/book-flights' icon={<i className='ri-plane-fill'></i>}>
              Flight
            </MenuItem>
            <MenuItem href='/group-flights' icon={<MdGroup />}>
              Group Flight
            </MenuItem>
            <MenuItem href='/umrah-hotels' icon={<RiHotelLine />}>
              Umrah Hotels
            </MenuItem>
            <MenuItem href='/umrah-visa'>Umrah Visa</MenuItem>
            <MenuItem href='/bookings'>Bookings</MenuItem>
          </SubMenu>

          <SubMenu label='Requests' icon={<i className='ri-organization-chart'></i>}>
            <MenuItem
              href='/refund-request'
              exactMatch={false}
              activeUrl='/refund-request'
              icon={<i className='ri-calendar-line'></i>}
            >
              Refund Request
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

          <SubMenu label='Organization' icon={<i className='ri-group-line'></i>}>
            <MenuItem href='/organization/branches' icon={<i className='ri-organization-chart'></i>}>
              Branches
            </MenuItem>
            <MenuItem href='/organization/agencies'>Agencies</MenuItem>
            <MenuItem href='/organization/employees' icon={<MdGroup />}>
              Employees
            </MenuItem>
          </SubMenu>

          <SubMenu label='Accounts' icon={<i className='ri-calculator-line'></i>}>
            <MenuItem href='/accounts/chart-of-account' icon={<FaChartBar />}>
              Chart of Account
            </MenuItem>
            <MenuItem href='/accounts/general-legder' icon={<LuNotebookPen />}>
              General Legder
            </MenuItem>
            <MenuItem href='/accounts/journal-entries' icon={<FaRegPenToSquare />}>
              Journal Entries
            </MenuItem>
            <MenuItem href='/accounts/account-statement'>Account Statement</MenuItem>
            <MenuItem href='/accounts/trail-balance' icon={<FaMoneyCheckAlt />}>
              Trail Balance
            </MenuItem>
          </SubMenu>

          <SubMenu label='Deposites' icon={<i className='ri-luggage-deposit-line'></i>}>
            <MenuItem href='/deposites/agency-deposite' icon={<PiHandDeposit />}>
              Agency Deposite
            </MenuItem>
            {/* <MenuItem href='/deposites/branch-deposite' icon={<PiHandDeposit />}>
              branchDeposite
            </MenuItem> */}
            <MenuItem href='/deposites/my-deposite'>My Deposite</MenuItem>
            <MenuItem href='/deposites/bank-accounts'>Bank Deposite</MenuItem>
          </SubMenu>

          <SubMenu label='Reports' icon={<i className='ri-file-chart-fill'></i>}>
            <MenuItem href='/reports/sales-reports'>Sales Reports</MenuItem>
            <MenuItem href='/reports/refund-reports'>Refund Reports</MenuItem>
            <MenuItem href='/reports/supplier-reports'>Supplier Reports</MenuItem>
            {/* <MenuItem href='/reports/un-used-tickets'>
              unUsedTickets
            </MenuItem> */}
          </SubMenu>

          <SubMenu label='Settings' icon={<i className='ri-settings-2-line'></i>}>
            <MenuItem href='/settings/bank-accounts'>Bank Accounts</MenuItem>
            <MenuItem href='/settings/airline-margins'>Airline Margins</MenuItem>
            <MenuItem href='/settings/connectors'>Connectors</MenuItem>
            <MenuItem href='/settings/suppliers'>Suppliers</MenuItem>

            <MenuItem href='/settings/airlines'>Airlines</MenuItem>
            <MenuItem href='/settings/airpots'>Airpots</MenuItem>
            <MenuItem href='/settings/countries'>Countries</MenuItem>
            <MenuItem href='/settings/news-alerts'>News Alerts</MenuItem>
          </SubMenu>
          <SubMenu label='Management' icon={<i className='ri-luggage-deposit-line'></i>}>
            <MenuItem href='/management/groups'>Groups</MenuItem>
          </SubMenu>

          <MenuItem
            href='/notifications'
            exactMatch={false}
            activeUrl='/notifications'
            icon={<i className='ri-calendar-line'></i>}
          >
            Notifications
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
