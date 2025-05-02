'use client'

import { useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IoMdClose } from 'react-icons/io'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Box,
  IconButton
} from '@mui/material'

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { useCreateCountryMutation, useUpdateCountryMutation, useShowCountryQuery } from '@/redux-store/services/api'

const countrySchema = z.object({
  name: z
    .string({ required_error: 'Country name is required' })
    .trim()
    .min(2, { message: 'Country name must be at least 2 characters' }),
  nice_name: z.string().optional(),
  iso: z
    .string({ required_error: 'ISO code is required' })
    .length(2, { message: 'ISO code must be exactly 2 characters' }),
  iso3: z
    .string({ required_error: 'ISO3 code is required' })
    .length(3, { message: 'ISO3 code must be exactly 3 characters' })
})

const CountryForm = ({ open, onClose, refetch, countryId }) => {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(countrySchema)
  })

  // Fetch country details if in edit mode
  const {
    data: countryDetails,
    isLoading: isDetailsLoading,
    isFetching
  } = useShowCountryQuery(countryId, {
    skip: !countryId,
    refetchOnMountOrArgChange: true
  })

  const [createCountry, { isLoading: isCreating }] = useCreateCountryMutation()
  const [updateCountry, { isLoading: isUpdating }] = useUpdateCountryMutation()

  useEffect(() => {
    if (open) {
      // Reset to default values when opening modal
      reset({
        name: '',
        nice_name: '',
        iso: '',
        iso3: ''
      })

      // Populate if in edit mode and data is available
      if (countryId && countryDetails) {
        reset({
          name: countryDetails.name || '',
          nice_name: countryDetails.nice_name || '',
          iso: countryDetails.iso || '',
          iso3: countryDetails.iso3 || ''
        })
      }
    }
  }, [open, countryId, countryDetails, reset])

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => {
      setError(key, { message: value })
    })
  }

  const onSubmit = handleSubmit(async data => {
    if (countryId) {
      // Edit existing country
      const updated_data = {
        _method: 'put',
        ...data
      }

      await updateCountry({
        countryId,
        updated_data
      }).then(response => {
        if ('error' in response) {
          setErrors(response?.error?.data?.errors)

          return
        }

        toast.success(response?.data?.message || 'Country updated successfully')
        refetch()
        onClose()
        reset()
      })
    } else {
      // Create new country
      await createCountry(data).then(response => {
        if ('error' in response) {
          setErrors(response?.error?.data?.errors)

          return
        }

        toast.success(response?.data?.message || 'Country created successfully')
        refetch()
        onClose()
        reset()
      })
    }
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  if (isDetailsLoading || isFetching) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4
            }}
          >
            <CircularProgress />
            <Box sx={{ ml: 2 }}>Loading country details...</Box>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
      <DialogTitle className='font-bold flex items-center justify-between'>
        {countryId ? 'Edit Country' : 'Add New Country'}
        <IconButton onClick={handleClose}>
          <IoMdClose style={{ fontSize: '1.5rem' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component='form' noValidate sx={{ mt: 2 }}>
          <div className='grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
            <MuiTextField
              control={control}
              label='Country Name'
              id='name'
              name='name'
              placeholder='Enter Country Name'
              error={!!errors.name}
              helperText={errors.name?.message}
              size='small'
              fullWidth
            />

            <MuiTextField
              control={control}
              label='Nice Name'
              id='nice_name'
              name='nice_name'
              placeholder='Enter Nice Name'
              error={!!errors.nice_name}
              helperText={errors.nice_name?.message}
              size='small'
              fullWidth
            />

            <MuiTextField
              control={control}
              label='ISO Code'
              id='iso'
              name='iso'
              placeholder='Enter 2-letter ISO code'
              error={!!errors.iso}
              helperText={errors.iso?.message}
              size='small'
              fullWidth
            />

            <MuiTextField
              control={control}
              label='ISO3 Code'
              id='iso3'
              name='iso3'
              placeholder='Enter 3-letter ISO3 code'
              error={!!errors.iso3}
              helperText={errors.iso3?.message}
              size='small'
              fullWidth
            />
          </div>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant='outlined' onClick={handleClose} disabled={isCreating || isUpdating}>
          Cancel
        </Button>
        <Button variant='contained' onClick={onSubmit} disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? <CircularProgress size={24} /> : countryId ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CountryForm
