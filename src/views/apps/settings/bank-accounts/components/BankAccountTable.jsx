'use client'

import { useEffect, useMemo, useState } from 'react'

// MUI Imports
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
import { FaPencil, FaPlus, FaTrash } from 'react-icons/fa6'
import { toast } from 'react-toastify'

// Component Imports
import { IoMdClose } from 'react-icons/io'

// Table imports
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

import tableStyles from '@core/styles/table.module.css'

import classNames from 'classnames'

import { useDeleteBankAccountMutation, useGetBankAccountsQuery } from '@/redux-store/services/api'
import BankAccountForm from './BankAccountForm'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const BankAccountTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [bankAccountToBeDelete, setBankAccountToBeDelete] = useState(null)

  // RTK Query
  const {
    data: detail_data,
    isFetching,
    refetch
  } = useGetBankAccountsQuery({
    page: page + 1,
    searchText: globalFilter,
    pageSize: rowsPerPage
  })

  const bank_accounts = detail_data?.data || []
  const totalCount = detail_data?.total || 0

  useEffect(() => {
    refetch()
  }, [globalFilter])

  const [deleteBankAccount, { isLoading: deleteBankAccountLoading }] = useDeleteBankAccountMutation()

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
      columnHelper.accessor('account_holder_name', {
        header: 'Account Holder',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            <div className='font-medium'>{row.original.account_holder_name}</div>
          </div>
        )
      }),
      columnHelper.accessor('bank_name', {
        header: 'Bank Name',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            {/* <Image
              //   src={product1Img.src}
              height={40}
              width={40}
              className='size-10 rounded-box'
              alt='Bank Image'
            /> */}
            <div className='font-medium'>{row.original.bank_name}</div>
          </div>
        )
      }),
      columnHelper.accessor('account_number', {
        header: 'Account Number',
        cell: ({ row }) => row.original.account_number
      }),
      columnHelper.accessor('iban', {
        header: 'IBAN',
        cell: ({ row }) => row.original.iban
      }),
      columnHelper.accessor('contact_number', {
        header: 'Contact Number',
        cell: ({ row }) => row.original.contact_number
      }),
      columnHelper.accessor('bank_address', {
        header: 'Bank Address',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            {row.original.bank_address?.length > 20
              ? `${row.original.bank_address.slice(0, 20)}...`
              : row.original.bank_address}
          </div>
        )
      }),
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center w-fit gap-2'>
            <Tooltip title='Edit Bank Account' placement='top'>
              <IconButton size='small' onClick={() => handleEdit(row.original.uuid)}>
                <FaPencil className='cursor-pointer text-base text-primary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete Bank Account' placement='top'>
              <IconButton size='small'>
                <FaTrash
                  className='cursor-pointer text-base text-red-600'
                  onClick={event => {
                    event.stopPropagation()
                    setBankAccountToBeDelete(row.original)
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
    data: bank_accounts,
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

  const handleDeleteBankAccount = async () => {
    if (bankAccountToBeDelete) {
      deleteBankAccount(bankAccountToBeDelete.uuid).then(response => {
        if (response?.data?.code == 200) {
          toast.success(response?.data.message)
          refetch()
        } else {
          toast.error(response?.data?.message || 'Something went wrong')
        }

        setBankAccountToBeDelete(null)
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

  const [isFormOpen, setIsFormOpen] = useState(false)

  const [selectedBankAccountId, setSelectedBankAccountId] = useState(null)

  const handleAddNew = () => {
    setSelectedBankAccountId(null)
    setIsFormOpen(true)
  }

  const handleEdit = id => {
    setSelectedBankAccountId(id)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedBankAccountId(null)
  }

  return (
    <>
      <Card className='mt-5 bg-base-100'>
        <CardContent className='p-0'>
          <div className='flex items-center justify-between px-5 pt-5'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search bank accounts...'
              className='w-full max-w-md'
            />
            <Button onClick={handleAddNew} variant='contained' className='hidden md:flex'>
              <FaPlus fontSize={16} />
              <span>New Bank Account</span>
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
                        No bank accounts found
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

      <Dialog open={!!bankAccountToBeDelete} onClose={() => setBankAccountToBeDelete(null)}>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Confirm Delete
          <IoMdClose className='cursor-pointer' onClick={() => setBankAccountToBeDelete(null)} />
        </DialogTitle>
        <DialogContent>
          You are about to delete <b>{bankAccountToBeDelete?.bank_name}</b>. Would you like to proceed further?
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={() => setBankAccountToBeDelete(null)}>
            No
          </Button>
          <Button variant='contained' onClick={handleDeleteBankAccount} disabled={deleteBankAccountLoading}>
            {deleteBankAccountLoading ? <CircularProgress size={24} /> : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>

      <BankAccountForm
        open={isFormOpen}
        onClose={handleCloseForm}
        refetch={refetch}
        bankAccountId={selectedBankAccountId}
      />
    </>
  )
}

export { BankAccountTable }
