'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
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

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// import { FaPencil, FaPlus, FaTrash, FaSearch, FaTimes } from 'react-icons/fa6'

// Redux & Hooks
import { toast } from 'react-toastify'
import { useDeleteCountryMutation, useGetCountriesQuery } from '@/redux-store/services/api'
import { FaPencil, FaPlus, FaTrash } from 'react-icons/fa6'
import CreateCountry from './CreateCountry'
import EditCountry from './EditCountry'
// FaSearch, FaTimes
const CountryTable = () => {
  // States
  const [searchText, setSearchText] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [countryToBeDelete, setCountryToBeDelete] = useState(null)
  const [selectedCountryId, setSelectedCountryId] = useState('')

  // RTK Query
  const {
    data: detail_data,
    isFetching,
    refetch
  } = useGetCountriesQuery({
    pageUrl: page,
    searchText
  })

  useEffect(() => {
    refetch()
  }, [searchText, page])

  const countries = detail_data?.data || []
  const links = detail_data?.links || []
  const totalCount = detail_data?.meta?.total || 0

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedSupplierId, setSelectedSupplierId] = useState('')

  const handleShow = () => {
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)

    // setIsEditMode(false)
    setIsEditModalOpen(false)
  }

  const handleShowEdit = id => {
    setSelectedCountryId(id)
    setIsEditModalOpen(true)
  }
  // Mutations
  const [deleteCountry, { isLoading: deleteCountryLoading }] = useDeleteCountryMutation()

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
        header: 'Country Name',
        cell: ({ row }) => <div className='flex items-center space-x-3 truncate'>{row.original.name}</div>
      }),
      columnHelper.accessor('nice_name', {
        header: 'Nice Name',
        cell: ({ row }) => <div className='flex items-center space-x-3 truncate'>{row.original.nice_name}</div>
      }),
      columnHelper.accessor('iso', {
        header: 'ISO',
        cell: ({ row }) => row.original.iso
      }),
      columnHelper.accessor('iso3', {
        header: 'ISO3',
        cell: ({ row }) => row.original.iso3
      }),
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center w-fit gap-2'>
            <Tooltip title='Edit Country' placement='top'>
              {/* <Link href={routes.apps.settings.country_edit(row.original.uuid)} passHref> */}
              {/* <IconButton size='small' onClick={event => event.stopPropagation()}> */}
              <IconButton size='small' onClick={() => handleShowEdit(row.original.uuid)}>
                <FaPencil className='text-base-content/70' fontSize={20} />
              </IconButton>
              {/* </Link> */}
            </Tooltip>
            <Tooltip title='Delete Country' placement='top'>
              <IconButton size='small'>
                <FaTrash
                  className='text-error/70 hover:text-error'
                  fontSize={22}
                  onClick={event => {
                    event.stopPropagation()
                    setCountryToBeDelete(row.original)
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
    data: countries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / rowsPerPage)
  })

  const handleDeleteCountry = async () => {
    if (countryToBeDelete) {
      deleteCountry(countryToBeDelete.uuid).then(response => {
        if (response?.data.code == 200) {
          toast.success(response?.data.message)
        } else {
          toast.error(response?.data.message)
        }
        setCountryToBeDelete(null)
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

    return (
      <TextField
        {...props}
        value={value}
        onChange={e => setValue(e.target.value)}
        size='small'
        placeholder='Search countries...'
      />
    )
  }

  return (
    <>
      <Card className='mt-5 bg-base-100'>
        <CardContent className='p-0'>
          <div className='flex items-center justify-between px-5 pt-5'>
            <DebouncedInput value={searchText} onChange={value => setSearchText(value)} className='w-full max-w-md' />

            <Button variant='contained' onClick={handleShow} className='hidden md:flex'>
              <FaPlus fontSize={16} />
              <span>New Country</span>
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
                        No countries found
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

      <Dialog open={!!countryToBeDelete} onClose={() => setCountryToBeDelete(null)}>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Confirm Delete
          <IconButton onClick={() => setCountryToBeDelete(null)}>
            {/* <FaTimes /> */}
            times
          </IconButton>
        </DialogTitle>

        <DialogContent>
          You are about to delete <b>{countryToBeDelete?.name}</b>. Would you like to proceed further?
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={() => setCountryToBeDelete(null)}>
            No
          </Button>
          <Button variant='contained' onClick={handleDeleteCountry} disabled={deleteCountryLoading}>
            {deleteCountryLoading ? <CircularProgress size={24} /> : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>

      <CreateCountry open={isModalOpen} onClose={handleClose} />
      <EditCountry open={isEditModalOpen} onClose={handleClose} countryId={selectedCountryId} />
    </>
  )
}

export { CountryTable }
