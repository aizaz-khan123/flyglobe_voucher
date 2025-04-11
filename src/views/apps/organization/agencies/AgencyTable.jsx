'use client'

import { useState, useMemo, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// MUI Imports
import {
  Button,
  Card,
  CardContent,
  TablePagination,
  TextField,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  FormLabel,
  Switch,
  CircularProgress,
  DialogTitle,
  CardHeader,
  IconButton
} from '@mui/material'
import { FaCommentsDollar, FaLock, FaPencil, FaPlus, FaTrash } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IoMdClose } from 'react-icons/io'

// Component Imports
import { LoadingButton } from '@mui/lab'

import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import PhoneNumberInput from '@/components/reactPhoneInput/PhoneNumberInput'
import SearchInput from '@/components/searchInput/SearchInput'
import {
  useCreateAgencyMutation,
  useDeleteAgencyMutation,
  useGetAgenciesQuery,
  useAgencystatusUpdateMutation,
  usePermissionListByTypeMutation,
  useUpdateAgencyMutation,
  useBranchDropDownQuery,
  usePermissionUpdateMutation
} from '@/redux-store/services/api'
import PermissionModal from '../PermissionModal'
import ChangePasswordModal from '../branches/settings/ChangePasswordModal'
import GeneralSettingModal from './components/GeneralSettingModal'
import TemporaryLimitModal from './components/TemporaryLimitModal'
import { cities } from '@/data/dropdowns/cities'
import OptionMenu from '@/@core/components/option-menu'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const AgencyTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPermissionModal, setIsPermissionModal] = useState(false)
  const [isChangePasswordModal, setIsChangePasswordModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [agencyId, setAgencyId] = useState('')
  const [permissionList, setPermissionList] = useState()
  const [selectedPermissions, setSelectedPermissions] = useState()
  const [userUUid, setuserUUid] = useState()
  const [permissionListByTypeLoading, setPermissionListByTypeLoading] = useState(null)
  const [AgencyToBeDelete, setAgencyToBeDelete] = useState()
  const [isGeneralSettingModal, setIsGeneralSettingModal] = useState(false)
  const [generalSettingData, setGeneralSettingData] = useState()
  const [isTemporaryLimitModal, setIsTemporaryLimitModal] = useState(false)
  const [temporaryLimit, setTemporaryLimit] = useState()
  const [orgUUid, setOrgUUid] = useState()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // RTK Query
  const {
    data: detail_data,
    isFetching,
    refetch
  } = useGetAgenciesQuery({
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

  const { data: branchesDropDown } = useBranchDropDownQuery()
  const agencies = detail_data?.data || []
  const totalCount = detail_data?.total || 0

  // Mutations
  const [createAgency, { isLoading: createLoading }] = useCreateAgencyMutation()
  const [deleteAgency, { isLoading: deleteAgencyLoading }] = useDeleteAgencyMutation()
  const [updateAgency, { isLoading: agencyLoading }] = useUpdateAgencyMutation()
  const [updatePermissions, { isLoading: permissionLoading }] = usePermissionUpdateMutation()
  const [permissionListByType] = usePermissionListByTypeMutation()
  const [updateStatus] = useAgencystatusUpdateMutation()

  // Form control
  const agencySchema = z.object({
    name: z.string({ required_error: 'Agency Name Required!' }).min(5, 'Agency Name cannot be empty!'),
    org_id: z.number({ required_error: 'Branch ID is required!' }).min(1, 'Branch ID cannot be empty!'),
    phone_number: z
      .string({ required_error: 'Phone Number is Required!' })
      .regex(/^\+?\d{1,4}?[\d\s\-\(\)]{7,15}$/, 'Invalid phone number!'),
    city: z.string({ required_error: 'City is required!' }).min(1, 'City cannot be empty!'),
    address: z.string({ required_error: 'Address is required!' }).min(1, 'Address cannot be empty!'),
    email: z
      .string({ required_error: 'Email Required!' })
      .email({ message: 'Invalid email address!' })
      .min(1, 'Email is required!'),
    per_credit_limit: z
      .string({ required_error: 'Per Credit Limit is required!' })
      .min(1, 'Per Credit Limit must be at least 1!')
  })

  const { control, handleSubmit, setError, reset } = useForm({
    resolver: zodResolver(agencySchema)
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
        header: 'Agency Name',
        cell: ({ row }) => (
          <div className='flex items-center space-x-3 truncate'>
            <div className='font-medium'>{row.original.name}</div>
          </div>
        )
      }),
      columnHelper.accessor('parent.name', {
        header: 'Branch Name',
        cell: ({ row }) => row.original.parent?.name
      }),
      columnHelper.accessor('main_user.email', {
        header: 'Email',
        cell: ({ row }) => row.original.main_user?.email
      }),
      columnHelper.accessor('main_user.phone_number', {
        header: 'Phone Number',
        cell: ({ row }) => row.original.main_user?.phone_number
      }),
      columnHelper.accessor('main_user.last_login', {
        header: 'Last Login',
        cell: ({ row }) => row.original.main_user?.last_login
      }),
      columnHelper.accessor('org_wallet.per_credit_limit', {
        header: 'Permanent Limit',
        cell: ({ row }) => row.original.org_wallet?.per_credit_limit
      }),
      columnHelper.accessor('org_wallet.temp_credit_limit', {
        header: 'Temporary Limit',
        cell: ({ row }) => row.original.org_wallet?.temp_credit_limit || 0
      }),
      columnHelper.accessor('org_wallet.payable_amount', {
        header: 'Payable Amount',
        cell: ({ row }) => row.original.org_wallet?.payable_amount || 0
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
            <Tooltip title='Delete Agency' placement='top'>
              <IconButton size='small'>
                <FaTrash
                  className=' text-red-600 text-base'
                  onClick={event => {
                    event.stopPropagation()
                    showDeleteAgencyConfirmation(row.original.uuid)
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title='Update Agency' placement='top'>
              <IconButton size='small'>
                <FaPencil
                  className='cursor-pointer text-primary text-base'
                  onClick={event => {
                    event.stopPropagation()
                    showUpdateAgencyConfirmation(row.original)
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
                    text: 'General Setting',
                    menuItemProps: {
                      onClick: () => {
                        showGeneralSettingModal()
                        setGeneralSettingData(row.original.org_setting)
                        setOrgUUid(row.original.uuid)
                      }
                    }
                  },
                  {
                    text: 'Temporary Limit',
                    menuItemProps: {
                      onClick: () => {
                        showTemporaryLimitModal()
                        setTemporaryLimit(row.original.org_wallet)
                        setOrgUUid(row.original.uuid)
                      }
                    }
                  }
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
    data: agencies,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / 10),
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

  const showDeleteAgencyConfirmation = uuid => {
    setAgencyToBeDelete(agencies.find(b => uuid === b.uuid))
  }

  const handleDeleteAgency = async () => {
    if (AgencyToBeDelete) {
      deleteAgency(AgencyToBeDelete.uuid).then(response => {
        if (response?.data.code == 200) {
          toast.success(response?.data.message)
        } else {
          toast.error(response?.data.message)
        }
      })
    }
  }

  const showUpdateAgencyConfirmation = agency => {
    reset({
      name: agency.name,
      org_id: agency?.parent?.id,
      phone_number: agency?.main_user.phone_number,
      city: agency.city,
      address: agency.address,
      per_credit_limit: agency?.org_wallet.per_credit_limit.toString(),
      email: agency?.main_user.email
    })
    setAgencyId(agency.uuid)
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const showUpdatePermissionModal = async uuid => {
    setPermissionListByTypeLoading(uuid)
    const type = 'agency'

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

  const showGeneralSettingModal = async () => {
    setIsGeneralSettingModal(true)
  }

  const showTemporaryLimitModal = async () => {
    setIsTemporaryLimitModal(true)
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
      city: '',
      address: '',
      email: '',
      per_credit_limit: ''
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

      await updateAgency({ agencyId, updated_data }).then(response => {
        if ('error' in response) {
          setErrors(response?.error?.data?.errors)

          return
        }

        toast.success(`Agency has been Updated`)
        reset({
          name: '',
          phone_number: '',
          city: '',
          address: '',
          email: '',
          per_credit_limit: ''
        })
        setAgencyId('')
        setIsModalOpen(false)
      })
    } else {
      await createAgency(data).then(response => {
        if ('error' in response) {
          setErrors(response?.error?.data?.errors)

          return
        }

        toast.success(`${data.name} has been created`)
        reset({
          name: '',
          phone_number: '',
          city: '',
          address: '',
          email: '',
          per_credit_limit: ''
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
              placeholder='Search agencies...'
              className='w-full max-w-md'
            />
            <Button onClick={handleShow} variant='contained' className='hidden md:flex'>
              <FaPlus fontSize={16} />
              <span>New Agency</span>
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

      <Dialog open={!!AgencyToBeDelete} onClose={() => setAgencyToBeDelete(null)}>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Confirm Delete
          <IoMdClose className='cursor-pointer' onClick={() => setAgencyToBeDelete(null)} />
        </DialogTitle>
        <DialogContent>
          You are about to delete <b>{AgencyToBeDelete?.name}</b>. Would you like to proceed further ?
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={() => setAgencyToBeDelete(null)}>
            No
          </Button>
          <Button loading={deleteAgencyLoading} variant='contained' onClick={() => handleDeleteAgency()}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle className='font-bold flex items-center justify-between'>
          {isEditMode ? 'Edit Agency' : 'Add Agency'}
          <IoMdClose className='cursor-pointer' onClick={handleClose} />
        </DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2 mt-5'>
            <div>
              <MuiTextField
                control={control}
                size='md'
                label='Agency Name'
                id='name'
                name='name'
                placeholder='Enter Agency Name'
              />
            </div>
            <div>
              <MuiDropdown
                control={control}
                name='org_id'
                size='md'
                id='org_id'
                label='Branch'
                options={
                  branchesDropDown?.map(branch => ({
                    label: branch.name,
                    value: branch.id
                  })) || []
                }
                placeholder='Select Branch'
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
                placeholder='agency@example.com'
              />
            </div>
            <div>
              <PhoneNumberInput control={control} name='phone_number' label='Phone Number' />
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
            <div>
              <MuiTextField
                control={control}
                size='md'
                label='Permanent Limit'
                id='per_credit_limit'
                name='per_credit_limit'
                placeholder='Enter Permanent Limit'
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <LoadingButton variant='contained' loading={createLoading || agencyLoading} onClick={() => onSubmit()}>
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

      {isGeneralSettingModal && (
        <GeneralSettingModal
          isOpen={isGeneralSettingModal}
          handleClose={() => {
            setIsGeneralSettingModal(false)
          }}
          generalSettingData={generalSettingData}
          orgUUid={orgUUid}
          refetch={refetch}
        />
      )}

      {isTemporaryLimitModal && (
        <TemporaryLimitModal
          isOpen={isTemporaryLimitModal}
          handleClose={() => {
            setIsTemporaryLimitModal(false)
          }}
          temporaryLimit={temporaryLimit}
          orgUUid={orgUUid}
          refetch={refetch}
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
    </>
  )
}

export { AgencyTable }
