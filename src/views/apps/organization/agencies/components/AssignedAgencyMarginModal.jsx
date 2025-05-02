import { useEffect } from 'react'

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { Controller, useForm } from 'react-hook-form'

import { useToast } from '@/hooks/use-toast'
import { useAgenciesMarginsQuery, useAgencyMarginAssignMutation } from '@/redux-store/services/api'

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'

const AssignedAgencyMarginModal = ({ isOpen, refetch, handleClose, orgUUid }) => {
  const {
    data: agencyMarginData,
    isFetching: isFetchingBranch,
    refetch: refetchBranch
  } = useAgenciesMarginsQuery(orgUUid)

  const [assignMarginApiTrigger, { isLoading }] = useAgencyMarginAssignMutation(orgUUid)
  const toaster = useToast()

  useEffect(() => {
    refetchBranch()
  }, [])

  const initialValues = {
    agencyData:
      agencyMarginData?.map(data => ({
        branch_margin: data.branch_margin,
        branch_margin_type: data?.branch_margin_type,
        margin: data.margin || '',
        assigned: data?.assigned,
        margin_type: data.margin_type || '',
        margin_id: data?.margin_id
      })) || []
  }

  const {
    control: controlAssignModal,
    handleSubmit,
    reset,
    setError
  } = useForm({
    defaultValues: initialValues
  })

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const onSubmit = handleSubmit(async data => {
    await assignMarginApiTrigger({ orgUUid, data }).then(response => {
      if ('error' in response) {
        setErrors(response?.error.data?.errors)

        return
      }

      if (response.data?.code == 200) {
        toaster.success(response?.data?.message)
        refetch()
        handleClose()
      } else {
        setErrors(response?.data?.errors)
      }
    })
  })

  useEffect(() => {
    if (agencyMarginData?.length) {
      const initialValues = {
        agencyData: agencyMarginData.map(data => ({
          branch_margin: data.branch_margin,
          branch_margin_type: data?.branch_margin_type,
          margin: data.margin || '',
          assigned: data?.assigned,
          margin_type: data.margin_type || '',
          margin_id: data?.margin_id
        }))
      }

      reset(initialValues)
    }
  }, [agencyMarginData, reset])

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth='lg'>
      <DialogTitle className='font-bold flex items-center justify-between'>
        Assign Margin
        <IconButton aria-label='close' onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <div className='overflow-x-auto p-5'>
          <table className='w-full border-collapse'>
            <thead>
              <tr>
                <th className='text-left p-3 border-b'>ID</th>
                <th className='text-left p-3 border-b'>Name</th>
                <th className='text-left p-3 border-b'>Branch Margin</th>
                <th className='text-left p-3 border-b'>Branch Margin Type</th>
                <th className='text-left p-3 border-b'>Margin</th>
                <th className='text-left p-3 border-b'>Margin Type</th>
                <th className='text-left p-3 border-b'>Assigned</th>
              </tr>
            </thead>
            <tbody>
              {isFetchingBranch ? (
                <tr>
                  <td colSpan={7} className='p-3 border-b'>
                    <div className='flex justify-center items-center py-5'>
                      <CircularProgress />
                    </div>
                  </td>
                </tr>
              ) : agencyMarginData?.length ? (
                agencyMarginData.map((data, index) => (
                  <tr key={data.margin_id} className='hover:bg-gray-50'>
                    <td className='p-3 border-b'>{index + 1}</td>
                    <td className='p-3 border-b'>{data.margin_name}</td>
                    <td className='p-3 border-b'>
                      <MuiTextField
                        control={controlAssignModal}
                        size='small'
                        id={`branch-margin-${index}`}
                        name={`agencyData.${index}.branch_margin`}
                        placeholder='Branch Margin'
                        fullWidth
                        disabled
                      />
                    </td>
                    <td className='p-3 border-b'>
                      <MuiDropdown
                        control={controlAssignModal}
                        name={`agencyData.${index}.branch_margin_type`}
                        size='small'
                        id={`branch-margin-type-${index}`}
                        options={[
                          { label: 'Amount', value: 'amount' },
                          { label: 'Percentage', value: 'percentage' }
                        ]}
                        disabled
                      />
                    </td>
                    <td className='p-3 border-b'>
                      <MuiTextField
                        control={controlAssignModal}
                        size='small'
                        id={`margin-${index}`}
                        name={`agencyData.${index}.margin`}
                        placeholder='Enter Margin'
                        fullWidth
                      />
                    </td>
                    <td className='p-3 border-b'>
                      <MuiDropdown
                        control={controlAssignModal}
                        name={`agencyData.${index}.margin_type`}
                        size='small'
                        id={`margin-type-${index}`}
                        options={[
                          { label: 'Amount', value: 'amount' },
                          { label: 'Percentage', value: 'percentage' }
                        ]}
                      />
                    </td>
                    <td className='p-3 border-b'>
                      <Tooltip title='Assign Margin' placement='top'>
                        <div>
                          <Controller
                            name={`agencyData.${index}.assigned`}
                            control={controlAssignModal}
                            render={({ field }) => (
                              <FormControlLabel
                                control={<Switch {...field} checked={!!field.value} color='primary' />}
                              />
                            )}
                          />
                        </div>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className='p-3 border-b text-center'>
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onSubmit} variant='contained' disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssignedAgencyMarginModal
