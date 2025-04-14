'use client'

import { useEffect } from 'react'

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Button, Card, CardContent, Dialog, DialogContent, DialogTitle, FormLabel, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'react-toastify'

import { IoMdClose } from 'react-icons/io'

import { useCreateAirportMutation, useShowAirportQuery, useUpdateAirportMutation } from '@/redux-store/services/api'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'

const CreateEditAirport = ({ open, onClose, airportId, isEdit, refetch }) => {
  const [createAirport, { isLoading }] = useCreateAirportMutation()

  const { control, handleSubmit, setError, reset } = useForm()

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const {
    data: airport,
    isSuccess: isAirportSuccess,
    error,
    isLoading: isShowLoading,
  } = useShowAirportQuery(airportId, {
    refetchOnMountOrArgChange: true,
    skip: !airportId
  })

  const [updateAirport, { isLoading: isLoadingAirport }] = useUpdateAirportMutation()

  const onSubmit = handleSubmit(async data => {
    if (!airportId) {
      await createAirport(data).then(response => {
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
    }
    else {
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
          onClose()
        } else {
          setErrors(response?.data?.errors)
        }
      })
    }

  })

  useEffect(() => {
    if (isAirportSuccess && airport && isEdit) {
      reset({
        name: airport.name,
        municipality: airport.municipality,
        iso_country: airport.iso_country,
        iata_code: airport.iata_code,
        country: airport?.country
      })
    }
    else{
      reset({
        name: '',
        municipality:'' ,
        iso_country:'' ,
        iata_code: '',
        country: ''
      })
    }
  }, [airport, isAirportSuccess, reset,isEdit])

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle className='font-bold flex items-center justify-between'>
        {isEdit === true ? 'Edit' : "Create"} Airport
        <IoMdClose className='cursor-pointer' onClick={onClose} />
      </DialogTitle>
      <DialogContent>
        <div className='grid grid-cols-1 gap-6'>
          <div>
            <Typography variant='h6' component='h2' gutterBottom>
              Airport Information
            </Typography>
            <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
              <div>
                <MuiTextField
                  fullWidth
                  control={control}
                  size='small'
                  label={'Airport Name'}
                  id='name'
                  name='name'
                  placeholder='Enter Airport Name'
                />
              </div>
              <div>
                <MuiTextField
                  fullWidth
                  control={control}
                  label={'ISO Country'}
                  size='small'
                  id='iso_country'
                  name='iso_country'
                  placeholder='Enter ISO Country'
                />
              </div>
              <div>
                <MuiTextField
                  fullWidth
                  control={control}
                  label={'Municipality'}
                  size='small'
                  id='municipality'
                  name='municipality'
                  placeholder='Enter Municipality'
                />
              </div>
              <div>
                <MuiTextField
                  fullWidth
                  control={control}
                  label={'IATA Code'}
                  size='small'
                  id='iata_code'
                  name='iata_code'
                  placeholder='Enter IATA Code'
                />
              </div>
              <div>
                <MuiTextField
                  fullWidth
                  control={control}
                  label={'Country'}
                  size='small'
                  id='country'
                  name='country'
                  placeholder='Enter Country Name'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='mt-6 flex justify-end gap-6'>
          <Button variant='outlined' size='medium' onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant='contained' size='medium' onClick={onSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { CreateEditAirport }
