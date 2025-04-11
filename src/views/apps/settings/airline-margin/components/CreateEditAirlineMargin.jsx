'use client'

import { useEffect } from 'react'

import Select from 'react-select'
import { Controller, useForm } from 'react-hook-form'

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

import { IoMdClose } from 'react-icons/io'

import { toast } from 'react-toastify'

import {
  useAirlineDropDownQuery,
  useConnectorDropDownQuery,
  useCreateAirlineMarginMutation,
  useShowAirlineMarginQuery,
  useUpdateAirlineMarginMutation
} from '@/redux-store/services/api'

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'


const regionOptions = [
  { label: 'ALL-SECTORS', value: 'ALL-SECTORS' },
  { label: 'INTERLINE', value: 'INTERLINE' },
  { label: 'SOTO', value: 'SOTO' },
  { label: 'DOMESTIC', value: 'DOMESTIC' },
  { label: 'CODE-SHARE', value: 'CODE-SHARE' },
  { label: 'EX-PAKISTAN', value: 'EX-PAKISTAN' }
]

const CreateEditAirlineMargin = ({ open, isEdit, onClose, airlineMarginId,refetch }) => {
  // const toaster = useToast();
  const [createAirlineMargin, { isLoading }] = useCreateAirlineMarginMutation()

  const { data: airlineDropDown } = useAirlineDropDownQuery()
  const { data: connectorDropDown } = useConnectorDropDownQuery()

  const { control, handleSubmit, setError, reset } = useForm()

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const {
    data: airline_margin,
    isSuccess: isAirlineMarginSuccess,
    error,
    isLoading: isShowLoading,
  } = useShowAirlineMarginQuery(airlineMarginId, {
    refetchOnMountOrArgChange: true,
    skip: !airlineMarginId
  })

  const [updateAirlineMargin, { error: errorAirlineMargin, isLoading: isLoadingAirlineMargin }] =
    useUpdateAirlineMarginMutation()

  const onSubmit = handleSubmit(async data => {
    if (!airlineMarginId) {
      await createAirlineMargin(data).then(response => {
        if ('error' in response) {
          setErrors(response?.error.data?.errors)
          
return
        }

        const { status } = response?.data

        if (status) {
          toast.success(`Airline Margin has been created`)
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

      await updateAirlineMargin({ airlineMarginId, updated_data }).then(response => {
        if ('error' in response) {
          setErrors(response?.error.data?.errors)
          
return
        }

        if (response.data?.code == 200) {
          toast.success(response?.data?.message)
          onClose()
          refetch()
        } else {
          setErrors(response?.data?.errors)
        }
      })
    }
  })

  useEffect(() => {
    if (isAirlineMarginSuccess && airline_margin && isEdit === true) {
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
    else {
      reset({
        sales_channel: '',
        airline_id: '',
        region: '',
        margin: '',
        margin_type: "",
        sale_start_continue: "",
        sale_end_continue: "",
        travel_start_continue: "",
        travel_end_continue: "",
        rbds: "",
        remarks: "",
        is_apply_on_gross: false,
        status: false
      })
    }
  }, [airline_margin, isAirlineMarginSuccess, reset, isEdit, open])


  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
        <DialogTitle className='font-bold flex items-center justify-between'>
          {isEdit === true ? 'Edit' : 'Create'} Airline Margin
          <IoMdClose className='cursor-pointer' onClick={onClose} />
        </DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-1'>
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

                <div className='flex items-center gap-4 w-full'>
                  <div className='flex-1'>
                    <MuiTextField
                      className='w-full border-0 focus:outline-0'
                      control={control}
                      size='md'
                      id='margin'
                      name='margin'
                      placeholder='Enter Margin'
                      wrapperClassName='w-full'
                    />
                  </div>

                  <div className='flex-1'>
                    <MuiDropdown
                      control={control}
                      name='margin_type'
                      size='md'
                      id='margin_type'
                      className='w-full border-0 text-base'
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
                <Controller
                  name="is_apply_on_gross"
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
                      label="is_apply_on_gross"
                    />
                  )}
                />
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
                      label="status"
                    />
                  )}
                />
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant='contained' onClick={onSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export { CreateEditAirlineMargin }
