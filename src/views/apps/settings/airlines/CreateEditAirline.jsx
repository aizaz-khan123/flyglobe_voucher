'use client'

import { useEffect, useState } from 'react'

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
import { Controller, useForm } from 'react-hook-form'

import { toast } from 'react-toastify'

import { IoMdClose } from 'react-icons/io'

import { useCreateAirlineMutation, useGetCountryListQuery, useShowAirlineQuery, useUpdateAirlineMutation } from '@/redux-store/services/api'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'

import { MUIFileUploader } from './MuiUploader'

const CreateEditAirline = ({ open, onClose, airlineId, isEdit, refetch }) => {
  const [createAirline, { isLoading }] = useCreateAirlineMutation()
  const { data: countryDropDown } = useGetCountryListQuery()

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

  const [airlineImage, setAirlineImage] = useState()

  const {
    data: airline,
    isSuccess: isAirlineSuccess,
    error,
    isLoading: isShowLoading,
  } = useShowAirlineQuery(airlineId, {
    refetchOnMountOrArgChange: true,
    skip: !airlineId
  })

  const [updateAirline, { isLoading: isLoadingAirline }] = useUpdateAirlineMutation()

  const handleChangeImage = fileItems => {
    const file = fileItems[0]

    if (file) {
      const actualFile = file?.file ?? file

      setValue('thumbnail', actualFile)

      const previewUrl = URL.createObjectURL(actualFile)

      setAirlineImage([{ preview: previewUrl, file: actualFile }])
    } else {
      setValue('thumbnail', undefined)
      setAirlineImage([])
    }
  }

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'thumbnail' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    try {
      if (!airlineId) {
        const response = await createAirline(formData).unwrap();
        toast.success(`${response.data.name} has been created successfully`);
        onClose();
        refetch();
      } else {
        formData.append('_method', 'put');
        const response = await updateAirline({ airlineId, formData }).unwrap();
        toast.success(response.message);
        refetch();
        onClose();
      }
    } catch (error) {
      console.error("Caught error:", error);
      setErrors(error?.data?.errors || {});
    }
  });


  useEffect(() => {
    if (isAirlineSuccess && airline && isEdit === true) {
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
    else {
      reset({
        name: '',
        iata_code: '',
        issuing_pcc: '',
        tour_code: '',
        reserving_pcc: '',
        country_id: null,
        status: false
      })
      setAirlineImage('')
    }
  }, [airline, isAirlineSuccess, reset, open])

  const handleRemoveImage = () => {
    setValue('thumbnail', undefined)
    setAirlineImage([])
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
        <DialogTitle className='font-bold flex items-center justify-between'>
          {isEdit === true ? 'Edit' : "Create"} Airline Margin
          <IoMdClose className='cursor-pointer' onClick={onClose} />
        </DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
            <div>
              <h2 className='text-xl font-bold mb-4'>Airline Information</h2>
              <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
                <div>
                  <MuiTextField
                    className='w-full border-0 focus:outline-0'
                    control={control}
                    label='Airline Name'
                    size='md'
                    id='name'
                    name='name'
                    placeholder='Enter Airline Name'
                  />
                </div>
                <div>
                  <MuiTextField
                    className='w-full border-0 focus:outline-0'
                    control={control}
                    label='IATA Code'
                    size='md'
                    id='iata_code'
                    name='iata_code'
                    placeholder='Enter IATA Code'
                  />
                </div>
                <div>
                  {countryDropDown ? (
                    <MuiDropdown
                      control={control}
                      name='country_id'
                      label='Country'
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
                  <MuiTextField
                    className='w-full border-0 focus:outline-0'
                    control={control}
                    label='Reserving PCC'
                    size='md'
                    id='reserving_pcc'
                    name='reserving_pcc'
                    placeholder='Enter Reserving PCC'
                  />
                </div>
                <div>
                  <MuiTextField
                    className='w-full border-0 focus:outline-0'
                    control={control}
                    label='Issuing PCC'
                    size='md'
                    id='issuing_pcc'
                    name='issuing_pcc'
                    placeholder='Enter Issuing PCC'
                  />
                </div>
                <div>
                  <MuiTextField
                    className='w-full border-0 focus:outline-0'
                    control={control}
                    size='md'
                    label='Tour Code'
                    id='tour_code'
                    name='tour_code'
                    placeholder='Enter Tour Code'
                  />
                </div>
                <div>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={field.value}
                            color="primary"
                          />
                        }
                        label="Status"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className='text-xl font-bold mb-4'>Upload Airline Logo</h2>
              <div className='mt-1'>
                {/* <MUIFileUploader onFileChange={handleChangeImage} files={airlineImage} /> */}
                <MUIFileUploader
                  onFileChange={handleChangeImage}
                  preview={airlineImage?.[0]?.preview || airlineImage?.[0]?.source}
                  handleRemoveImage={handleRemoveImage}
                />
              </div>
            </div>
          </div>
          <div className='mt-6 flex justify-end gap-6'>
            <Button variant='outlined' onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant='contained' onClick={onSubmit}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { CreateEditAirline }
