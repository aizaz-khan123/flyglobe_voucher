'use client'

import React, { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { toast } from 'react-toastify'
import { Button, Card, CardContent, Dialog, DialogContent, DialogTitle, FormLabel, Typography } from '@mui/material'

import { IoMdClose } from 'react-icons/io'

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { useShowAirportQuery, useUpdateAirportMutation } from '@/redux-store/services/api'

const EditAirport = ({ airportId, open, onClose }) => {
  const {
    data: airport,
    isSuccess: isAirportSuccess,
    error,
    isLoading: isShowLoading,
    refetch
  } = useShowAirportQuery(airportId, {
    refetchOnMountOrArgChange: true
  })

  const [updateAirport, { isLoading: isLoadingAirport }] = useUpdateAirportMutation()

  const { control, handleSubmit, setError, reset } = useForm()

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (isAirportSuccess && airport) {
      reset({
        name: airport.name,
        municipality: airport.municipality,
        iso_country: airport.iso_country,
        iata_code: airport.iata_code,
        country: airport?.country
      })
    }
  }, [airport, isAirportSuccess, reset])

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const onSubmit = handleSubmit(async data => {
    const updated_data = {
      _method: 'put',
      ...data
    }

    await updateAirport({ airportId, updated_data }).then(response => {
      if ('error' in response) {
        setErrors(response?.error.data?.errors)
        
return
      }

      if (response.data?.code == 200) {
        toast.success(response?.data?.message)
        refetch()
        router.push(routes.apps.settings.airports)
      } else {
        setErrors(response?.data?.errors)
      }
    })
  })

  const handleCancel = () => {
    router.back()
  }

  if (isShowLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <span className='loading loading-spinner loading-lg'></span>
        <p className='ml-2'>Loading Airport details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-red-500'>
        <p>Error fetching Airport details.</p>
      </div>
    )
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Edit Airport
          <IoMdClose className='cursor-pointer' onClick={onClose} />
        </DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-1'>
            <Card className='bg-base-100'>
              <CardContent className='gap-0'>
                <Typography>Airport Information</Typography>
                <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
                  <div>
                    <FormLabel title={'Airport Name'} htmlFor='name'></FormLabel>
                    <MuiTextField
                      className='w-full border-0 focus:outline-0'
                      control={control}
                      size='md'
                      id='name'
                      name='name'
                      placeholder='Enter Airport Name'
                    />
                  </div>
                  <div>
                    <FormLabel title={'ISO Country'} htmlFor='iso_country'></FormLabel>
                    <MuiTextField
                      className='w-full border-0 focus:outline-0'
                      control={control}
                      size='md'
                      id='iso_country'
                      name='iso_country'
                      placeholder='Enter ISO Country'
                    />
                  </div>
                  <div>
                    <FormLabel title={'Municipality'} htmlFor='municipality'></FormLabel>
                    <MuiTextField
                      className='w-full border-0 focus:outline-0'
                      control={control}
                      size='md'
                      id='municipality'
                      name='municipality'
                      placeholder='Enter Municipality'
                    />
                  </div>
                  <div>
                    <FormLabel title={'IATA Code'} htmlFor='iata_code'></FormLabel>
                    <MuiTextField
                      className='w-full border-0 focus:outline-0'
                      control={control}
                      size='md'
                      id='iata_code'
                      name='iata_code'
                      placeholder='Enter IATA Code'
                    />
                  </div>
                  <div>
                    <FormLabel title={'Country'} htmlFor='country'></FormLabel>
                    <MuiTextField
                      className='w-full border-0 focus:outline-0'
                      control={control}
                      size='md'
                      id='country'
                      name='country'
                      placeholder='Enter Country Name'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='mt-5 flex justify-end gap-4'>
            <Button variant='outlined' size='medium' className='bg-base-content/10' onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant='contained'
              size='medium'
              onClick={onSubmit}

              //   startIcon={<Icon icon={arrowUpFromLineIcon} fontSize={18} />}
              loading={isLoadingAirport}
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { EditAirport }
