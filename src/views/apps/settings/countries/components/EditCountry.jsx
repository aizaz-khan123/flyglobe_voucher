'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress
} from '@mui/material'
import { IoMdClose } from 'react-icons/io'
// import { FaSave, FaTimes } from "react-icons/fa";

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { useShowCountryQuery, useUpdateCountryMutation } from '@/redux-store/services/api'
import { toast } from 'react-toastify'

const EditCountry = ({ open, onClose, countryId }) => {
  const {
    data: country,
    isSuccess: isCountrySuccess,
    error,
    isLoading: isShowLoading,
    refetch
  } = useShowCountryQuery(countryId, {
    refetchOnMountOrArgChange: true
  })

  const [updateCountry, { isLoading: isUpdating }] = useUpdateCountryMutation()

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

  useEffect(() => {
    if (open) {
      refetch()
    }
  }, [open, refetch])

  useEffect(() => {
    if (isCountrySuccess && country) {
      reset({
        name: country.name,
        nice_name: country.nice_name,
        iso: country.iso,
        iso3: country.iso3
      })
    }
  }, [country, isCountrySuccess, reset])

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
      const updatedData = {
        _method: 'put',
        ...data
      }

      const response = await updateCountry({ countryId, updated_data: updatedData }).unwrap()

      if (response?.code === 200) {
        toast.success(response?.message)
        onClose()
      } else if (response?.errors) {
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

  if (isShowLoading) {
    return (
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth='md'>
        <DialogContent>
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
            <CircularProgress />
            <Box ml={2}>Loading country details...</Box>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth='md'>
        <DialogContent>
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px' color='error.main'>
            Error fetching country details.
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth='md'>
      <DialogTitle className='font-bold flex items-center justify-between'>
        Edit Country
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
          disabled={isUpdating}
          //   startIcon={<FaTimes />}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={onSubmit}
          disabled={isUpdating}
          //   startIcon={<FaSave />}
        >
          {isUpdating ? <CircularProgress size={24} /> : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditCountry
