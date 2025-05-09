'use client'

// Third-party Imports
import { usePathname, useRouter } from 'next/navigation'

import classnames from 'classnames'

import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { Button, TextField, Typography } from '@mui/material'

import NavToggle from './NavToggle'
import { useState } from 'react'
import { useSearchBookingMutation } from '@/redux-store/services/api'
import { toast } from 'react-toastify'

// Vars
const shortcuts = [
  {
    url: '/calendar',
    icon: 'ri-calendar-line',
    title: 'Calendar',
    subtitle: 'Appointments'
  },
  {
    url: '/invoice/list',
    icon: 'ri-file-list-3-line',
    title: 'Invoice App',
    subtitle: 'Manage Accounts'
  },
  {
    url: '/user/list',
    icon: 'ri-user-3-line',
    title: 'Users',
    subtitle: 'Manage Users'
  },
  {
    url: '/roles',
    icon: 'ri-computer-line',
    title: 'Role Management',
    subtitle: 'Permissions'
  },
  {
    url: '/dashboards/crm',
    icon: 'ri-pie-chart-2-line',
    title: 'Dashboard',
    subtitle: 'User Dashboard'
  },
  {
    url: '/pages/account-settings',
    icon: 'ri-settings-4-line',
    title: 'Settings',
    subtitle: 'Account Settings'
  }
]

const notifications = [
  {
    avatarImage: '/images/avatars/2.png',
    title: 'Congratulations Flora 🎉',
    subtitle: 'Won the monthly bestseller gold badge',
    time: '1h ago',
    read: false
  },
  {
    title: 'Cecilia Becker',
    subtitle: 'Accepted your connection',
    time: '12h ago',
    read: false
  },
  {
    avatarImage: '/images/avatars/3.png',
    title: 'Bernard Woods',
    subtitle: 'You have new message from Bernard Woods',
    time: 'May 18, 8:26 AM',
    read: true
  },
  {
    avatarIcon: 'ri-bar-chart-line',
    avatarColor: 'info',
    title: 'Monthly report generated',
    subtitle: 'July month financial report is generated',
    time: 'Apr 24, 10:30 AM',
    read: true
  },
  {
    avatarText: 'MG',
    avatarColor: 'success',
    title: 'Application has been approved 🚀',
    subtitle: 'Your Meta Gadgets project application has been approved.',
    time: 'Feb 17, 12:17 PM',
    read: true
  },
  {
    avatarIcon: 'ri-mail-line',
    avatarColor: 'error',
    title: 'New message from Harry',
    subtitle: 'You have new message from Harry',
    time: 'Jan 6, 1:48 PM',
    read: true
  }
]

const NavbarContent = () => {
  const pathname = usePathname()

  const getLastSegment = () => {
    const pathSegments = pathname.split('/').filter(seg => seg && seg !== '')
    const lastSegment = pathSegments[pathSegments.length - 1] || ''
    const label = lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    return label
  }
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBooking, { isLoading }] = useSearchBookingMutation();
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await searchBooking({ search: encodeURIComponent(searchQuery) }).then((response) => {
      if ('error' in response) {
        toast.error('Booking Not found');
        return;
      }
      router.push(`/bookings/${response?.data}`);
    })
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-[7px]'>
        <NavToggle />
        {/* <NavSearch /> */}
        <Typography variant='h5'>{getLastSegment()}</Typography>
      </div>
      <div className='flex justify-center gap-2'>
        <TextField
          placeholder='PNR or Ticket Number'
          size='small'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown} />
        <Button size='small' variant='contained' className='bg-primary'
          onClick={handleSearch} loading={isLoading} disabled={isLoading}>
          Search
        </Button>
      </div>
      <div className='flex items-center'>
        {/* */}
        {/* <ModeDropdown /> */}
        {/* <ShortcutsDropdown shortcuts={shortcuts} /> */}
        {/* <NotificationsDropdown notifications={notifications} /> */}
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
