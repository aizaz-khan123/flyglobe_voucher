'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  useAirlineDropDownQuery,
  useConnectorDropDownQuery,
  useShowAirlineMarginQuery,
  useUpdateAirlineMarginMutation
} from '@/redux-store/services/api'
import Select from 'react-select'
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Switch
} from '@mui/material'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'

const regionOptions = [
  { label: 'ALL-SECTORS', value: 'ALL-SECTORS' },
  { label: 'INTERLINE', value: 'INTERLINE' },
  { label: 'SOTO', value: 'SOTO' },
  { label: 'DOMESTIC', value: 'DOMESTIC' },
  { label: 'CODE-SHARE', value: 'CODE-SHARE' },
  { label: 'EX-PAKISTAN', value: 'EX-PAKISTAN' }
]

const EditAirlineMargin = ({ airlineMarginId, onClose, open }) => {
  const { data: airlineDropDown } = useAirlineDropDownQuery()
  const { data: connectorDropDown } = useConnectorDropDownQuery()

  const {
    data: airline_margin,
    isSuccess: isAirlineMarginSuccess,
    error,
    isLoading: isShowLoading,
    refetch
  } = useShowAirlineMarginQuery(airlineMarginId, {
    refetchOnMountOrArgChange: true
  })

  const [updateAirlineMargin, { error: errorAirlineMargin, isLoading: isLoadingAirlineMargin }] =
    useUpdateAirlineMarginMutation()


  const { control, handleSubmit, setError, reset } = useForm({
    resolver: zodResolver()
  })

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (isAirlineMarginSuccess && airline_margin) {
      reset({
        sales_channel: airline_margin.sales_channel,
        airline_id: airline_margin.airline_id,
        region: airline_margin.region.split(', ').map(item => item.trim()),
        margin: airline_margin.margin.toString(),
        margin_type: airline_margin.margin_type,
        sale_start_continue: airline_margin.sale_start_continue,
        sale_end_continue: airline_margin.sale_end_continue,
        travel_start_continue: airline_margin.travel_start_continue,
        travel_end_continue: airline_margin.travel_end_continue,
        rbds: airline_margin.rbds,
        is_apply_on_gross: airline_margin.is_apply_on_gross,
        status: airline_margin.status,
        remarks: airline_margin.remarks
      })
    }
  }, [airline_margin, isAirlineMarginSuccess, reset])

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const onSubmit = handleSubmit(async data => {
    const updated_data = {
      _method: 'put',
      ...data
    }

    await updateAirlineMargin({ airlineMarginId, updated_data }).then(response => {
      if ('error' in response) {
        setErrors(response?.error.data?.errors)
        return
      }
      if (response.data?.code == 200) {
        toast.success(response?.data?.message)
        refetch()
        router.push(routes.apps.settings.airline_margins)
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
        <p className='ml-2'>Loading airline margin details...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-red-500'>
        <p>Error fetching Airline Margin details.</p>
      </div>
    )
  }
  
  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Edit Airline Margin
          <IoMdClose className='cursor-pointer' onClick={onClose} />
        </DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-1'>
            <Card className='bg-base-100'>
              <CardContent className='gap-0'>
                <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
                  <div>
                    <FormLabel title={'Sales Channel'} htmlFor='sales_channel'></FormLabel>
                    {connectorDropDown ? (
                      <MuiDropdown
                        control={control}
                        name='sales_channel'
                        size='md'
                        id='sales_channel'
                        className='w-full border-0 text-base'
                        options={connectorDropDown.map(connector => ({
                          label: connector.name,
                          value: connector.name
                        }))}
                        placeholder='Select Sales Channel'
                      />
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                  <div>
                    <FormLabel title={'Airline'} htmlFor='airline_id'></FormLabel>
                    {airlineDropDown ? (
                      <MuiDropdown
                        control={control}
                        name='airline_id'
                        size='md'
                        id='airline_id'
                        className='w-full border-0 text-base'
                        options={airlineDropDown.map(airline => ({
                          label: airline.name,
                          value: airline.id
                        }))}
                        placeholder='Select Airline'
                      />
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                  <div>
                    <FormLabel title={'Region'} htmlFor='region' />
                    <Controller
                      name='region'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={regionOptions}
                          isMulti
                          className='w-full border-0 focus:outline-0 customMultiselect'
                          placeholder='Select Regions'
                          getOptionLabel={e => e.label}
                          getOptionValue={e => e.value}
                          value={regionOptions.filter(option => field.value?.includes(option.value))}
                          onChange={selectedOptions =>
                            field.onChange(selectedOptions ? selectedOptions.map(option => option.value) : [])
                          }
                        />
                      )}
                    />
                  </div>

                  <div>
                    <FormLabel title={'Margin'} htmlFor='margin'></FormLabel>
                    <div className='flex items-center gap-4'>
                      <MuiTextField
                        className='w-64 border-0 focus:outline-0'
                        control={control}
                        size='md'
                        id='margin'
                        name='margin'
                        placeholder='Enter Margin'
                        wrapperClassName='w-[29rem]'
                      />

                      <MuiDropdown
                        control={control}
                        name='margin_type'
                        size='md'
                        id='margin_type'
                        className='w-full border-0 text-base w-[18rem]'
                        options={[
                          { id: 'amount', name: 'Amount' },
                          { id: 'percentage', name: 'Percentage' }
                        ].map(connector => ({
                          label: connector.name,
                          value: connector.id
                        }))}
                      />
                    </div>
                  </div>

                  <div>
                    <FormLabel title={'Sale starts and Continues'} htmlFor='sale_start_continue'></FormLabel>
                    <MuiTextField
                      type='date'
                      className='w-full border-0 focus:outline-0'
                      control={control}
                      size='md'
                      id='sale_start_continue'
                      name='sale_start_continue'
                    />
                  </div>

                  <div>
                    <FormLabel title={'Sale ends on this date'} htmlFor='sale_end_continue'></FormLabel>
                    <MuiTextField
                      type='date'
                      className='w-full border-0 focus:outline-0'
                      control={control}
                      size='md'
                      id='sale_end_continue'
                      name='sale_end_continue'
                    />
                  </div>

                  <div>
                    <FormLabel title={'Travel starts and Continues'} htmlFor='travel_start_continue'></FormLabel>
                    <MuiTextField
                      type='date'
                      className='w-full border-0 focus:outline-0'
                      control={control}
                      size='md'
                      id='travel_start_continue'
                      name='travel_start_continue'
                    />
                  </div>

                  <div>
                    <FormLabel title={'Travel ends on this date'} htmlFor='travel_end_continue'></FormLabel>
                    <MuiTextField
                      type='date'
                      className='w-full border-0 focus:outline-0'
                      control={control}
                      size='md'
                      id='travel_end_continue'
                      name='travel_end_continue'
                    />
                  </div>

                  <div>
                    <FormLabel title={'Rbds'} htmlFor='rbds'></FormLabel>
                    <MuiTextField
                      className='w-full border-0 focus:outline-0'
                      control={control}
                      size='md'
                      id='rbds'
                      name='rbds'
                      placeholder='Enter Rbds'
                    />
                  </div>

                  <div>
                    <FormControlLabel
                      control={<Switch name='is_apply_on_gross' color='primary' />}
                      label='is_apply_on_gross'
                    />
                    <FormControlLabel control={<Switch name='status' color='primary' />} label='status' />
                  </div>

                  <div className='col-span-1 md:col-span-2'>
                    <FormLabel title={'Remarks'} htmlFor='remarks'></FormLabel>
                    <MuiTextField
                      className='w-full border-0 px-0 focus:outline-0'
                      control={control}
                      size={'md'}
                      id='remarks'
                      name={'remarks'}
                      placeholder='Remarks'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={onClose} disabled={isLoadingAirlineMargin}>
            Cancel
          </Button>
          <Button variant='contained' onClick={onSubmit} disabled={isLoadingAirlineMargin}>
            {isLoadingAirlineMargin ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export { EditAirlineMargin }
