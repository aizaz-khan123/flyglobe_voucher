'use client'

import { useEffect, useMemo, useState } from 'react'

// MUI Components
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TablePagination,
  TextField,
  Tooltip
} from '@mui/material'

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

import { FaPencil, FaPlus, FaTrash } from 'react-icons/fa6'

// Redux & Local Components
import { toast } from 'react-toastify'

import { IoMdClose } from 'react-icons/io'

import { useDeleteSupplierMutation, useGetSuppliersQuery } from '@/redux-store/services/api'
import tableStyles from '@core/styles/table.module.css'
import classNames from 'classnames'
import SupplierForm from './SupplierForm'


const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const SupplierTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [supplierToDelete, setSupplierToDelete] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedSupplierId, setSelectedSupplierId] = useState(null)

  // RTK Query
  const {
    data: supplierData,
    isFetching,
    refetch
  } = useGetSuppliersQuery({
    page: page + 1,

    //  pageSize: rowsPerPage,
    searchText: globalFilter,
  })

  const suppliers = supplierData?.data || []
  const totalCount = supplierData?.total || 0

  // Mutations
  const [deleteSupplier, { isLoading: isDeleting }] = useDeleteSupplierMutation()

  // Handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }



  const handleDelete = async () => {
    if (supplierToDelete) {
      try {
        const response = await deleteSupplier(supplierToDelete.uuid)

        if (response?.data?.code === 200) {
          toast.success(response.data.message)
          refetch()
        } else {
          toast.error(response?.data?.message || 'Failed to delete supplier')
        }
      } catch (error) {
        toast.error('An error occurred while deleting supplier')
      } finally {
        setSupplierToDelete(null)
      }
    }
  }

  const handleAddNew = () => {
    setSelectedSupplierId(null)
    setIsFormOpen(true)
  }

  const handleEdit = (id) => {
    setSelectedSupplierId(id)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedSupplierId(null)
    refetch()
  }

  // Columns
  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => row.original.id
      }),
      columnHelper.accessor('name', {
        header: 'Supplier Name',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            <div className='font-medium'>{row.original.name}</div>
          </div>
        )
      }),
      columnHelper.accessor('slug', {
        header: 'Slug',
        cell: ({ row }) => row.original.slug
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) =>
          row.original.status ? (
            <span className='text-success'>Active</span>
          ) : (
            <span className='text-warning'>Inactive</span>
          )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            {row.original.description?.length > 20
              ? `${row.original.description.slice(0, 20)}...`
              : row.original.description || '-'}
          </div>
        )
      }),
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Tooltip title='Edit Supplier'>
              <IconButton size='small' onClick={() => handleEdit(row.original.uuid)}>
                <FaPencil className='text-primary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete Supplier'>
              <IconButton
                size='small'
                onClick={(e) => {
                  e.stopPropagation()
                  setSupplierToDelete(row.original)
                }}
              >
                <FaTrash className='text-error' />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    ],
    []
  )

  // Table instance
  const table = useReactTable({
    data: suppliers,
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
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getPaginationRowModel: getPaginationRowModel()
  })

  // Debounced search input
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
      <Card className='mt-5 bg-base-100'>
        <CardContent className='p-0'>
          <div className='flex items-center justify-between px-5 pt-5'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search suppliers...'
              className='w-full max-w-md'
            />
            <Button
              variant='contained'
              onClick={handleAddNew}
              className='hidden md:flex'
            >
              <FaPlus fontSize={16} />
              <span className='ml-2'>New Supplier</span>
            </Button>
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
                        No suppliers found
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!supplierToDelete} onClose={() => setSupplierToDelete(null)}>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Confirm Delete
          <IconButton onClick={() => setSupplierToDelete(null)}>
            <IoMdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          You are about to delete <b>{supplierToDelete?.name}</b>. This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={() => setSupplierToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Supplier Form */}
      <SupplierForm
        open={isFormOpen}
        onClose={handleCloseForm}
        supplierId={selectedSupplierId}
        refetch={refetch}
      />
    </>
  )
}

export { SupplierTable }

