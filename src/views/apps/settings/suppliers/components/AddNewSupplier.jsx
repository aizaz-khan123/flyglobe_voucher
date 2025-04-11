'use client'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch } from '@mui/material'
import { IoMdClose } from 'react-icons/io'

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { useCreateSupplierMutation } from '@/redux-store/services/api'

const AddNewSupplier = ({ open, onClose }) => {
  const [createSupplier, { isLoading }] = useCreateSupplierMutation()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
    register
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      status: false
    }
  })

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => {
      setError(key, {
        type: 'manual',
        message: value
      })
    })
  }

  const onSubmit = handleSubmit(async data => {
    try {
      const response = await createSupplier(data).unwrap()

      if (response.status) {
        reset()
        onClose()

        // Optionally redirect or refresh data
        // router.push("/suppliers");
      } else if (response.errors) {
        setErrors(response.errors)
      }
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors)
      }
    }
  })

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth='md'>
      <DialogTitle className='font-bold flex items-center justify-between'>
        Add New Supplier
        <IoMdClose className='cursor-pointer' onClick={handleCancel} style={{ fontSize: '1.5rem' }} />
      </DialogTitle>

      <DialogContent>
        <Box component='form' noValidate sx={{ mt: 2 }}>
          <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
            <MuiTextField
              {...register('name')}
              control={control}
              margin='normal'
              fullWidth
              label='Supplier Name'
              id='name'
              name='name'
              placeholder='Enter Supplier Name'
              error={!!errors.name}
              helperText={errors.name?.message}
              size='small'
            />

            <FormControlLabel
              control={<Switch {...register('status')} name='status' color='primary' />}
              label='Status'
              labelPlacement='start'
              sx={{ justifyContent: 'flex-start', ml: 0, mt: 2 }}
            />

            <MuiTextField
              {...register('description')}
              control={control}
              margin='normal'
              fullWidth
              multiline
              rows={4}
              label='Description'
              id='description'
              name='description'
              placeholder='Description'
              error={!!errors.description}
              helperText={errors.description?.message}
              className='col-span-1 md:col-span-2'
              size='small'
            />
          </div>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant='outlined' onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant='contained' onClick={onSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddNewSupplier
