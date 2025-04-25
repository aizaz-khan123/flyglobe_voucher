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
  IconButton,
  Switch,
  TablePagination,
  TextField,
  Tooltip
} from '@mui/material'
import { FaPencil, FaPlus, FaTrash } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'
import { z } from 'zod'

// Component Imports
import { LoadingButton } from '@mui/lab'

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import PhoneNumberInput from '@/components/reactPhoneInput/PhoneNumberInput'
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useEmployeeStatusUpdateMutation,
  useGetEmployeesQuery,
  usePermissionListByTypeMutation,
  usePermissionUpdateMutation,
  useUpdateEmployeeMutation
} from '@/redux-store/services/api'
import tableStyles from '@core/styles/table.module.css'
import classNames from 'classnames'
import PermissionModal from '../PermissionModal'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const EmployeeTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPermissionModal, setIsPermissionModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [employeeId, setEmployeeId] = useState('')
  const [permissionList, setPermissionList] = useState()
  const [selectedPermissions, setSelectedPermissions] = useState()
  const [userUUid, setuserUUid] = useState()
  const [permissionListByTypeLoading, setPermissionListByTypeLoading] = useState(null)
  const [EmployeeToBeDelete, setEmployeeToBeDelete] = useState()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // RTK Query
  const {
    data: detail_data,
    isFetching,
    refetch
  } = useGetEmployeesQuery({
    page: page + 1,
    pageSize: rowsPerPage,
    searchText: globalFilter
  })

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const employees = detail_data?.data || []
  const totalCount = detail_data?.total || 0

  // Mutations
  const [createEmployee, { isLoading: createLoading }] = useCreateEmployeeMutation()
  const [deleteEmployee, { isLoading: deleteEmployeeLoading }] = useDeleteEmployeeMutation()
  const [updateEmployee, { isLoading: employeeLoading }] = useUpdateEmployeeMutation()
  const [updatePermissions, { isLoading: permissionLoading }] = usePermissionUpdateMutation()
  const [permissionListByType] = usePermissionListByTypeMutation()
  const [updateStatus] = useEmployeeStatusUpdateMutation()

  // Form control
  const employeeSchema = z.object({
    name: z.string({ required_error: 'Employee Name Required!' }).min(5, 'Employee Name cannot be empty!'),
    phone_number: z
      .string({ required_error: 'Phone Number is Required!' })
      .regex(/^\+?\d{1,4}?[\d\s\-\(\)]{7,15}$/, 'Invalid phone number!'),
    address: z.string({ required_error: 'Address is required!' }).min(1, 'Address cannot be empty!'),
    email: z
      .string({ required_error: 'Email Required!' })
      .email({ message: 'Invalid email address!' })
      .min(1, 'Email is required!')
  })

  const { control, handleSubmit, setError, reset } = useForm({
    resolver: zodResolver(employeeSchema)
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
        header: 'Name',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            <div className='font-medium'>{row.original.name}</div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => row.original.email
      }),
      columnHelper.accessor('phone_number', {
        header: 'Phone Number',
        cell: ({ row }) => row.original.phone_number
      }),
      columnHelper.accessor('last_login', {
        header: 'Last Login',
        cell: ({ row }) => row.original.last_login
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Tooltip title='Change Status' placement='top'>
            <Switch
              defaultChecked={row.original.status == '1' ? true : false}
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
              showUpdatePermissionModal(row.original.uuid)
            }}
          >
            {permissionListByTypeLoading === row.original.uuid ? 'Loading...' : 'Update Permission'}
          </Button>
        )
      }),
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center w-fit gap-2'>
            <Tooltip title='Delete Employee' placement='top'>
              <IconButton size='small'>
                <FaTrash
                  className=' text-red-600 text-base'
                  onClick={event => {
                    event.stopPropagation()
                    showDeleteEmployeeConfirmation(row.original.uuid)
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title='Update Employee' placement='top'>
              <IconButton size='small'>
                <FaPencil
                  className='cursor-pointer text-primary text-base'
                  onClick={event => {
                    event.stopPropagation()
                    showUpdateEmployeeConfirmation(row.original)
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    ],
    [permissionListByTypeLoading]
  )

  const table = useReactTable({
    data: employees,
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

  const handleStatusChange = uuid => {
    const body = {
      _method: 'patch'
    }

    updateStatus({ uuid, body }).then(response => {
      toast.success('Status Changed!')
    })
  }

  const showDeleteEmployeeConfirmation = uuid => {
    setEmployeeToBeDelete(employees.find(b => uuid === b.uuid))
  }

  const handleDeleteEmployee = async () => {
    if (EmployeeToBeDelete) {
      deleteEmployee(EmployeeToBeDelete.uuid).then(response => {
        if (response?.data.code == 200) {
          toast.success(response?.data.message)
        } else {
          toast.error(response?.data.message)
        }
      })
    }
  }

  const showUpdateEmployeeConfirmation = employee => {
    reset({
      name: employee.name,
      phone_number: employee.phone_number,
      address: employee.address,
      email: employee.email
    })
    setEmployeeId(employee.uuid)
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const showUpdatePermissionModal = async uuid => {
    setPermissionListByTypeLoading(uuid)
    const type = 'h-employee'

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

  const handleShow = () => {
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    reset({
      name: '',
      phone_number: '',
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

      await updateEmployee({ employeeId, updated_data }).then(response => {
        if ('error' in response) {
          setErrors(response?.error?.data?.errors)

          return
        }

        toast.success(`Employee has been Updated`)
        reset({
          name: '',
          phone_number: '',
          address: '',
          email: ''
        })
        setEmployeeId('')
        setIsModalOpen(false)
      })
    } else {
      await createEmployee(data).then(response => {
        if ('error' in response) {
          setErrors(response?.error?.data?.errors)

          return
        }

        toast.success(`${data.name} has been created`)
        reset({
          name: '',
          phone_number: '',
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
              placeholder='Search employees...'
              className='w-full max-w-md'
            />
            <Button onClick={handleShow} variant='contained' className='hidden md:flex'>
              <FaPlus fontSize={16} />
              <span>New Employee</span>
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

      <Dialog open={!!EmployeeToBeDelete} onClose={() => setEmployeeToBeDelete(null)}>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Confirm Delete
          <IoMdClose className='cursor-pointer' onClick={() => setEmployeeToBeDelete(null)} />
        </DialogTitle>
        <DialogContent>
          You are about to delete <b>{EmployeeToBeDelete?.name}</b>. Would you like to proceed further ?
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={() => setEmployeeToBeDelete(null)}>
            No
          </Button>
          <Button loading={deleteEmployeeLoading} variant='contained' onClick={() => handleDeleteEmployee()}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle className='font-bold flex items-center justify-between'>
          {isEditMode ? 'Edit Employee' : 'Add Employee'}
          <IoMdClose className='cursor-pointer' onClick={handleClose} />
        </DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2 mt-5'>
            <div>
              <MuiTextField
                control={control}
                size='md'
                label='Employee Name'
                id='name'
                name='name'
                placeholder='Enter Employee Name'
              />
            </div>
            <div>
              <PhoneNumberInput control={control} name='phone_number' label='Phone Number' />
            </div>
            <div>
              <MuiTextField
                type='email'
                control={control}
                size='md'
                label='Email'
                id='email'
                name='email'
                placeholder='employee@example.com'
              />
            </div>
            <div>
              <MuiTextField
                control={control}
                size='md'
                label='Address'
                id='address'
                name='address'
                placeholder='Enter Address'
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <LoadingButton variant='contained' loading={createLoading || employeeLoading} onClick={() => onSubmit()}>
            {isEditMode ? 'Update' : 'Add'}
          </LoadingButton>
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
    </>
  )
}

export { EmployeeTable }

