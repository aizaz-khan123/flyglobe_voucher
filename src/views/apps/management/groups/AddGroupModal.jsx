import React, { useEffect } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

import dayjs from 'dayjs'

import { useFieldArray, useForm, useWatch } from 'react-hook-form'

import { IoMdClose } from 'react-icons/io'

import { toast } from 'react-toastify'

import MuiAutocomplete from '@/components/mui-form-inputs/MuiAutoComplete'
import MuiDatePicker from '@/components/mui-form-inputs/MuiDatePicker'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import MuiTextarea from '@/components/mui-form-inputs/MuiTextarea'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import MuiTimePicker from '@/components/mui-form-inputs/MuiTimePicker'
import { gender, groupsStatus, yesNoDropdown } from '@/data/dropdowns/DropdownValues'
import {
  useAirlineDropDownQuery,
  useGroupTypeDropdownQuery,
  useManagementGroupStoreMutation,
  useManagementGroupUpdateMutation
} from '@/redux-store/services/api'

const AddGroupModal = ({ open, onClose, refetch, groupDataByID }) => {
  const [createGroups, { isLoading }] = useManagementGroupStoreMutation()
  const [updateGroups, { isLoading: isLoadingAirport }] = useManagementGroupUpdateMutation()

  const { data: airlineDropdown } = useAirlineDropDownQuery()
  const { data: groupTypeDropdown } = useGroupTypeDropdownQuery()

  const { control, handleSubmit, setError, reset } = useForm({
    defaultValues: {
      sector: '',
      airline_id: '',
      group_type_id: '',
      status: '',
      purchased_price: '',
      adult_price: '',
      adult_price_call: 0,
      cnn_price: '',
      cnn_price_call: 0,
      inf_price: '',
      inf_price_call: 0,
      baggage: '',
      meal: '',
      pnr: '',
      total_seats: '',
      rules: '',
      flights: [
        {
          flight_number: '',
          departure_date: null,
          departure_time: '',
          departure_city: '',
          arrival_date: null,
          arrival_time: '',
          arrival_city: ''
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'flights'
  })

  const flights = useWatch({
    control,
    name: 'flights'
  })

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const uuid = groupDataByID?.uuid

  const onSubmit = handleSubmit(async data => {
    if (!uuid) {
      await createGroups(data).then(response => {
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
    } else {
      const updated_data = {
        _method: 'put',
        ...data
      }

      await updateGroups({ uuid, updated_data }).then(response => {
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
    if (groupDataByID) {
      reset({
        sector: groupDataByID?.sector || '',
        airline_id: groupDataByID?.airline_id || '',
        group_type_id: groupDataByID?.group_type_id || '',
        status: groupDataByID?.status ?? '',
        purchased_price: groupDataByID?.purchased_price || '',
        adult_price: groupDataByID?.adult_price || '',
        adult_price_call: groupDataByID?.adult_price_call ?? 0,
        cnn_price: groupDataByID?.cnn_price || '',
        cnn_price_call: groupDataByID?.cnn_price_call ?? 0,
        inf_price: groupDataByID?.inf_price || '',
        inf_price_call: groupDataByID?.inf_price_call ?? 0,
        baggage: groupDataByID?.baggage || '',
        meal: groupDataByID?.meal || '',
        pnr: groupDataByID?.pnr || '',
        total_seats: groupDataByID?.total_seats || '',
        rules: groupDataByID?.rules || '',
        flights: groupDataByID?.flights?.map(flight => ({
          flight_number: flight.flight_number || '',
          departure_date: flight.departure_date ? flight.departure_date : null,
          departure_time: flight.departure_time || '',
          departure_city: flight.departure_city || '',
          arrival_date: flight.arrival_date ? flight.arrival_date : null,
          arrival_time: flight.arrival_time || '',
          arrival_city: flight.arrival_city || ''
        })) || [
          {
            flight_number: '',
            departure_date: null,
            departure_time: '',
            departure_city: '',
            arrival_date: null,
            arrival_time: '',
            arrival_city: ''
          }
        ]
      })
    } else {
      reset({
        sector: '',
        airline_id: '',
        group_type_id: '',
        status: '',
        purchased_price: '',
        adult_price: '',
        adult_price_call: false,
        cnn_price: '',
        cnn_price_call: false,
        inf_price: '',
        inf_price_call: false,
        baggage: '',
        meal: '',
        pnr: '',
        total_seats: '',
        rules: '',
        flights: [
          {
            flight_number: '',
            departure_date: null,
            departure_time: '',
            departure_city: '',
            arrival_date: null,
            arrival_time: '',
            arrival_city: ''
          }
        ]
      })
    }
  }, [groupDataByID, reset])

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
        <DialogTitle className='font-bold flex items-center justify-between'>
          {uuid ? 'Update' : 'Add'} Group Flight
          <IoMdClose className='cursor-pointer' onClick={onClose} />
        </DialogTitle>
        <DialogContent>
          <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-3'>
            <div>
              <MuiTextField
                control={control}
                label='Sector'
                name='sector'
                size='md'
                id='sector'
                className='w-full border-0 text-base'
                options={gender.map(data => ({
                  label: data.label,
                  value: data.label
                }))}
                placeholder='Enter Sector'
              />
            </div>
            <div>
              <MuiAutocomplete
                control={control}
                label='Airline'
                name='airline_id'
                size='md'
                id='airline_id'
                className='w-full border-0 text-base'
                options={airlineDropdown?.map(data => ({
                  value: data.id,
                  label: data.name
                }))}
                placeholder='Airline'
              />
            </div>
            <div>
              <MuiDropdown
                control={control}
                label='Group Type'
                name='group_type_id'
                size='md'
                id='group_type_id'
                options={groupTypeDropdown?.map(data => ({
                  label: data.name,
                  value: data.id
                }))}
                placeholder='Group Type'
              />
            </div>
            <div>
              <MuiDropdown
                control={control}
                label='Status'
                name='status'
                size='md'
                id='status'
                className='w-full border-0 text-base'
                options={groupsStatus.map(data => ({
                  label: data.label,
                  value: data.value
                }))}
                placeholder='Status'
              />
            </div>

            <div>
              <MuiTextField
                type='text'
                control={control}
                label={'Purchased Price'}
                size='md'
                id='purchased_price'
                name='purchased_price'
                placeholder='Enter Purchased Price'
              />
            </div>
            <div>
              <MuiTextField
                type='text'
                control={control}
                label={'Adult Price'}
                size='md'
                id='adult_price'
                name='adult_price'
                placeholder='Enter Adult Price'
              />
            </div>

            <div>
              <MuiDropdown
                control={control}
                label={'Adult Price on Call'}
                size='md'
                id='adult_price_call'
                name='adult_price_call'
                options={yesNoDropdown?.map(data => ({
                  label: data.label,
                  value: data.value
                }))}
                placeholder='Adult Price Call'
              />
            </div>
            <div>
              <MuiTextField
                control={control}
                label={'CNN Price'}
                size='md'
                id='cnn_price'
                name='cnn_price'
                placeholder='Enter CNN Price'
              />
            </div>
            <div>
              <MuiDropdown
                control={control}
                label={'Cnn Price on Call'}
                size='md'
                id='cnn_price_call'
                name='cnn_price_call'
                options={yesNoDropdown?.map(data => ({
                  label: data.label,
                  value: data.value
                }))}
                placeholder='Cnn Price Call'
              />
            </div>
            <div>
              <MuiTextField
                control={control}
                label={'Infant Price'}
                size='md'
                id='inf_price'
                name='inf_price'
                placeholder='Enter Infant Price'
              />
            </div>
            <div>
              <MuiDropdown
                control={control}
                label={'Infant Price on Call'}
                size='md'
                id='inf_price_call'
                name='inf_price_call'
                options={yesNoDropdown?.map(data => ({
                  label: data.label,
                  value: data.value
                }))}
                placeholder='Infant Price Call'
              />
            </div>
            <div>
              <MuiTextField
                control={control}
                label={'Baggage'}
                size='md'
                id='baggage'
                name='baggage'
                placeholder='Enter Baggage'
              />
            </div>

            <div>
              <MuiTextField control={control} label={'Meal'} size='md' id='meal' name='meal' placeholder='Enter Meal' />
            </div>
            <div>
              <MuiTextField control={control} label={'Pnr'} size='md' id='pnr' name='pnr' placeholder='Enter Pnr' />
            </div>
            <div>
              <MuiTextField
                control={control}
                label={'Total Seats'}
                size='md'
                id='total_seats'
                name='total_seats'
                placeholder='Enter Total Seats'
              />
            </div>
          </div>
          <div className='grid grid-cols-1'>
            <MuiTextarea
              className='mt-5'
              control={control}
              label={'Rules'}
              size='md'
              id='rules'
              name='rules'
              placeholder='Enter Rules'
            />
          </div>

          {fields.map((field, index) => {
            const departureDate = flights?.[index]?.departure_date

            return (
              <div key={field.id}>
                <div className='flex justify-between items-center'>
                  <h3 className='text-primary font-semibold mt-4'>Flight Detail: {index + 1}</h3>
                  {index > 0 && (
                    <h3 className='text-red-600 font-semibold mt-4 cursor-pointer' onClick={() => remove(index)}>
                      Remove Flight: {index + 1}
                    </h3>
                  )}
                </div>
                <div className='grid grid-cols-3 gap-4 mt-2'>
                  <MuiTextField
                    control={control}
                    label='Flight Number'
                    name={`flights.${index}.flight_number`}
                    id={`flights.${index}.flight_number`}
                    size='md'
                  />
                  <MuiTextField
                    control={control}
                    label='Departure City'
                    name={`flights.${index}.departure_city`}
                    id={`flights.${index}.departure_city`}
                    size='md'
                  />
                  <MuiTextField
                    control={control}
                    label='Arrival City'
                    name={`flights.${index}.arrival_city`}
                    id={`flights.${index}.arrival_city`}
                    size='md'
                  />
                  <MuiDatePicker
                    control={control}
                    label='Departure Date'
                    name={`flights.${index}.departure_date`}
                    id={`flights.${index}.departure_date`}
                    size='md'
                  />
                  <MuiTimePicker
                    control={control}
                    label='Departure Time'
                    name={`flights.${index}.departure_time`}
                    id={`flights.${index}.departure_time`}
                    size='md'
                  />
                  <MuiDatePicker
                    control={control}
                    label='Arrival Date'
                    name={`flights.${index}.arrival_date`}
                    id={`flights.${index}.arrival_date`}
                    size='md'
                    minDate={departureDate ? dayjs(departureDate) : undefined}
                  />
                  <MuiTimePicker
                    control={control}
                    label='Arrival Time'
                    name={`flights.${index}.arrival_time`}
                    id={`flights.${index}.arrival_time`}
                    size='md'
                  />
                </div>
              </div>
            )
          })}

          <div className='text-end'>
            <Button
              onClick={() =>
                append({
                  flight_no: '',
                  origin: '',
                  destination: '',
                  departure_date: null,
                  arrival_date: null
                })
              }
            >
              Add Flight
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant='contained' onClick={onSubmit}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddGroupModal
