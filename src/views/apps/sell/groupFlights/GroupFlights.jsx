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
import {
  Button,
  Card,
  CardContent,
  TablePagination,
  TextField,
  Typography,
  Tabs,
  Tab,
  Box
} from '@mui/material'
import { FaDownload } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const flightDataByCountry = {
  All_Types: {
    "ISB-BAH": [
      { date: "06 May 2025", flightNumber: "997A4", time: "19:35-21:15", baggage: "20-07 KG", meal: "No", currency: "PKR", price: "98,000" },
      { date: "08 May 2025", flightNumber: "997A4", time: "19:35-21:15", baggage: "20-07 KG", meal: "No", currency: "PKR", price: "98,000" },
    ],
    "SKT-SHJ": [
      { date: "06 May 2025", flightNumber: "09553", time: "03:30-05:55", baggage: "20-07 KG", meal: "No", currency: "PKR", price: "96,000" },
    ]
  },
  Behrain: {
    "ISB-BAH": [
      { date: "06 May 2025", flightNumber: "997A4", time: "19:35-21:15", baggage: "20-07 KG", meal: "No", currency: "PKR", price: "98,000" },
      { date: "08 May 2025", flightNumber: "997A4", time: "19:35-21:15", baggage: "20-07 KG", meal: "No", currency: "PKR", price: "98,000" },
    ],

  },
}

const GroupFlights = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('All_Types')
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [rowSelection, setRowSelection] = useState({})
  const currentFlights = flightDataByCountry[activeTab] || {}
  const routes = Object.keys(currentFlights)
  const combinedData = routes.flatMap(route =>
    currentFlights[route].map(flight => ({ ...flight, route }))
  )
  const columnHelper = createColumnHelper()
  const columns = useMemo(
    () => [
      columnHelper.accessor('date', {
        header: 'Date',
        cell: ({ row }) => (
          <div className='font-medium'>{row.original.date}</div>
        )
      }),
      columnHelper.accessor('flightNumber', {
        header: 'Flight Number',
        cell: ({ row }) => (
          <div className='font-medium'>{row.original.flightNumber}</div>
        )
      }),
      columnHelper.accessor('route', {
        header: 'Route',
        cell: ({ row }) => (
          <div className='font-medium'>{row.original.route}</div>
        )
      }),
      columnHelper.accessor('time', {
        header: 'Time',
        cell: ({ row }) => (
          <div className='font-medium'>{row.original.time}</div>
        )
      }),
      columnHelper.accessor('baggage', {
        header: 'Baggage',
        cell: ({ row }) => (
          <div className='font-medium'>{row.original.baggage}</div>
        )
      }),
      columnHelper.accessor('meal', {
        header: 'Meal',
        cell: ({ row }) => (
          <div className='font-medium'>{row.original.meal}</div>
        )
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: ({ row }) => (
          <div className='font-medium'>{row.original.currency} {row.original.price}</div>
        )
      }),
      {
        id: 'actions',
        header: 'Action',
        cell: () => (

             <Button variant='contained' size='small' onClick={()=>router.push(`/group-flights/booking`)} >
                    Book Now
                    </Button>
        )
      }
    ],
    [columnHelper]
  )

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
  }

  const table = useReactTable({
    data: combinedData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    pageCount: Math.ceil(combinedData.length / rowsPerPage),
  })

  const groupedData = useMemo(() => {
    const groups = {}
    table.getRowModel().rows.forEach(row => {
      const route = row.original.route
      if (!groups[route]) groups[route] = []
      groups[route].push(row)
    })
    return groups
  }, [table.getRowModel().rows])

  const DebouncedInput = ({ value, onChange, ...props }) => {
    const [inputValue, setInputValue] = useState(value)

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(inputValue)
      }, 500)
      return () => clearTimeout(timeout)
    }, [inputValue, onChange])

    return (
      <TextField
        {...props}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        size='small'
      />
    )
  }

  return (
    <Card>
      <CardContent className='p-0'>
        <Box sx={{ px: 5, pt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => {
              setActiveTab(newValue)
              setPage(0)
              setGlobalFilter('')
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
          >
            {Object.keys(flightDataByCountry).map(country => (
              <Tab key={country} label={`${country}`} value={country} />
            ))}
          </Tabs>

          <DebouncedInput
            value={globalFilter}
            onChange={setGlobalFilter}
            placeholder='Search flights...'
            className='w-full max-w-md mb-4'
          />
        </Box>

        <div className='overflow-x-auto px-5'>
          <table className='w-full border-collapse'>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className='border-b bg-gray-100'>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className='text-left p-3'>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {Object.entries(groupedData).map(([route, rows]) => (
                <>
                  <tr key={`header-${route}`}>
                    <td colSpan={columns.length} className='p-5 text-center border-b'>
                      <Typography variant='subtitle2' fontWeight='bold'>
                        {route}
                      </Typography>
                    </td>
                  </tr>
                  {rows.map(row => (
                    <tr key={row.id} className='hover:bg-gray-50 border-b'>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className='p-3'>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component='div'
          count={combinedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
        />
      </CardContent>
    </Card>
  )
}

export default GroupFlights
