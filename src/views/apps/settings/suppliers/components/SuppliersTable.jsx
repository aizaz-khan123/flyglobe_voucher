'use client'

import { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

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

import { useDeleteSupplierMutation, useGetSuppliersQuery } from '@/redux-store/services/api'

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
  const [supplierToBeDelete, setSupplierToBeDelete] = useState(null)

  // RTK Query
  const {
    data: detail_data,
    isFetching,
    refetch
  } = useGetSuppliersQuery({
    page: page + 1,
    pageSize: rowsPerPage,
    searchText: globalFilter
  })

  const suppliers = detail_data?.data || []
  const totalCount = detail_data?.total || 0

  // Mutations
  const [deleteSupplier, { isLoading: deleteSupplierLoading }] = useDeleteSupplierMutation()

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Column Definitions
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
            <span className='text-success cursor-pointer'>Active</span>
          ) : (
            <span className='text-warning cursor-pointer'>In-Active</span>
          )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            {row.original.description?.length > 20
              ? `${row.original.description.slice(0, 20)}...`
              : row.original.description}
          </div>
        )
      }),
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center w-fit gap-2'>
            <Tooltip title='Edit Supplier' placement='top'>
              <Link
                href={'#'}
                //    href={routes.apps.settings.supplier_edit(row.original.uuid)}
                aria-label='Edit supplier'
              >
                <IconButton size='small'>
                  <FaPencil className='text-base-content/70' fontSize={20} />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title='Delete Supplier' placement='top'>
              <IconButton size='small'>
                <FaTrash
                  className='text-error/70 hover:text-error'
                  fontSize={22}
                  onClick={event => {
                    event.stopPropagation()
                    setSupplierToBeDelete(row.original)
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

  const handleDeleteSupplier = async () => {
    if (supplierToBeDelete) {
      deleteSupplier(supplierToBeDelete.uuid).then(response => {
        if (response?.data.code == 200) {
          toaster.success(response?.data.message)
        } else {
          toaster.error(response?.data.message)
        }

        setSupplierToBeDelete(null)
      })
    }
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
      <Card className='mt-5 bg-base-100'>
        <CardContent className='p-0'>
          <div className='flex items-center justify-between px-5 pt-5'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search suppliers...'
              className='w-full max-w-md'
            />
            <Link href={'#'} aria-label={'Create supplier link'}>
              <Button variant='contained' className='hidden md:flex'>
                <FaPlus fontSize={16} />
                <span>New Supplier</span>
              </Button>
            </Link>
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
                      <tr key={row.id} className='hover:bg-base-200/40'>
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

      <Dialog open={!!supplierToBeDelete} onClose={() => setSupplierToBeDelete(null)}>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Confirm Delete
          {/* <Icon icon={xIcon} className="cursor-pointer" onClick={() => setSupplierToBeDelete(null)} /> */}X
        </DialogTitle>

        <DialogContent>
          You are about to delete <b>{supplierToBeDelete?.name}</b>. Would you like to proceed further?
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={() => setSupplierToBeDelete(null)}>
            No
          </Button>
          <Button variant='contained' onClick={handleDeleteSupplier} disabled={deleteSupplierLoading}>
            {deleteSupplierLoading ? <CircularProgress size={24} /> : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export { SupplierTable }
