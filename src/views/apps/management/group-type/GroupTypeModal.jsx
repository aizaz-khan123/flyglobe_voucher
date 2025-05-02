import { useEffect } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

import { useForm } from 'react-hook-form'

import { IoMdClose } from 'react-icons/io'

import { toast } from 'react-toastify'

import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { yesNoDropdown } from '@/data/dropdowns/DropdownValues'
import { useGroupTypeStoreMutation, useGroupTypeUpdateMutation } from '@/redux-store/services/api'

const GroupTypeModal = ({ open, onClose, groupTypeData, refetch }) => {
  const { control, handleSubmit, setError, reset, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      status: 1 // default empty value for status
    }
  })

  const uuid = groupTypeData?.uuid

  const [createGroupType, { isLoading }] = useGroupTypeStoreMutation()
  const [UpdateGroupType, { isLoading: isLoadingAirport }] = useGroupTypeUpdateMutation()

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const onSubmit = handleSubmit(async data => {
    if (!uuid) {
      await createGroupType(data).then(response => {
        if ('error' in response) {
          setErrors(response?.error.data?.errors)

          return
        }

        const { status, data: responseData } = response?.data

        if (status) {
          toast.success(`${responseData.name} has been created`)
          onClose()
          refetch()
        } else {
          setErrors(response?.data?.errors)
        }
      })
    } else {
      const updated_data = {
        _method: 'put',
        ...data
      }

      await UpdateGroupType({ uuid, updated_data }).then(response => {
        if ('error' in response) {
          setErrors(response?.error.data?.errors)

          return
        }

        if (response.data?.code == 200) {
          toast.success(response?.data?.message)
          refetch()
          onClose()
        } else {
          setErrors(response?.data?.errors)
        }
      })
    }
  })

  useEffect(() => {
    if (groupTypeData) {
      reset({
        name: groupTypeData.name,
        status: groupTypeData.status // make sure this sets the status correctly
      })
    } else {
      reset({
        name: '',
        status: 1 // reset empty status
      })
    }
  }, [groupTypeData, reset])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle className='font-bold flex items-center justify-between'>
        {uuid ? 'Update' : 'Add'} Group Type
        <IoMdClose className='cursor-pointer' onClick={onClose} />
      </DialogTitle>
      <DialogContent>
        <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
          <div>
            <MuiTextField
              control={control}
              label='Group Type'
              name='name'
              size='md'
              id='name'
              className='w-full border-0 text-base'
              placeholder='Group Type'
            />
          </div>
          <div>
            <MuiDropdown
              control={control}
              label='Status'
              name='status'
              size='md'
              id='status'
              className='w-full border-0 text-base'
              options={yesNoDropdown.map(data => ({
                label: data.label,
                value: data.value
              }))}
              placeholder='Status'
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant='contained' size='medium' onClick={onSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GroupTypeModal
