'use client'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  Badge,
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

import { useForm } from 'react-hook-form'

import { FaPencil, FaPlus, FaTrash } from 'react-icons/fa6'

import {
  useBranchDropDownQuery,
  useDeleteAirlineMarginMutation,
  useGetAirlineMarginsQuery
} from '@/redux-store/services/api'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import SearchInput from '@/components/searchInput/SearchInput'
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
import { CreateEditAirlineMargin } from './CreateEditAirlineMargin'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'

const MarginTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [pageUrl, setPageUrl] = useState('')
  const [marginModal, setMarginModal] = useState('')
  const [marginTypeModal, setMarginTypeModal] = useState('')

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({ itemRank })

    return itemRank.passed
  }
  const { data: detail_data, isFetching, refetch } = useGetAirlineMarginsQuery({ searchText, pageUrl })
  const airline_margins = detail_data?.data
  const links = detail_data?.links
  const totalCount = detail_data?.total || 0

  const [deleteAirlineMargin, { isLoading: deleteAirlineMarginLoading }] = useDeleteAirlineMarginMutation()

  // branch dropdown
  const { data: branchDropdownData, isFetching: isFetchingBranch, refetch: refetchBranch } = useBranchDropDownQuery()

  const initialValues = {
    branchData:
      branchDropdownData?.map(data => ({
        margin: marginModal || '',
        margin_type: marginTypeModal || 'amount'
      })) || []

    // user: branchDropdownData?.map((data) => ({
    //     id: data?.id,
    //     name: data?.name
    //   }))
  }

  const {
    control: controlAssignModal,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: initialValues
  })

  const onSubmit = handleSubmit(async data => {
    const updated_data = {
      _method: 'put',
      ...data
    }

    // await updateAirlineMargin({ airlineMarginId, updated_data }).then((response) => {

    //     if('error' in response){
    //         setErrors(response?.error.data?.errors);
    //         return;
    //     }
    //     if (response.data?.code == 200) {
    //         toaster.success(response?.data?.message);
    //         refetch();
    //         router.push(routes.apps.settings.airline_margins);
    //     } else {
    //         setErrors(response?.data?.errors)
    //     }
    // });
  })

  useEffect(() => {
    reset(initialValues)
  }, [marginModal, marginTypeModal, reset])
  useEffect(() => {
    refetch()
  }, [searchText, pageUrl])
  const [AirlineMarginToBeDelete, setAirlineMarginToBeDelete] = useState(null)

  const AirlineMarginDeleteConfirmationRef = useRef(null)
  const AirlineMarginAssignConfirmationRef = useRef(null)

  const { control: filterControl } = useForm({
    defaultValues: {
      category: 'default',
      search: ''
    }
  })

  const showDeleteAirlineMarginConfirmation = uuid => {
    AirlineMarginDeleteConfirmationRef.current?.showModal()
    setAirlineMarginToBeDelete(airline_margins?.find(b => uuid === b.uuid))
  }

  const showAssignAirlineMarginConfirmation = (margin, margin_type) => {
    AirlineMarginAssignConfirmationRef.current?.showModal()
    setMarginModal(margin?.toString())
    setMarginTypeModal(margin_type)
  }

  const handleDeleteAirlineMargin = async () => {
    if (AirlineMarginToBeDelete) {
       deleteAirlineMargin(AirlineMarginToBeDelete.uuid).then(response => {
        if (response?.data.code == 200) {
          toast.success(response?.data.message)
          setAirlineMarginToBeDelete(null)
          refetch()
        } else {
          toast.error(response?.data.message)
        }
      })
    }
  }

  const paginationClickHandler = url => {
    if (url) {
      setPageUrl(url)
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
      columnHelper.accessor('sales_channel', {
        header: 'Sales Channel',
        cell: ({ row }) => <div className='flex items-center space-x-3 truncate'>{row.original.sales_channel}</div>
      }),
      columnHelper.accessor('airline.name', {
        header: 'Airline',
        cell: ({ row }) => <div className='flex items-center space-x-3 truncate'>{row.original.airline?.name}</div>
      }),
      columnHelper.accessor('margin', {
        header: 'Pricing',
        cell: ({ row }) => {
          const { margin, margin_type } = row.original
          const color = Number(margin) > 0 ? 'warning' : 'success'
          return (
            <Badge color={color}>
              {margin}
              {margin_type === 'amount' ? ' PKR' : '%'}
            </Badge>
          )
        }
      }),
      columnHelper.accessor('region', {
        header: 'Region',
        cell: ({ row }) => <div className='font-medium'>{row.original.region}</div>
      }),
      columnHelper.accessor('is_apply_on_gross', {
        header: 'Apply on gross fare',
        cell: ({ row }) => (
          <Badge color={row.original.is_apply_on_gross ? 'success' : 'warning'}>
            {row.original.is_apply_on_gross ? 'Yes' : 'No'}
          </Badge>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) =>
          row?.original?.status ? (
            <span className='text-success'>Active</span>
          ) : (
            <span className='text-warning'>In-Active</span>
          )
      }),
      columnHelper.accessor('rbds', {
        header: 'Rbds',
        cell: ({ row }) => <div className='font-medium'>{row.original.rbds}</div>
      }),
      columnHelper.accessor('remarks', {
        header: 'Remarks',
        cell: ({ row }) => (
          <div className='text-sm'>
            {row.original.remarks?.length > 20 ? `${row.original.remarks.slice(0, 20)}...` : row.original.remarks}
          </div>
        )
      }),
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center w-fit gap-2'>
            <Tooltip title='Edit Airline Margin' placement='top'>
              <IconButton size='small' onClick={() => handleShowEdit(row.original.uuid)}>
                <FaPencil className='cursor-pointer text-base text-primary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete Airline Margin' placement='top'>
              <IconButton size='small'>
                <FaTrash
                  className='cursor-pointer text-base text-red-600'
                  onClick={e => {
                    e.stopPropagation()
                    showDeleteAirlineMarginConfirmation(row.original.uuid)
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
    data: airline_margins,
    columns,
    getCoreRowModel: getCoreRowModel(),
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

  // create and edit airline margin

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedAirlineMarginId, setSelectedAirlineMarginId] = useState('')

  const handleShow = () => {
    setIsCreateModalOpen(true)
    setIsEdit(false)
    setSelectedAirlineMarginId(null)
  }

  const handleClose = () => {
    setIsCreateModalOpen(false)
    // setIsEditMode(false)
  }

  const handleShowEdit = (id) => {
    setSelectedAirlineMarginId(id)
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
      <Card className='mt-5 bg-base-100'>
        <CardContent className={'p-0'}>
          <div className='flex items-center justify-between px-5 pt-5'>
            <div className='inline-flex items-center gap-3'>
            <DebouncedInput
              value={searchText ?? ''}
              onChange={value => setSearchText(String(value))}
              placeholder='Search Airline Margin...'
              className='w-full max-w-md'
            />
              {/* <SearchInput onSearch={setSearchText} control={filterControl} /> */}
            </div>
            <div className='inline-flex items-center gap-3'>
              <Button onClick={handleShow} variant='contained' className='hidden md:flex'>
                <FaPlus fontSize={16} />
                <span>New Airline Margin</span>
              </Button>
            </div>
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
                    table.getRowModel().rows.map(row => {
                      return (
                        <tr key={row?.id} className='hover:bg-gray-50'>
                          {row.getVisibleCells().map(cell => {
                            return (
                              <td key={cell?.id} className='p-3 border-b'>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={table.getAllColumns().length} className='text-center p-5'>
                        No airline margins found
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
      <Dialog open={!!AirlineMarginToBeDelete} onClose={() => setAirlineMarginToBeDelete(null)}>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Confirm Delete
          <IoMdClose className='cursor-pointer' onClick={() => setAirlineMarginToBeDelete(null)} />
        </DialogTitle>
        <DialogContent>
          You are about to delete <b>{AirlineMarginToBeDelete?.bank_name}</b>. Would you like to proceed further?
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={() => setAirlineMarginToBeDelete(null)}>
            No
          </Button>
          <Button variant='contained' onClick={handleDeleteAirlineMargin}>
            {'Yes'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* assign modal  */}
      <Dialog className='w-11/12 max-w-6xl h-11/12' ref={AirlineMarginAssignConfirmationRef} backdrop>
        <form method='dialog'>
          <Button size='sm' color='ghost' shape='circle' className='absolute right-2 top-2' aria-label='Close modal'>
            X{/* <Icon icon={xIcon} className="h-4" /> */}
          </Button>
        </form>
        <DialogTitle className='font-bold'>Assign Margin</DialogTitle>
        <DialogContent>
          <div className='overflow-auto'>
            <table className='mt-2 rounded-box'>
              <thead>
                <tr>
                  <td className='text-sm font-medium text-base-content/80'>ID</td>
                  <td className='text-sm font-medium text-base-content/80'>Name</td>
                  <td className='text-sm font-medium text-base-content/80'>Margin</td>
                  <td className='text-sm font-medium text-base-content/80'>Margin Type</td>
                </tr>
              </thead>

              <tbody isLoading={isFetching} hasData={!!branchDropdownData?.length}>
                {branchDropdownData?.map((data, index) => {
                  return (
                    //    <TableRow className="hover:bg-base-200/40">
                    <>
                      <div className='font-medium'>{index + 1}</div>
                      <div className='flex items-center space-x-3 truncate'>{data?.name}</div>
                      <div>
                        <MuiTextField
                          className='w-64 border-0 focus:outline-0'
                          control={controlAssignModal}
                          size='md'
                          id={`margin-${index}`}
                          name={`branchData.${index}.margin`}
                          placeholder='Enter Margin'
                          wrapperClassName='w-[29rem]'
                        />
                      </div>
                      <div>
                        <MuiDropdown
                          control={controlAssignModal}
                          name={`branchData.${index}.margin_type`}
                          size='md'
                          id={`margin_type-${index}`}
                          className='w-full border-0 text-base w-[18rem]'
                          options={[
                            { id: 'amount', name: 'Amount' },
                            { id: 'percentage', name: 'Percentage' }
                          ].map(connector => ({
                            label: connector.name,
                            value: connector.id
                          }))}
                        />
                      </div>
                    </>

                    //    </TableRow>
                  )
                })}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <form method='dialog'>
            <Button color='error' size='sm'>
              No
            </Button>
          </form>
          <form method='dialog'>
            <Button loading={deleteAirlineMarginLoading} color='primary' size='sm' onClick={onSubmit}>
              Yes
            </Button>
          </form>
        </DialogActions>
      </Dialog>
      {/* ---------------------- Create Airline Margin ------------------ */}
      <CreateEditAirlineMargin open={isCreateModalOpen} onClose={handleClose} airlineMarginId={selectedAirlineMarginId} isEdit={isEdit} refetch={refetch} />
    </>
  )
}

export { MarginTable }
