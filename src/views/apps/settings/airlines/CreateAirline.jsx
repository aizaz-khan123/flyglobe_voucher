'use client'

import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Switch,
  Typography
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useCreateAirlineMutation, useGetCountryListQuery } from '@/redux-store/services/api'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import MUIFileUploader from './MuiUploader'
import { toast } from 'react-toastify'
import { IoMdClose } from 'react-icons/io'

const CreateAirline = ({ open, onClose }) => {
  const [createAirline, { isLoading }] = useCreateAirlineMutation()
  const { data: countryDropDown } = useGetCountryListQuery()

  const { control, handleSubmit, setError, setValue } = useForm({
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
  //   const handleChangeImage = (files) => {
  //     if (files && files.length > 0) {
  //       const file = files[0];
  //       setValue('thumbnail', file); // Save in react-hook-form
  //     } else {
  //       setValue('thumbnail', undefined);
  //     }
  //   };

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
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

    await createAirline(formData).then(response => {
      if ('error' in response) {
        setErrors(response?.error.data?.errors)
        return
      }

      const { status, data } = response?.data
      if (status) {
        toast.success(`${data.name} has been created`)
        router.push(routes.apps.settings.airlines)
      } else {
        setErrors(response?.data?.errors)
      }
    })
  })

  const handleCancel = () => {
    router.back()
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Create Airline Margin
          <IoMdClose className='cursor-pointer' onClick={onClose} />
        </DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
            <Card>
              <CardContent>
                <h2 className='text-xl font-bold mb-4'>Airline Information</h2>
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
                <h2 className='text-xl font-bold mb-4'>Upload Airline Logo</h2>
                <div className='mt-1'>
                  <MUIFileUploader onFileChange={handleChangeImage} />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='mt-6 flex justify-end gap-6'>
            <Button variant='outlined' onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant='contained' onClick={onSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { CreateAirline }
