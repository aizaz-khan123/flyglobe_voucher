'use client'

import { useEffect, useMemo, useState } from 'react'

import { useParams } from 'next/navigation'

import Image from 'next/image'

import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useForm } from 'react-hook-form'

// MUI Imports
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Popover,
  TablePagination,
  TextField
} from '@mui/material'
import { FaDownload } from 'react-icons/fa6'
import { MdExpandMore } from 'react-icons/md'

// Component Imports
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'

import tableStyles from '@core/styles/table.module.css'

import DateTimeComp from '@/components/date/DateTimeComp'
import Link from '@/components/Link'
import MuiDatePicker from '@/components/mui-form-inputs/MuiDatePicker'
import MuiFlightSearchAutoComplete from '@/components/mui-form-inputs/MuiFlightSearchAutoComplete'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { useBookingListQuery } from '@/redux-store/services/api'
import StatusWidget from './StatusWidget'

const BookingTable = ({ hidePagination }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Filters state
  const [filters, setFilters] = useState({
    booking_id: '',
    pnr: '',
    email: '',
    status: '',
    from: '',
    to: ''
  })

  // RTK Query
  const {
    data: detail_data,
    refetch,
    isFetching
  } = useBookingListQuery({
    page: page + 1,
    pageSize: rowsPerPage,
    searchText: globalFilter,
    ...filters
  })

  const bookings = detail_data?.data || []
  const totalCount = detail_data?.total || 0

  // Form control
  const { control, handleSubmit, reset } = useForm({
    defaultValues: filters
  })

  // Status options
  const orderStatuses = [
    { value: 'expired', label: 'Expired' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'issued', label: 'Issued' },
    { value: 'voided', label: 'Voided' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
      itemRank
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
  }

  // Column Definitions
  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      columnHelper.accessor('booking_id', {
        header: 'Booking ID',
        cell: ({ row }) => (
          <Link href={`/bookings/${row.original.booking_id}`} className='font-medium text-primary'>
            {row.original.booking_id}
          </Link>
        )
      }),
      columnHelper.accessor('booking_pnr', {
        header: 'PNR',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            <div className='font-medium'>{row.original.booking_pnr}</div>
          </div>
        )
      }),
      columnHelper.accessor('airline', {
        header: 'Airline',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3'>
            <Image
              src={row.original.airline?.thumbnail}
              height={30}
              width={30}
              className='size-10 rounded-box object-contain'
              alt='Airline'
            />
            <div className='font-medium'>{row.original.airline?.iata_code}</div>
          </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Booking Status',
        cell: ({ row }) => <StatusWidget status={row.original.status} />
      }),
      columnHelper.accessor('created_at', {
        header: 'Booking Date',
        cell: ({ row }) => <DateTimeComp formattedDate={row.original.created_at} />
      }),
      columnHelper.accessor('departure_date_time', {
        header: 'Travel Date',
        cell: ({ row }) => <DateTimeComp formattedDate={row.original.departure_date_time} />
      }),
      columnHelper.accessor('provider_name', {
        header: 'Connector',
        cell: ({ row }) => row.original.provider_name
      }),
      columnHelper.accessor('organization', {
        header: 'Branch',
        cell: ({ row }) => row.original.organization?.name
      }),
      columnHelper.accessor('booked_by_user', {
        header: 'Agent',
        cell: ({ row }) => row.original.booked_by_user?.name
      }),
      columnHelper.accessor('is_refundable', {
        header: 'Refundable',
        cell: ({ row }) =>
          row.original.is_refundable === 1 ? (
            <span className='text-success'>YES</span>
          ) : (
            <span className='text-red-700'>NO</span>
          )
      }),
      columnHelper.accessor('passengers', {
        header: 'Travelers',
        cell: ({ row }) => (
          <div className='cursor-pointer'>
            <PopupState variant='popover' popupId='demo-popup-popover'>
              {popupState => (
                <div>
                  <div {...bindTrigger(popupState)} className='flex items-center gap-2'>
                    <span>{row.original.passengers?.length}</span> <span>Travelers</span> <MdExpandMore fontSize={20} />
                  </div>
                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center'
                    }}
                  >
                    {row.original.passengers?.map((passenger, index) => (
                      <div key={index} className='hover:bg-gray-100 focus:bg-gray-100 active:bg-transparent p-5 border'>
                        <span>
                          {passenger?.title} {passenger?.first_name} {passenger?.last_name}
                        </span>
                      </div>
                    ))}
                  </Popover>
                </div>
              )}
            </PopupState>
          </div>
        )
      }),
      {
        id: 'actions',
        header: 'Action',
        cell: () => (
          <Button variant='contained'>
            <FaDownload />
          </Button>
        )
      }
    ],
    [columnHelper]
  )

  const table = useReactTable({
    data: bookings,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / rowsPerPage),
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const applyFilters = data => {
    setFilters({
      booking_id: data.booking_id || '',
      pnr: data.pnr || '',
      email: data.email || '',
      status: data.status || '',
      from: data.from ? new Date(data.from).toISOString().split('T')[0] : '',
      to: data.to ? new Date(data.to).toISOString().split('T')[0] : ''
    })
  }

  const clearFilters = () => {
    reset()
    setFilters({
      booking_id: '',
      pnr: '',
      email: '',
      status: '',
      from: '',
      to: ''
    })
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    // States
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
  }

  return (
    <Card>
      <CardContent className='p-0'>
        <div className='flex items-center justify-between px-5 pt-5'>
          {!hidePagination && (
            <Accordion className='w-full'>
              <AccordionSummary expandIcon={<MdExpandMore />}>
                <p className='font-bold text-xl'>Filters</p>
              </AccordionSummary>
              <AccordionDetails>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
                  <MuiTextField control={control} name='booking_id' placeholder='Enter Booking ID' />
                  <MuiTextField control={control} name='pnr' placeholder='Enter PNR' />
                  <MuiTextField control={control} name='email' placeholder='Enter Email' />
                  <MuiFlightSearchAutoComplete
                    control={control}
                    name='status'
                    label='Status'
                    placeholder='Select Order Status'
                    options={orderStatuses}
                    onInputChange={(_, newValue) => setStatus(newValue)}
                    inputValue={status}
                    setInputValue={setStatus}
                  />
                  <MuiDatePicker control={control} name='from' label='Booking From' />
                  <MuiDatePicker control={control} name='to' label='Booking to' />
                  <div className='flex gap-1 items-center'>
                    <Button variant='contained' onClick={handleSubmit(applyFilters)}>
                      Search
                    </Button>
                    <Button variant='contained' onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          )}
        </div>

        <div className='px-5 mt-8'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search bookings...'
            className='w-full max-w-md'
          />
        </div>

        <div className='overflow-x-auto p-5'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className='text-left p-3 border-b'>
                      {header.isPlaceholder ? null : (
                        <div
                          className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽'
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className='hover:bg-gray-50'>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className='p-3 border-b'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className='p-5 text-center text-gray-500'>
                    No record found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component='div'
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </CardContent>
    </Card>
  )
}

export default BookingTable
