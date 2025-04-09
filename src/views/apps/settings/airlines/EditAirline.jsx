'use client'

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Switch,
  Typography,
  CircularProgress
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetCountryListQuery, useShowAirlineQuery, useUpdateAirlineMutation } from '@/redux-store/services/api'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import MUIFileUploader from './MuiUploader'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'

const EditAirline = ({ airlineId, open, onClose }) => {
  const [airlineImage, setAirlineImage] = useState()

  const {
    data: airline,
    isSuccess: isAirlineSuccess,
    error,
    isLoading: isShowLoading,
    refetch
  } = useShowAirlineQuery(airlineId, {
    refetchOnMountOrArgChange: true
  })

  const { data: countryDropDown } = useGetCountryListQuery()
  const [updateAirline, { isLoading: isLoadingAirline }] = useUpdateAirlineMutation()

  const { control, handleSubmit, setError, setValue, reset } = useForm({
    defaultValues: {
      name: '',
      iata_code: '',
      issuing_pcc: '',
      tour_code: '',
      reserving_pcc: '',
      status: false,
      thumbnail: undefined
    }
  })

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (isAirlineSuccess && airline) {
      reset({
        name: airline.name || '',
        iata_code: airline.iata_code || '',
        issuing_pcc: airline.issuing_pcc || '',
        tour_code: airline.tour_code || '',
        reserving_pcc: airline.reserving_pcc || '',
        country_id: airline.country_id,
        status: airline.status
      })

      if (airline.thumbnail) {
        setAirlineImage([{ source: airline.thumbnail, options: { type: 'local' } }])
      }
    }
  }, [airline, isAirlineSuccess, reset])

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const handleChangeImage = fileItems => {
    if (fileItems.length > 0) {
      const fileItem = fileItems[0]
      const file = new File([fileItem.file], fileItem.file.name, {
        type: fileItem.file.type,
        lastModified: fileItem.file.lastModified
      })
      setValue('thumbnail', file)
    } else {
      setValue('thumbnail', undefined)
    }
  }

  const onSubmit = handleSubmit(async data => {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'thumbnail' && value instanceof File) {
        formData.append(key, value)
      } else {
        formData.append(key, value)
      }
    })
    formData.append('_method', 'put')

    await updateAirline({ airlineId, formData }).then(response => {
      if ('error' in response) {
        setErrors(response?.error.data?.errors)
        return
      }

      if (response.data?.code == 200) {
        toast.success(response?.data?.message)
        refetch()
        router.push(routes.apps.settings.airlines)
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
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
        <DialogContent>
          <Box display='flex' alignItems='center' justifyContent='center' height={200}>
            <CircularProgress />
            <Typography variant='body1' ml={2}>
              Loading Airline details...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
        <DialogContent>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            height={200}
            color='error.main'
          >
            <Typography variant='body1'>Error fetching Airline details.</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle className='font-bold flex items-center justify-between'>
        Edit Airline
        <IoMdClose className='cursor-pointer' onClick={onClose} />
      </DialogTitle>
      <DialogContent>
        <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
          <Card>
            <CardContent>
              <Typography variant='h6' className='font-bold mb-4'>
                Airline Information
              </Typography>
              <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
                <div>
                  <FormLabel title={'Airline Name'} htmlFor='name'></FormLabel>
                  <MuiTextField
                    className='w-full border-0 focus:outline-0'
                    control={control}
                    size='md'
                    id='name'
                    name='name'
                    placeholder='Enter Airline Name'
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
                  <FormLabel title='Country' htmlFor='country_id' />
                  {countryDropDown ? (
                    <MuiDropdown
                      control={control}
                      name='country_id'
                      size='md'
                      id='country_id'
                      className='w-full border-0 text-base'
                      options={countryDropDown.map(country => ({
                        label: country.name,
                        value: country.id
                      }))}
                      placeholder='Select Country'
                    />
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>

                <div>
                  <FormLabel title={'Reserving PCC'} htmlFor='reserving_pcc'></FormLabel>
                  <MuiTextField
                    className='w-full border-0 focus:outline-0'
                    control={control}
                    size='md'
                    id='reserving_pcc'
                    name='reserving_pcc'
                    placeholder='Enter Reserving PCC'
                  />
                </div>
                <div>
                  <FormLabel title={'Issuing PCC'} htmlFor='issuing_pcc'></FormLabel>
                  <MuiTextField
                    className='w-full border-0 focus:outline-0'
                    control={control}
                    size='md'
                    id='issuing_pcc'
                    name='issuing_pcc'
                    placeholder='Enter Issuing PCC'
                  />
                </div>
                <div>
                  <FormLabel title={'Tour Code'} htmlFor='tour_code'></FormLabel>
                  <MuiTextField
                    className='w-full border-0 focus:outline-0'
                    control={control}
                    size='md'
                    id='tour_code'
                    name='tour_code'
                    placeholder='Enter Tour Code'
                  />
                </div>
                <div>
                  <FormControlLabel
                    control={<Switch control={control} name='status' color='primary' />}
                    label='Status'
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant='h6' className='font-bold mb-4'>
                Upload Airline Logo
              </Typography>
              <div className='mt-1'>
                <MUIFileUploader onFileChange={handleChangeImage} files={airlineImage} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='mt-6 flex justify-end gap-6'>
          <Button variant='outlined' onClick={handleCancel} disabled={isLoadingAirline}>
            Cancel
          </Button>
          <Button variant='contained' onClick={onSubmit} disabled={isLoadingAirline}>
            {isLoadingAirline ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { EditAirline }
