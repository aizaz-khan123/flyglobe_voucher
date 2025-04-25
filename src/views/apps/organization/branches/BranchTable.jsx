'use client'

import { useEffect, useMemo, useState } from 'react'

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
import { useForm } from 'react-hook-form'

// MUI Imports
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  IconButton,
  Switch,
  TablePagination,
  TextField,
  Tooltip
} from '@mui/material'
import { FaPencil, FaPlus, FaTrash } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { z } from 'zod'

// Component Imports
import { IoMdClose } from 'react-icons/io'

import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'

import OptionMenu from '@/@core/components/option-menu'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import PhoneNumberInput from '@/components/reactPhoneInput/PhoneNumberInput'
import { cities } from '@/data/dropdowns/cities'
import {
  useCreateBranchMutation,
  useDeleteBranchMutation,
  useGetBranchesQuery,
  usePermissionListByTypeMutation,
  usePermissionUpdateMutation,
  useStatusUpdateMutation,
  useUpdateBranchMutation
} from '@/redux-store/services/api'
import tableStyles from '@core/styles/table.module.css'
import classNames from 'classnames'
import PermissionModal from '../PermissionModal'
import AssignedMarginModal from './settings/AssignedMarginModal'
import ChangePasswordModal from './settings/ChangePasswordModal'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const BranchTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPermissionModal, setIsPermissionModal] = useState(false)
  const [isChangePasswordModal, setIsChangePasswordModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [branchId, setBranchId] = useState('')
  const [permissionList, setPermissionList] = useState()
  const [selectedPermissions, setSelectedPermissions] = useState()
  const [userUUid, setuserUUid] = useState()
  const [permissionListByTypeLoading, setPermissionListByTypeLoading] = useState(null)
  const [BranchToBeDelete, setBranchToBeDelete] = useState()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isAssignMarginModal, setIsAssignMarginModal] = useState(false);

  // RTK Query
  const {
    data: detail_data,
    isFetching,
    refetch
  } = useGetBranchesQuery({
    page: page + 1,
    pageSize: rowsPerPage,
    searchText: globalFilter
  })

  const branches = detail_data?.data || []
  const totalCount = detail_data?.total || 0

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const showAssignAirlineMarginConfirmation = (uuid) => {
    setIsAssignMarginModal(true);
    setBranchId(uuid)
  };

  // Mutations
  const [createBranch, { isLoading: createLoading }] = useCreateBranchMutation()
  const [deleteBranch, { isLoading: deleteBranchLoading }] = useDeleteBranchMutation()
  const [updateBranch, { isLoading: branchLoading }] = useUpdateBranchMutation()
  const [updatePermissions, { isLoading: permissionLoading }] = usePermissionUpdateMutation()
  const [permissionListByType] = usePermissionListByTypeMutation()
  const [updateStatus] = useStatusUpdateMutation()

  // Form control
  const branchSchema = z.object({
    org_name: z.string({ required_error: 'Branch Name Required!' }).min(5, 'Branch Name cannot be empty!'),
    manager_name: z
      .string({ required_error: 'Branch Manager Name Required!' })
      .min(5, 'Branch Manager Name Should be greater than 5'),
    phone_number: z
      .string({ required_error: 'Phone Number is Required!' })
      .regex(/^\+?\d{1,4}?[\d\s\-\(\)]{7,15}$/, 'Invalid phone number!'),
    city: z.string({ required_error: 'City is required!' }).min(1, 'City cannot be empty!'),
    address: z.string({ required_error: 'Address is required!' }).min(1, 'Address cannot be empty!'),
    email: z
      .string({ required_error: 'Email Required!' })
      .email({ message: 'Invalid email address!' })
      .min(1, 'Email is required!')
  })

  const { control, handleSubmit, setError, reset } = useForm({
    resolver: zodResolver(branchSchema)
  })

  // Column Definitions
  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => row.original.id
      }),
      columnHelper.accessor('name', {
        header: 'Branch Name',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            <div className='font-medium'>{row.original.name}</div>
          </div>
        )
      }),
      columnHelper.accessor('main_user.name', {
        header: 'Manager Name',
        cell: ({ row }) => row.original.main_user?.name
      }),
      columnHelper.accessor('main_user.email', {
        header: 'Email',
        cell: ({ row }) => row.original.main_user?.email
      }),
      columnHelper.accessor('main_user.phone_number', {
        header: 'Phone Number',
        cell: ({ row }) => row.original.main_user?.phone_number
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            {row.original.address?.length > 20 ? `${row.original.address.slice(0, 20)}...` : row.original.address}
          </div>
        )
      }),
      columnHelper.accessor('city', {
        header: 'City',
        cell: ({ row }) => row.original.city
      }),
      columnHelper.accessor('main_user.last_login', {
        header: 'Last Login',
        cell: ({ row }) => row.original.main_user?.last_login
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Tooltip title='Change Status' placement='top'>
            <Switch
              defaultChecked={row.original.status}
              onChange={() => handleStatusChange(row.original.uuid)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Tooltip>
        )
      }),
      columnHelper.accessor('permissions', {
        header: 'Permissions',
        cell: ({ row }) => (
          <Button
            className='whitespace-nowrap'
            onClick={event => {
              event.stopPropagation()
              showUpdatePermissionModal(row.original.main_user?.uuid)
            }}
          >
            {permissionListByTypeLoading === row.original.main_user?.uuid ? 'Loading...' : 'Update Permission'}
          </Button>
        )
      }),
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center w-fit gap-2'>
            <Tooltip title='Delete Branch' placement='top'>
              <IconButton size='small'>
                <FaTrash
                  className='cursor-pointer text-base text-red-600'
                  onClick={event => {
                    event.stopPropagation()
                    showDeleteBranchConfirmation(row.original.uuid)
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title='Update Branch' placement='top'>
              <IconButton>
                <FaPencil
                  className='cursor-pointer text-base text-primary'
                  onClick={event => {
                    event.stopPropagation()
                    showUpdateBranchConfirmation(row.original)
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title='Settings' placement='top'>
              <OptionMenu
                iconClassName='text-textPrimary'
                options={[
                  {
                    text: 'Change Password',
                    menuItemProps: {
                      onClick: () => {
                        showChangePasswordModal()
                        setuserUUid(row.original.main_user?.uuid)
                      }
                    }
                  },
                  {
                    text: 'Assigned Margins',
                    menuItemProps: {
                      onClick: () => {
                        showAssignAirlineMarginConfirmation(row.original.id)
                      }
                    }
                  },
                ]}
              />
            </Tooltip>
          </div>
        )
      }
    ],
    [permissionListByTypeLoading]
  )

  const table = useReactTable({
    data: branches,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / 10), // Adjust based on your API
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

  const handleStatusChange = uuid => {
    const body = {
      _method: 'patch'
    }

    updateStatus({ uuid, body }).then(response => {
      toast.success('Status Changed!')
    })
  }

  const showDeleteBranchConfirmation = uuid => {
    setBranchToBeDelete(branches.find(b => uuid === b.uuid))
  }

  const handleDeleteBranch = async () => {
    if (BranchToBeDelete) {
      deleteBranch(BranchToBeDelete.uuid).then(response => {
        if (response?.data.code == 200) {
          toast.success(response?.data.message)
        } else {
          toast.error(response?.data.message)
        }
      })
    }
  }

  const showUpdateBranchConfirmation = branch => {
    reset({
      org_name: branch.name,
      manager_name: branch.main_user.name,
      phone_number: branch.main_user.phone_number,
      city: branch.city,
      address: branch.address,
      email: branch.main_user.email
    })
    setBranchId(branch.uuid)
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const showUpdatePermissionModal = async uuid => {
    setPermissionListByTypeLoading(uuid)
    const type = 'branch'

    await permissionListByType({ uuid, type })
      .then(response => {
        setPermissionListByTypeLoading(null)

        if ('error' in response) {
          toast.error('something went wrong.')

          return false
        }

        setPermissionList(response?.data?.permission_list)
        setSelectedPermissions(response?.data?.selected_permissions)
        setIsPermissionModal(true)
        setuserUUid(uuid)
      })
      .catch(() => {
        setPermissionListByTypeLoading(null)
      })
  }

  const showChangePasswordModal = async () => {
    setIsChangePasswordModal(true)
  }

  const handleShow = () => {
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    reset({
      org_name: '',
      manager_name: '',
      phone_number: '',
      city: '',
      address: '',
      email: ''
    })
  }

  const handleSubmitPermissions = async selectedPermissionUUIDs => {
    await updatePermissions({ userUUid, selectedPermissionUUIDs }).then(response => {
      if ('error' in response) {
        setErrors(response?.error?.data?.errors)

        return
      }

      toast.success(`Permissions has been Updated`)
      setPermissionList('')
      setSelectedPermissions('')
      setIsPermissionModal(false)
    })
  }

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const onSubmit = handleSubmit(async data => {
    if (isEditMode) {
      const updated_data = {
        _method: 'put',
        ...data
      }

      await updateBranch({ branchId, updated_data }).then(response => {
        if ('error' in response) {
          setErrors(response?.error?.data?.errors)

          return
        }

        toast.success(`Branch has been Updated`)
        reset({
          org_name: '',
          manager_name: '',
          phone_number: '',
          city: '',
          address: '',
          email: ''
        })
        setBranchId('')
        setIsModalOpen(false)
      })
    } else {
      await createBranch(data).then(response => {
        if ('error' in response) {
          setErrors(response?.error?.data?.errors)

          return
        }

        const { data } = response?.data

        toast.success(`${data.name} has been created`)
        reset({
          org_name: '',
          manager_name: '',
          phone_number: '',
          city: '',
          address: '',
          email: ''
        })
        setIsModalOpen(false)
      })
    }
  })

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
              placeholder='Search branches...'
              className='w-full max-w-md'
            />
            <Button onClick={handleShow} variant='contained' className='hidden md:flex'>
              <FaPlus fontSize={16} />
              <span>New Branch</span>
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
                  <>
                    {table.rows?.length > 0
                      ? 'No Record Found'
                      : table.getRowModel().rows.map(row => (
                        <tr key={row.id} className='hover:bg-gray-50'>
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className='p-3 border-b'>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </>
                ) : (
                  <td colSpan={table.getAllColumns().length}>
                    <div className='flex justify-center items-center py-5'>
                      <CircularProgress />
                    </div>
                  </td>
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

      {/* Modals remain the same as in your original code */}
      <Dialog open={!!BranchToBeDelete} onClose={() => setBranchToBeDelete(null)}>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Confirm Delete
          <IoMdClose className='cursor-pointer' onClick={() => setBranchToBeDelete(null)} />
        </DialogTitle>
        <DialogContent>
          You are about to delete <b>{BranchToBeDelete?.name}</b>. Would you like to proceed further ?
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={() => setBranchToBeDelete(null)}>
            No
          </Button>
          <Button loading={deleteBranchLoading} variant='contained' onClick={() => handleDeleteBranch()}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle className='font-bold flex items-center justify-between'>
          {isEditMode ? 'Edit Branch' : 'Add Branch'}
          <IoMdClose className='cursor-pointer' onClick={handleClose} />
        </DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2 mt-5'>
            <div>
              <MuiTextField
                control={control}
                size='md'
                label='Branch Name'
                id='org_name'
                name='org_name'
                placeholder='Enter Branch Name'
              />
            </div>
            <div>
              <MuiTextField
                control={control}
                size='md'
                label='Branch Manager Name'
                id='manager_name'
                name='manager_name'
                placeholder='Enter Branch Manager Name'
              />
            </div>

            <div>
              <MuiTextField
                type='email'
                control={control}
                size='md'
                label='Email'
                id='email'
                name='email'
                placeholder='branch@example.com'
              />
            </div>
            <div>
              <PhoneNumberInput control={control} name='phone_number' label='Phone Number' />
            </div>
            <div>
              <FormLabel title={'Address'} htmlFor='address'></FormLabel>
              <MuiTextField
                control={control}
                size='md'
                label='Address'
                id='address'
                name='address'
                placeholder='Enter Address'
              />
            </div>
            <div>
              <MuiDropdown
                control={control}
                name='city'
                size='md'
                id='city'
                label='City'
                options={cities.map(city => ({
                  label: city.label,
                  value: city.value
                }))}
                placeholder='Select City'
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <form method='dialog'>
            <Button variant='contained' loading={createLoading || branchLoading} onClick={() => onSubmit()}>
              {isEditMode ? 'Update' : 'Add'}
            </Button>
          </form>
        </DialogActions>
      </Dialog>

      {permissionList && (
        <PermissionModal
          isOpen={isPermissionModal}
          handleClose={() => {
            setIsPermissionModal(false)
            setPermissionList('')
            setSelectedPermissions('')
          }}
          control={control}
          permissionList={permissionList}
          selectedPermissions={selectedPermissions}
          onSubmit={handleSubmitPermissions}
          loading={permissionLoading}
        />
      )}

      {isChangePasswordModal && (
        <ChangePasswordModal
          isOpen={isChangePasswordModal}
          handleClose={() => {
            setIsChangePasswordModal(false)
          }}
          userUUid={userUUid}
        />
      )}

      {isAssignMarginModal &&
        <AssignedMarginModal
          isOpen={isAssignMarginModal}
          refetch={refetch}
          handleClose={() => {
            setIsAssignMarginModal(false)
          }}
          branchId={branchId}
        />
      }

    </>
  )
}

export { BranchTable }

