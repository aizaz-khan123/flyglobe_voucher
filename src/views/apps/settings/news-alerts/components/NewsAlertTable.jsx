'use client'

import { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'

import { rankItem } from '@tanstack/match-sorter-utils'

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
  Tooltip,
  Chip
} from '@mui/material'

// Icons
import { FaPencil, FaPlus, FaTrash } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

// Redux & Table
import { toast } from 'react-toastify'

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

import { useDeleteNewsMutation, useGetNewsQuery } from '@/redux-store/services/api'

// Components
import NewsForm from './NewsForm'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })
  
return itemRank.passed
}

const NewsAlertTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [newsToDelete, setNewsToDelete] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedNewsId, setSelectedNewsId] = useState(null)

  // RTK Query
  const {
    data: newsData,
    isFetching,
    refetch
  } = useGetNewsQuery({

  })

  const news = newsData?.data || []
  const totalCount = newsData?.meta?.total || 0

  // Mutations
  const [deleteNews, { isLoading: isDeleting }] = useDeleteNewsMutation()

  // Handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDelete = async () => {
    if (newsToDelete) {
      try {
        const response = await deleteNews(newsToDelete.uuid)

        if (response?.data?.code === 200) {
          toast.success(response.data.message)
          refetch()
        } else {
          toast.error(response?.data?.message || 'Failed to delete news')
        }
      } catch (error) {
        toast.error('An error occurred while deleting news')
      } finally {
        setNewsToDelete(null)
      }
    }
  }

  const handleAddNew = () => {
    setSelectedNewsId(null)
    setIsFormOpen(true)
  }

  const handleEdit = (id) => {
    setSelectedNewsId(id)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedNewsId(null)
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
      columnHelper.accessor('title', {
        header: 'News Title',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            <Image
              src={row.original.image || '/placeholder.jpg'}
              height={40}
              width={40}
              className='rounded-box'
              alt='News Image'
            />
            <div className='font-medium'>{row.original.title}</div>
          </div>
        )
      }),
      columnHelper.accessor('is_feature', {
        header: 'Is Feature',
        cell: ({ row }) =>
          row.original.is_feature ? (
            <Chip label='Feature' color='success' size='small' />
          ) : (
            <Chip label='Normal' color='warning' size='small' />
          )
      }),
      columnHelper.accessor('news_url', {
        header: 'News URL',
        cell: ({ row }) => row.original.news_url
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => (
          <div className='text-sm'>
            {row.original.description?.length > 20
              ? ${row.original.description.slice(0, 20)}...
              : row.original.description}
          </div>
        )
      }),
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Tooltip title='Edit News'>
              <IconButton size='small' onClick={() => handleEdit(row.original.uuid)}>
                <FaPencil className='text-primary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete News'>
              <IconButton
                size='small'
                onClick={(e) => {
                  e.stopPropagation()
                  setNewsToDelete(row.original)
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
    data: news,
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
        setPage(0) // Reset to first page when search term changes
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
              placeholder='Search news...'
              className='w-full max-w-md'
            />
            <Button
              variant='contained'
              onClick={handleAddNew}
              className='hidden md:flex'
            >
              <FaPlus fontSize={16} />
              <span className='ml-2'>New News</span>
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
                        No news found
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
      <Dialog open={!!newsToDelete} onClose={() => setNewsToDelete(null)}>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Confirm Delete
          <IconButton onClick={() => setNewsToDelete(null)}>
            <IoMdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          You are about to delete <b>{newsToDelete?.title}</b>. This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={() => setNewsToDelete(null)}>
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

      {/* News Form */}
      <NewsForm
        open={isFormOpen}
        onClose={handleCloseForm}
        newsId={selectedNewsId}
        refetch={refetch}
      />
    </>
  )
}


export { NewsAlertTable }
