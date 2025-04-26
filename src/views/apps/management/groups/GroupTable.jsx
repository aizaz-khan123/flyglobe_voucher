'use client'

import { useEffect, useMemo, useState } from 'react'

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
    TablePagination,
    TextField
} from '@mui/material'
import { FaDownload, FaPlus } from 'react-icons/fa6'
import { MdExpandMore } from 'react-icons/md'

// Component Imports

import Link from '@/components/Link'
import MuiAutocomplete from '@/components/mui-form-inputs/MuiAutoComplete'
import MuiDatePicker from '@/components/mui-form-inputs/MuiDatePicker'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { useBookingListQuery } from '@/redux-store/services/api'
import tableStyles from '@core/styles/table.module.css'
import classNames from 'classnames'
import StatusWidget from '../../bookings/StatusWidget'
import AddGroupModal from './AddGroupModal'

const GroupTable = () => {
    // States
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [showAddGroupModal, setShowAddGroupModal] = useState(false)
    const [showGroupTypeModal, setShowGroupTypeModal] = useState(false)
    const addGroupModalHandler = () => {
        setShowAddGroupModal((prev) => !prev);
    };
    const groupTypeModalHandler = () => {
        setShowGroupTypeModal((prev) => !prev);
    };
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
            columnHelper.accessor('booking_pnr', {
                header: 'PNR',
                cell: ({ row }) => (
                    <div className='flex items-center space-x-3 truncate'>
                        <div className='font-medium'>{row.original.booking_pnr}</div>
                    </div>
                )
            }),
            columnHelper.accessor('booking_id', {
                header: 'Sector',
                cell: ({ row }) => (
                    <Link href={`/bookings/${row.original.booking_id}`} className='font-medium text-primary'>
                        {row.original.booking_id}
                    </Link>
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
            columnHelper.accessor('booking_pnr', {
                header: 'Purchase Price',
                cell: ({ row }) => (
                    <div className='flex items-center space-x-3 truncate'>
                        <div className='font-medium'>{row.original.booking_pnr}</div>
                    </div>
                )
            }),
            columnHelper.accessor('booking_pnr', {
                header: 'Price',
                cell: ({ row }) => (
                    <div className='flex items-center space-x-3 truncate'>
                        <div className='font-medium'>{row.original.booking_pnr}</div>
                    </div>
                )
            }),
            columnHelper.accessor('booking_pnr', {
                header: 'ADT Price',
                cell: ({ row }) => (
                    <div className='flex items-center space-x-3 truncate'>
                        <div className='font-medium'>{row.original.booking_pnr}</div>
                    </div>
                )
            }),
            columnHelper.accessor('booking_pnr', {
                header: 'ADT Price Call',
                cell: ({ row }) => (
                    <div className='flex items-center space-x-3 truncate'>
                        <div className='font-medium'>{row.original.booking_pnr}</div>
                    </div>
                )
            }),
            columnHelper.accessor('booking_pnr', {
                header: 'CNN Price',
                cell: ({ row }) => (
                    <div className='flex items-center space-x-3 truncate'>
                        <div className='font-medium'>{row.original.booking_pnr}</div>
                    </div>
                )
            }),
            columnHelper.accessor('booking_pnr', {
                header: 'CNN Price Call',
                cell: ({ row }) => (
                    <div className='flex items-center space-x-3 truncate'>
                        <div className='font-medium'>{row.original.booking_pnr}</div>
                    </div>
                )
            }),
            columnHelper.accessor('booking_pnr', {
                header: 'Infant Price',
                cell: ({ row }) => (
                    <div className='flex items-center space-x-3 truncate'>
                        <div className='font-medium'>{row.original.booking_pnr}</div>
                    </div>
                )
            }),
            columnHelper.accessor('booking_pnr', {
                header: 'Infant Price Call',
                cell: ({ row }) => (
                    <div className='flex items-center space-x-3 truncate'>
                        <div className='font-medium'>{row.original.booking_pnr}</div>
                    </div>
                )
            }),
            columnHelper.accessor('booking_pnr', {
                header: 'Baggage',
                cell: ({ row }) => (
                    <div className='flex items-center space-x-3 truncate'>
                        <div className='font-medium'>{row.original.booking_pnr}</div>
                    </div>
                )
            }),
            columnHelper.accessor('booking_pnr', {
                header: 'Meal',
                cell: ({ row }) => (
                    <div className='flex items-center space-x-3 truncate'>
                        <div className='font-medium'>{row.original.booking_pnr}</div>
                    </div>
                )
            }),

            columnHelper.accessor('status', {
                header: 'Booking Status',
                cell: ({ row }) => <StatusWidget status={row.original.status} />
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
        <>
            <AddGroupModal open={showAddGroupModal} onClose={() => setShowAddGroupModal(false)} />
            <Card>
                <CardContent className='p-0'>
                    <div className='flex items-center justify-between px-5 pt-5'>
                        <Accordion className='w-full'>
                            <AccordionSummary expandIcon={<MdExpandMore />}>
                                <p className='font-bold text-xl'>Filters</p>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
                                    <MuiTextField control={control} name='booking_id' placeholder='Enter Booking ID' />
                                    <MuiTextField control={control} name='pnr' placeholder='Enter PNR' />
                                    <MuiTextField control={control} name='email' placeholder='Enter Email' />
                                    <MuiAutocomplete
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
                    </div>

                    <div className='px-5 mt-8 flex justify-between w-full'>
                        <DebouncedInput
                            value={globalFilter ?? ''}
                            onChange={value => setGlobalFilter(String(value))}
                            placeholder='Search bookings...'
                            className='w-full max-w-md'
                        />
                        <div className='inline-flex items-center gap-3'>
                            <Link href='group-type'>
                                <Button variant='contained' className='hidden md:flex'>
                                    <span>Groups Type</span>
                                </Button>
                            </Link>
                            <Button onClick={addGroupModalHandler} variant='contained' className='hidden md:flex'>
                                <FaPlus fontSize={16} />
                                <span>Add Groups Flights</span>
                            </Button>
                        </div>
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
                                                        className={classNames({
                                                            'flex items-center': header.column.getIsSorted(),
                                                            'cursor-pointer select-none': header.column.getCanSort()
                                                        })}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                        {{
                                                            asc: <i className='ri-arrow-up-s-line text-xl' />,
                                                            desc: <i className='ri-arrow-down-s-line text-xl' />
                                                        }[header.column.getIsSorted()] ?? null}
                                                    </div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className='hover:bg-gray-50'>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className='p-3 border-b'>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
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
        </>
    )
}

export default GroupTable
