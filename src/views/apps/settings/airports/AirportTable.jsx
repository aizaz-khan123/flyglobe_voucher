'use client'

import { useState, useEffect, useMemo } from 'react'

import { Edit, Delete, Add, Search } from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  TextField,
  InputAdornment,
  TablePagination
} from '@mui/material'
import { useForm } from 'react-hook-form'

import { toast } from 'react-toastify'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { IoMdClose } from 'react-icons/io'

import { useDeleteAirportMutation, useGetAirportsQuery } from '@/redux-store/services/api'
import { CreateAirport } from './CreateAirport'
import { EditAirport } from './EditAiport'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })
  
return itemRank.passed
}

const AirportTable = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [pageUrl, setPageUrl] = useState('')

  const { data: detail_data, isFetching, refetch } = useGetAirportsQuery({ searchText, pageUrl })
  const airports = detail_data?.data
  const links = detail_data?.links
  const totalCount = detail_data?.total || 0

  const [deleteAirport, { isLoading: deleteAirportLoading }] = useDeleteAirportMutation()
  const [airportToBeDelete, setAirportToBeDelete] = useState(null)

  const { control: filterControl } = useForm({
    defaultValues: {
      search: ''
    }
  })

  useEffect(() => {
    refetch()
  }, [searchText, pageUrl])

  const showDeleteAirportConfirmation = uuid => {
    setAirportToBeDelete(airports?.find(b => uuid === b.uuid))
  }

  const handleDeleteAirport = async () => {
    if (airportToBeDelete) {
      deleteAirport(airportToBeDelete.uuid).then(response => {
        if (response?.data.code == 200) {
          toast.success(response?.data.message)
          setAirportToBeDelete(null)
        } else {
          toast.error(response?.data.message)
        }
      })
    }
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => <div className='font-medium'>{row.original.id}</div>
      }),
      columnHelper.accessor('name', {
        header: 'Airport Name',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            <div className='font-medium'>{row.original.name}</div>
          </div>
        )
      }),
      columnHelper.accessor('iso_country', {
        header: 'ISO Country',
        cell: ({ row }) => <div className='text-sm font-medium'>{row.original.iso_country}</div>
      }),
      columnHelper.accessor('iata_code', {
        header: 'IATA Code',
        cell: ({ row }) => <div className='text-sm font-medium'>{row.original.iata_code}</div>
      }),
      columnHelper.accessor('municipality', {
        header: 'Municipality',
        cell: ({ row }) => <div className='flex items-center gap-2'>{row.original.municipality}</div>
      }),
      columnHelper.accessor('country', {
        header: 'Country',
        cell: ({ row }) => <div className='flex items-center gap-2'>{row.original.country}</div>
      }),
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className='inline-flex w-fit gap-2'>
            <Button
              color='inherit'
              size='small'
              aria-label='Edit airport'
              onClick={() => handleShowEdit(row.original.uuid)}
            >
              <Edit fontSize='small' className='text-gray-600' />
            </Button>
            <Button
              color='inherit'
              size='small'
              aria-label='Delete airport'
              onClick={event => {
                event.stopPropagation()
                showDeleteAirportConfirmation(row.original.uuid)
              }}
            >
              <Delete fontSize='small' className='text-red-500' />
            </Button>
          </div>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: airports || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / rowsPerPage),
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getPaginationRowModel: getPaginationRowModel()
  })

  // create and edit airport
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAirportId, setSelectedAirportId] = useState('')

  const handleShow = () => {
    setIsCreateModalOpen(true)
  }

  const handleClose = () => {
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
  }

  const handleShowEdit = id => {
    setSelectedAirportId(id)
    setIsEditModalOpen(true)
  }

  return (
    <>
      <Card className='mt-5 bg-white'>
        <CardContent className='p-0'>
          <div className='flex items-center justify-between px-5 pt-5'>
            <TextField
              variant='outlined'
              size='small'
              placeholder='Search...'
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                )
              }}
            />
            <Button variant='contained' startIcon={<Add />} onClick={handleShow}>
              New Airport
            </Button>
          </div>
          <div className='overflow-x-auto p-5'>
            <table className='w-full border-collapse'>
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
                {!isFetching ? (
                  table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map(row => (
                      <tr key={row.id} className='hover:bg-gray-50'>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className='py-5 text-left border-b'>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={table.getAllColumns().length} className='text-center p-5'>
                        No airports found
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={table.getAllColumns().length}>
                      <div className='flex justify-center items-center py-5'>
                        <CircularProgress />
                      </div>
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

      {/* Delete confirmation dialog */}
      <Dialog open={!!airportToBeDelete} onClose={() => setAirportToBeDelete(null)}>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Confirm Delete
          <IoMdClose className='cursor-pointer' onClick={() => setAirportToBeDelete(null)} />
        </DialogTitle>
        <DialogContent>
          You are about to delete <b>{airportToBeDelete?.name}</b>. Would you like to proceed further?
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={() => setAirportToBeDelete(null)}>
            No
          </Button>
          <Button variant='contained' onClick={handleDeleteAirport} disabled={deleteAirportLoading}>
            {deleteAirportLoading ? <CircularProgress size={24} /> : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create and Edit dialogs would go here */}
      <CreateAirport open={isCreateModalOpen} onClose={handleClose} />
      <EditAirport open={isEditModalOpen} onClose={handleClose} airportId={selectedAirportId} />
    </>
  )
}

export { AirportTable }
