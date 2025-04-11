'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'
import { FaPencil, FaPlus, FaTrash } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
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

import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TablePagination
} from '@mui/material'

import { toast } from 'react-toastify'

import { useDeleteAirlineMutation, useGetAirlinesQuery } from '@/redux-store/services/api'
import SearchInput from '@/components/searchInput/SearchInput'

// import product1Img from "@/assets/images/apps/ecommerce/products/1.jpg"
import { CreateAirline } from './CreateAirline'
import { EditAirline } from './EditAirline'


const AirlineTable = () => {
  //   const toaster = useToast()
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [pageUrl, setPageUrl] = useState('')

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({ itemRank })
    
return itemRank.passed
  }

  const { data: detail_data, isFetching, refetch } = useGetAirlinesQuery({ searchText, pageUrl })
  const airlines = detail_data?.data
  const links = detail_data?.links
  const totalCount = detail_data?.total || 0

  const [deleteAirline, { isLoading: deleteAirlineLoading }] = useDeleteAirlineMutation()

  const { control: filterControl } = useForm({
    defaultValues: {
      category: 'default',
      search: ''
    }
  })

  useEffect(() => {
    refetch()
  }, [searchText, pageUrl])

  const [airlineToBeDelete, setAirlineToBeDelete] = useState(null)
  const airlineDeleteConfirmationRef = useRef(null)

  const showDeleteAirlineConfirmation = uuid => {
    setAirlineToBeDelete(airlines?.find(b => uuid === b.uuid))
  }

  const handleDeleteAirline = async () => {
    if (airlineToBeDelete) {
      deleteAirline(airlineToBeDelete.uuid).then(response => {
        if (response?.data.code == 200) {
          toast.success(response?.data.message)
          setAirlineToBeDelete(null)
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
      columnHelper.accessor('name', {
        header: 'Airline',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            {/* <Image 
              src={row.original.thumbnail || product1Img.src} 
              height={40} 
              width={40} 
              className="size-10 rounded-box" 
              alt="Airline Image" 
            /> */}
            <div>
              <div className='font-medium'>{row.original.name}</div>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('iata_code', {
        header: 'IATA Code',
        cell: ({ row }) => <div className='text-sm font-medium'>{row.original.iata_code}</div>
      }),
      columnHelper.accessor('country.name', {
        header: 'Country',
        cell: ({ row }) => <div className='flex items-center gap-2'>{row.original.country?.name}</div>
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
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className='inline-flex w-fit gap-2'>
            <Button
              color='ghost'
              size='sm'
              shape='square'
              aria-label='Edit airline'
              onClick={() => handleShowEdit(row?.original.uuid)}
            >
              <FaPencil className='text-base-content/70' fontSize={20} />
            </Button>
            <Button
              color='ghost'
              className='text-error/70 hover:bg-error/20'
              size='sm'
              shape='square'
              aria-label='Delete airline'
              onClick={event => {
                event.stopPropagation()
                showDeleteAirlineConfirmation(row.original.uuid)
              }}
            >
              <FaTrash fontSize={20} />
            </Button>
          </div>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: airlines || [],
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAirlineId, setSelectedAirlineId] = useState('')

  const handleShow = () => {
    setIsCreateModalOpen(true)
  }

  const handleClose = () => {
    setIsCreateModalOpen(false)

    // setIsEditMode(false)
    setIsEditModalOpen(false)
  }

  const handleShowEdit = id => {
    setSelectedAirlineId(id)
    setIsEditModalOpen(true)
  }

  return (
    <>
      <Card className='mt-5 bg-base-100'>
        <CardContent className={'p-0'}>
          <div className='flex items-center justify-between px-5 pt-5'>
            <div className='inline-flex items-center gap-3'>
              <SearchInput onSearch={setSearchText} control={filterControl} />
            </div>
            <div className='inline-flex items-center gap-3'>
              <Button variant='contained' className='hidden md:flex' onClick={handleShow}>
                <FaPlus fontSize={16} />
                <span>New Airline</span>
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
                        No airlines found
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
      <Dialog open={!!airlineToBeDelete} onClose={() => setAirlineToBeDelete(null)}>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Confirm Delete
          <IoMdClose className='cursor-pointer' onClick={() => setAirlineToBeDelete(null)} />
        </DialogTitle>
        <DialogContent>
          You are about to delete <b>{airlineToBeDelete?.name}</b>. Would you like to proceed further?
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={() => setAirlineToBeDelete(null)}>
            No
          </Button>
          <Button variant='contained' onClick={handleDeleteAirline} disabled={deleteAirlineLoading}>
            {deleteAirlineLoading ? <CircularProgress size={24} /> : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* create airline dialog */}
      <CreateAirline open={isCreateModalOpen} onClose={handleClose} />
      {/* Edit airline dialog */}
      <EditAirline open={isEditModalOpen} onClose={handleClose} airlineId={selectedAirlineId} />
    </>
  )
}

export { AirlineTable }
