'use client'

import { useEffect, useMemo, useState } from 'react'


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

import MuiAutocomplete from '@/components/mui-form-inputs/MuiAutoComplete'
import MuiDatePicker from '@/components/mui-form-inputs/MuiDatePicker'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { useBookingListQuery } from '@/redux-store/services/api'
import tableStyles from '@core/styles/table.module.css'
import classNames from 'classnames'
import StatusWidget from '../../bookings/StatusWidget'
import GroupTypeModal from './GroupTypeModal'

const GroupTypeList = () => {
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [showGroupTypeModal, setShowGroupTypeModal] = useState(false)

    const groupTypeModalHandler = () => {
        setShowGroupTypeModal((prev) => !prev);
    };

    // RTK Query
    const {
        data: detail_data,
        refetch,
        isFetching
    } = useBookingListQuery({
        page: page + 1,
        pageSize: rowsPerPage,
        searchText: globalFilter,
    })

    const bookings = detail_data?.data || []
    const totalCount = detail_data?.total || 0


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
            columnHelper.accessor('group_type', {
                header: 'PNR',
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
            <GroupTypeModal open={showGroupTypeModal} onClose={() => setShowGroupTypeModal(false)} />

            <Card>
                <CardContent className='p-0'>
                    <div className='px-5 mt-8 flex justify-between w-full'>
                        <DebouncedInput
                            value={globalFilter ?? ''}
                            onChange={value => setGlobalFilter(String(value))}
                            placeholder='Search bookings...'
                            className='w-full max-w-md'
                        />
                        <div className='inline-flex items-center gap-3'>
                            <Button onClick={groupTypeModalHandler} variant='contained' className='hidden md:flex gap-2'>
                                <FaPlus fontSize={16} />
                                <span>Groups Type</span>
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

export default GroupTypeList
