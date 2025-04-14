'use client'

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
  TablePagination,
  IconButton,
  Tooltip
} from '@mui/material'
import { Edit, Delete, Add, Search } from '@mui/icons-material'
import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useDeleteAirportMutation, useGetAirportsQuery } from '@/redux-store/services/api'
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
import { CreateAirport, CreateEditAirport } from './CreateEditAirport'
import { EditAirport } from './EditAiport'
import { FaPencil, FaTrash } from 'react-icons/fa6'

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

  const { data: detail_data, isFetching, refetch } = useGetAirportsQuery({
    page: page + 1,
    pageSize: rowsPerPage,
    searchText: globalFilter
  })
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
  }, [searchText, pageUrl, globalFilter])

  const showDeleteAirportConfirmation = uuid => {
    setAirportToBeDelete(airports?.find(b => uuid === b.uuid))
  }

  const handleDeleteAirport = async () => {
    if (airportToBeDelete) {
      deleteAirport(airportToBeDelete.uuid).then(response => {
        if (response?.data.code == 200) {
          toast.success(response?.data.message)
          setAirportToBeDelete(null)
          refetch()
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
          <div className='flex items-center w-fit gap-2'>
            <Tooltip title='Edit Airports' placement='top'>
              <IconButton size='small' onClick={() => handleShowEdit(row.original.uuid)}>
                <FaPencil className='cursor-pointer text-base text-primary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete Airports' placement='top'>
              <IconButton size='small'>
                <FaTrash
                  className='cursor-pointer text-base text-red-600'
                  onClick={e => {
                    // e.stopPropagation()
                    showDeleteAirportConfirmation(row.original.uuid)
                  }}
                />
              </IconButton>
            </Tooltip>
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
  const [isEdit, setIsEdit] = useState(false)
  const [selectedAirportId, setSelectedAirportId] = useState('')

  const handleShow = () => {
    setIsCreateModalOpen(true)
    setIsEdit(false)
    setSelectedAirportId(null)

  }

  const handleClose = () => {
    setIsCreateModalOpen(false)
  }

  const handleShowEdit = id => {
    setSelectedAirportId(id)
    setIsCreateModalOpen(true)
    setIsEdit(true)

  }
  const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value])

    return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
  }
  return (
    <>
      <Card className='mt-5 bg-white'>
        <CardContent className='p-0'>
          <div className='flex items-center justify-between px-5 pt-5'>
            <DebouncedInput
              value={searchText ?? ''}
              onChange={value => setSearchText(String(value))}
              placeholder='Search Airports...'
              className='w-full max-w-md'
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
                          <td key={cell.id} className='p-3 border-b'>
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
      <CreateEditAirport open={isCreateModalOpen} onClose={handleClose} airportId={selectedAirportId} isEdit={isEdit} refetch={refetch} />
    </>
  )
}

export { AirportTable }
