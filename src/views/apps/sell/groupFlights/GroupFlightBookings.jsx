'use client'
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EditableDataTables from '@/views/react-table/EditableDataTables';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import styles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper()

const columns = [
    columnHelper.accessor('Passenger', {
        header: 'Passenger'
    }),
    columnHelper.accessor('price', {
        header: 'Price'
    }),
]

const EditableCell = ({ getValue, row, column, table }) => {
    const initialValue = getValue()
    const [value, setValue] = useState(initialValue)

    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
    }

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return <input value={value} onChange={e => setValue(e.target.value)} onBlur={onBlur} />
}

const defaultColumn = {
    cell: ({ getValue, row, column, table }) => {
        return <EditableCell getValue={getValue} row={row} column={column} table={table} />
    }
}

const passengerColumnHelper = createColumnHelper()

const passengerColumns = [
    passengerColumnHelper.accessor('name', {
        header: 'Name',
        cell: ({ getValue, row, column, table }) => {
            return (
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={getValue() || ''}
                    onChange={(e) => table.options.meta?.updateData(row.index, column.id, e.target.value)}
                />
            )
        }
    }),
    passengerColumnHelper.accessor('email', {
        header: 'Email',
        cell: ({ getValue, row, column, table }) => {
            return (
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={getValue() || ''}
                    onChange={(e) => table.options.meta?.updateData(row.index, column.id, e.target.value)}
                />
            )
        }
    }),
    passengerColumnHelper.accessor('phone', {
        header: 'Phone',
        cell: ({ getValue, row, column, table }) => {
            return (
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={getValue() || ''}
                    onChange={(e) => table.options.meta?.updateData(row.index, column.id, e.target.value)}
                />
            )
        }
    }),
    passengerColumnHelper.accessor('passportExpiry', {
        header: 'Passport Expiry',
        cell: ({ getValue, row, column, table }) => {
            return (
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={getValue() || ''}
                    onChange={(e) => table.options.meta?.updateData(row.index, column.id, e.target.value)}
                />
                // <LocalizationProvider dateAdapter={AdapterDateFns}>
                //     <DatePicker
                //         value={getValue() || null}
                //         onChange={(newValue) => table.options.meta?.updateData(row.index, column.id, newValue)}
                //         renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                //     />
                // </LocalizationProvider>
            )
        }
    }),
    passengerColumnHelper.accessor('dob', {
        header: 'Date of Birth',
        cell: ({ getValue, row, column, table }) => {
            return (
                <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={getValue() || ''}
                onChange={(e) => table.options.meta?.updateData(row.index, column.id, e.target.value)}
            />
                // <LocalizationProvider dateAdapter={AdapterDateFns}>
                //     <DatePicker
                //         value={getValue() || null}
                //         onChange={(newValue) => table.options.meta?.updateData(row.index, column.id, newValue)}
                //         renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                //     />
                // </LocalizationProvider>
            )
        }
    }),
]

const GroupFlightBookings = () => {
    const defaultdata = [
        {
            id: 1,
            avatar: '8.png',
            fullName: "Korrie O'Crevy",
            post: 'Nuclear Power Engineer',
            email: 'kocrevy0@thetimes.co.uk',
            city: 'Krasnosilka',
            start_date: '09/23/2016',
            salary: 23896.35,
            age: 61,
            experience: '1 Year',
            status: 2
        },

    ]

    const passengerDefaultData = [
        {
            name: '',
            email: '',
            phone: '',
            passportExpiry: null,
            dob: null
        },
    ]

    const [data, setData] = useState(() => defaultdata)
    const [passengerData, setPassengerData] = useState(() => passengerDefaultData)

    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        filterFns: {
            fuzzy: () => false
        },
        meta: {
            updateData: (rowIndex, columnId, value) => {
                setData(old =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex],
                                [columnId]: value
                            }
                        }
                        return row
                    })
                )
            }
        }
    })

    const passengerTable = useReactTable({
        data: passengerData,
        columns: passengerColumns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (rowIndex, columnId, value) => {
                setPassengerData(old =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex],
                                [columnId]: value
                            }
                        }
                        return row
                    })
                )
            }
        }
    })

    return (
        <>
            <Card>
                <CardContent>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 3fr)',
                        gap: 2
                    }}>
                        <Typography variant="h5">
                            Fly3mach
                        </Typography>

                        <div>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                Sector Information
                            </Typography>
                            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                                9P 764  06 May  150-BAN  19:35 21:15  20407-KG Baggage
                            </Typography>
                        </div>

                        <div>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Dep Date</Typography>
                            <Typography variant="body2">6 May 2025</Typography>
                        </div>

                        <div>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Medi</Typography>
                            <Typography variant="body2">No</Typography>
                        </div>

                        <div>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Adult Price</Typography>
                            <Typography variant="body2">PKS 98,000</Typography>
                        </div>

                        <div>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Child</Typography>
                            <Typography variant="body2">97%</Typography>
                        </div>

                        <div>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Infant</Typography>
                            <Typography variant="body2">Price On Car</Typography>
                        </div>
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <div className='overflow-x-auto'>
                    <table className={styles.table}>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table
                                .getRowModel()
                                .rows.slice(0, 10)
                                .map(row => {
                                    return (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map(cell => {
                                                return (
                                                    <td key={cell.id} className={styles.cellWithInput}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card>
                <CardHeader title="Passenger Details" />
                <div className='overflow-x-auto'>
                    <table className={styles.table}>
                        <thead>
                            {passengerTable.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {passengerTable
                                .getRowModel()
                                .rows.slice(0, 10)
                                .map(row => {
                                    return (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map(cell => {
                                                return (
                                                    <td key={cell.id} className={styles.cellWithInput}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
};

export default GroupFlightBookings;
