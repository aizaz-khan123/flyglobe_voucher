'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
// import { FaCheck, FaTimes } from "react-icons/fa";

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { toast } from 'react-toastify'
import { useCreateCountryMutation } from '@/redux-store/services/api'

const CreateCountry = ({ open, onClose }) => {
  const router = useRouter()
  const [createCountry, { isLoading }] = useCreateCountryMutation()

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
      nice_name: '',
      iso: '',
      iso3: ''
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
      const response = await createCountry(data).unwrap()

      if (response.status) {
        toast.success(`${response.data.name} has been created`)
        reset()
        onClose()
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
        Create New Country
        <IconButton onClick={handleCancel}>
          <IoMdClose style={{ fontSize: '1.5rem' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component='form' noValidate sx={{ mt: 2 }}>
          <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
            <MuiTextField
              {...register('name')}
              control={control}
              margin='normal'
              fullWidth
              label='Country Name'
              id='name'
              name='name'
              placeholder='Enter Country Name'
              error={!!errors.name}
              helperText={errors.name?.message}
              size='small'
            />

            <MuiTextField
              {...register('nice_name')}
              control={control}
              margin='normal'
              fullWidth
              label='Nice Name'
              id='nice_name'
              name='nice_name'
              placeholder='Enter Nice Name'
              error={!!errors.nice_name}
              helperText={errors.nice_name?.message}
              size='small'
            />

            <MuiTextField
              {...register('iso')}
              control={control}
              margin='normal'
              fullWidth
              label='ISO'
              id='iso'
              name='iso'
              placeholder='Enter ISO'
              error={!!errors.iso}
              helperText={errors.iso?.message}
              size='small'
            />

            <MuiTextField
              {...register('iso3')}
              control={control}
              margin='normal'
              fullWidth
              label='ISO3'
              id='iso3'
              name='iso3'
              placeholder='Enter ISO3'
              error={!!errors.iso3}
              helperText={errors.iso3?.message}
              size='small'
            />
          </div>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant='outlined'
          onClick={handleCancel}
          disabled={isLoading}
          //   startIcon={<FaTimes />}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={onSubmit}
          disabled={isLoading}
          //   startIcon={<FaCheck />}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateCountry
