'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

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

// Redux & Hooks
import { toast } from 'react-toastify'
import { useDeleteNewsMutation, useGetNewsQuery } from '@/redux-store/services/api'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import CreateNews from './CreateNews'

const NewsAlertTable = () => {
  // States
  const [searchText, setSearchText] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [newsToDelete, setNewsToDelete] = useState(null)
  const [selectedNewsId, setSelectedNewsId] = useState('')

  // RTK Query
  const {
    data: detail_data,
    isFetching,
    refetch
  } = useGetNewsQuery({
    pageUrl: page,
    searchText
  })

  useEffect(() => {
    refetch()
  }, [searchText, page, rowsPerPage])

  const news = detail_data?.data || []
  const links = detail_data?.links || []
  const totalCount = detail_data?.meta?.total || 0

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Mutations
  const [deleteNews, { isLoading: isDeleting }] = useDeleteNewsMutation()

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
            <Tooltip title='Edit News' placement='top'>
              <IconButton
                size='small'
                onClick={() => {
                  setSelectedNewsId(row.original.uuid)
                  setIsEditModalOpen(true)
                }}
              >
                <FaPencil className='text-base-content/70' fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete News' placement='top'>
              <IconButton size='small'>
                <FaTrash
                  className='text-error/70 hover:text-error'
                  fontSize={22}
                  onClick={event => {
                    event.stopPropagation()
                    setNewsToDelete(row.original)
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
    data: news,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / rowsPerPage)
  })

  const handleDeleteNews = async () => {
    if (newsToDelete) {
      try {
        const response = await deleteNews(newsToDelete.uuid).unwrap()
        if (response?.code === 200) {
          toast.success(response?.message)
        } else {
          toast.error(response?.message)
        }
      } catch (error) {
        toast.error('Failed to delete news')
      }
      setNewsToDelete(null)
    }
  }

  const handleCreateNews = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseModals = () => {
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    refetch()
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

    return (
      <TextField
        {...props}
        value={value}
        onChange={e => setValue(e.target.value)}
        size='small'
        placeholder='Search news...'
        // InputProps={{
        //   startAdornment: <FaSearch className='mr-2 text-base-content/50' />,
        //   endAdornment: value && (
        //     <IconButton size='small' onClick={() => setValue('')}>
        //       <FaTimes className='text-base-content/50' />
        //     </IconButton>
        //   )
        // }}
      />
    )
  }

  return (
    <>
      <Card className='mt-5 bg-base-100'>
        <CardContent className='p-0'>
          <div className='flex items-center justify-between px-5 pt-5'>
            <DebouncedInput value={searchText} onChange={value => setSearchText(value)} className='w-full max-w-md' />

            <Button variant='contained' onClick={handleCreateNews} className='hidden md:flex'>
              <FaPlus fontSize={16} className='mr-2' />
              <span>New News</span>
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
                          <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
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
          <IconButton onClick={() => setNewsToDelete(null)}>{/* <FaTimes /> */}</IconButton>
        </DialogTitle>

        <DialogContent>
          You are about to delete <b>{newsToDelete?.title}</b>. Would you like to proceed further?
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={() => setNewsToDelete(null)}>
            No
          </Button>
          <Button variant='contained' onClick={handleDeleteNews} disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={24} /> : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create News Modal - You would import and use your actual CreateNews component here */}
      <CreateNews open={isCreateModalOpen} onClose={handleCloseModals} />

      {/* Edit News Modal - You would import and use your actual EditNews component here */}
      {/* <EditNews 
        open={isEditModalOpen} 
        onClose={handleCloseModals} 
        newsId={selectedNewsId} 
      /> */}
    </>
  )
}

export { NewsAlertTable }
