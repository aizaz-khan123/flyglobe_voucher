import MuiAutocomplete from '@/components/mui-form-inputs/MuiAutoComplete'
import MuiDatePicker from '@/components/mui-form-inputs/MuiDatePicker'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import MuiTextarea from '@/components/mui-form-inputs/MuiTextarea'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import MuiTimePicker from '@/components/mui-form-inputs/MuiTimePicker'
import { gender, groupsStatus } from '@/data/dropdowns/DropdownValues'
import { useAirlineDropDownQuery, useGroupsStoreMutation, useGroupTypeDropdownQuery } from '@/redux-store/services/api'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'

const AddGroupModal = ({ open, isEdit, onClose, }) => {

    const [createGroups, { isLoading }] = useGroupsStoreMutation()
    const { data: airlineDropdown } = useAirlineDropDownQuery();
    const { data: groupTypeDropdown } = useGroupTypeDropdownQuery();

    const { control, handleSubmit, setError, reset, } = useForm({
        defaultValues: {
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
                    arrival_city: '',
                }
            ],
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'flights',
    });
    const setErrors = (errors) => {
        Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
    }

    const onSubmit = handleSubmit(async (data) => {
        // if (!uuid) {
        await createGroups(data).then((response) => {
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
        // } else {
        //     const updated_data = {
        //         _method: 'put',
        //         ...data,
        //     }

        //     await UpdateGroupType({ uuid, updated_data }).then((response) => {
        //         if ('error' in response) {
        //             setErrors(response?.error.data?.errors)
        //             return
        //         }

        //         if (response.data?.code == 200) {
        //             toast.success(response?.data?.message)
        //             refetch()
        //             onClose()
        //         } else {
        //             setErrors(response?.data?.errors)
        //         }
        //     })
        // }
    })

    console.log('airlineDropdown', airlineDropdown);

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
                <DialogTitle className='font-bold flex items-center justify-between'>
                    {isEdit === true ? 'Update' : 'Add'}  Group Flight
                    <IoMdClose className='cursor-pointer' onClick={onClose} />
                </DialogTitle>
                <DialogContent>
                    <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-3'>
                        <div>
                            <MuiDropdown
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
                                placeholder='Sector'
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
                                    label: data.name,
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
                                className='w-full border-0 text-base'
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
                            <MuiTextField
                                control={control}
                                label={'Adult Price on Call'}
                                size='md'
                                id='adult_price_call'
                                name='adult_price_call'
                                placeholder='Enter Adult Price Call'
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
                            <MuiTextField
                                control={control}
                                label={'Cnn Price on Call'}
                                size='md'
                                id='cnn_price_call'
                                name='cnn_price_call'
                                placeholder='Enter Cnn Price Call'
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
                            <MuiTextField
                                control={control}
                                label={'Infant Price on Call'}
                                size='md'
                                id='inf_price_call'
                                name='inf_price_call'
                                placeholder='Enter Infant Price Call'
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
                            <MuiTextField
                                control={control}
                                label={'Meal'}
                                size='md'
                                id='meal'
                                name='meal'
                                placeholder='Enter Meal'
                            />
                        </div>
                        <div>
                            <MuiTextField
                                control={control}
                                label={'Pnr'}
                                size='md'
                                id='pnr'
                                name='pnr'
                                placeholder='Enter Pnr'
                            />
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
                    <div className="grid grid-cols-1">
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

                    {fields.map((field, index) => (
                        <div key={field.id}>
                            <div className='flex justify-between items-center'>
                                <h3 className='text-primary font-semibold mt-4'>Flight Detail: {index + 1}</h3>
                                {index > 0 &&
                                    <h3 className='text-red-600 font-semibold mt-4 cursor-pointer' onClick={() => remove(index)}>Remove Flight: {index + 1}</h3>
                                }
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                                <MuiTextField
                                    control={control}
                                    label="Flight Number"
                                    name={`flights.${index}.flight_number`}
                                    id={`flights.${index}.flight_number`}
                                    size="md"
                                />
                                <MuiTextField
                                    control={control}
                                    label="Departure City"
                                    name={`flights.${index}.departure_city`}
                                    id={`flights.${index}.departure_city`}
                                    size="md"
                                />
                                <MuiTextField
                                    control={control}
                                    label="Arrival City"
                                    name={`flights.${index}.arrival_city`}
                                    id={`flights.${index}.arrival_city`}
                                    size="md"
                                />
                                <MuiDatePicker
                                    control={control}
                                    label="Departure Date"
                                    name={`flights.${index}.departure_date`}
                                    id={`flights.${index}.departure_date`}
                                    size="md"
                                />
                                <MuiTimePicker
                                    control={control}
                                    label="Departure Time"
                                    name={`flights.${index}.departure_time`}
                                    id={`flights.${index}.departure_time`}
                                    size="md"
                                />
                                <MuiDatePicker
                                    control={control}
                                    label="Arrival Date"
                                    name={`flights.${index}.arrival_date`}
                                    id={`flights.${index}.arrival_date`}
                                    size="md"
                                />
                                <MuiTimePicker
                                    control={control}
                                    label="Arrival Time"
                                    name={`flights.${index}.arrival_time`}
                                    id={`flights.${index}.arrival_time`}
                                    size="md"
                                />
                            </div>

                        </div>
                    ))}

                    <div className='text-end'>
                        <Button
                            onClick={() =>
                                append({
                                    flight_no: '',
                                    origin: '',
                                    destination: '',
                                    departure_date: null,
                                    arrival_date: null,
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
