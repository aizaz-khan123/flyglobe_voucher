import MuiDatePicker from '@/components/mui-form-inputs/MuiDatePicker'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { gender } from '@/data/dropdowns/DropdownValues'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'

const AddGroupModal = ({ open, isEdit, onClose, }) => {
    const { control, handleSubmit, setError, reset, formState: { isSubmitting }, setValue, watch, isLoading } = useForm({
        defaultValues: {
            sector: '',
            airline: '',
            status: '',
            purchase_price: '',
            price: '',
            adult_price: '',
            adt_price_on_call: '',
            cnn_price: '',
            cnn_price_on_call: '',
            infant_price: '',
            infant_price_on_call: '',
            baggage: '',
            meal: '',
            pnr: '',
            total_seats: '',
            flights: [
                {
                    flight_no: '',
                    origin: '',
                    destination: '',
                    departure_date: null,
                    arrival_date: null,
                },
            ],
        }
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'flights',
    });

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
                                placeholder='Select Sectoe'
                            />

                        </div>
                        <div>
                            <MuiDropdown
                                control={control}
                                label='Airline'
                                name='airline'
                                size='md'
                                id='airline'
                                className='w-full border-0 text-base'
                                options={gender.map(data => ({
                                    label: data.label,
                                    value: data.label
                                }))}
                                placeholder='Select Sectoe'
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
                                options={gender.map(data => ({
                                    label: data.label,
                                    value: data.label
                                }))}
                                placeholder='Select Sectoe'
                            />
                        </div>

                        <div>
                            <MuiTextField
                                type='text'
                                className='w-full border-0 focus:outline-0'
                                control={control}
                                label={'Purchase Price'}
                                size='md'
                                id='purchase_price'
                                name='purchase_price'
                            />
                        </div>

                        <div>
                            <MuiTextField
                                type='text'
                                className='w-full border-0 focus:outline-0'
                                control={control}
                                label={'Price'}
                                size='md'
                                id='price'
                                name='price'
                            />
                        </div>

                        <div>
                            <MuiTextField
                                type='text'
                                className='w-full border-0 focus:outline-0'
                                control={control}
                                label={'Adult Price'}
                                size='md'
                                id='adult_price'
                                name='adult_price'
                            />
                        </div>

                        <div>
                            <MuiTextField
                                className='w-full border-0 focus:outline-0'
                                control={control}
                                label={'Adult Price on Call'}
                                size='md'
                                id='adt_price_on_call'
                                name='adt_price_on_call'
                                placeholder='Enter Rbds'
                            />
                        </div>
                        <div>
                            <MuiTextField
                                className='w-full border-0 focus:outline-0'
                                control={control}
                                label={'CNN Price'}
                                size='md'
                                id='cnn_price'
                                name='cnn_price'
                                placeholder='Enter Rbds'
                            />
                        </div>
                        <div>
                            <MuiTextField
                                className='w-full border-0 focus:outline-0'
                                control={control}
                                label={'Cnn Price on Call'}
                                size='md'
                                id='cnn_price_on_call'
                                name='cnn_price_on_call'
                                placeholder='Enter Rbds'
                            />
                        </div>
                        <div>
                            <MuiTextField
                                className='w-full border-0 focus:outline-0'
                                control={control}
                                label={'Infant Price'}
                                size='md'
                                id='infant_price'
                                name='infant_price'
                                placeholder='Enter Rbds'
                            />
                        </div>
                        <div>
                            <MuiTextField
                                className='w-full border-0 focus:outline-0'
                                control={control}
                                label={'Infant Price on Call'}
                                size='md'
                                id='infant_price_on_call'
                                name='infant_price_on_call'
                                placeholder='Enter Rbds'
                            />
                        </div>
                        <div>
                            <MuiTextField
                                className='w-full border-0 focus:outline-0'
                                control={control}
                                label={'Baggage'}
                                size='md'
                                id='baggage'
                                name='baggage'
                                placeholder='Enter Rbds'
                            />
                        </div>

                        <div>
                            <MuiTextField
                                className='w-full border-0 focus:outline-0'
                                control={control}
                                label={'Meal'}
                                size='md'
                                id='meal'
                                name='meal'
                                placeholder='Enter Rbds'
                            />
                        </div>
                        <div>
                            <MuiTextField
                                className='w-full border-0 focus:outline-0'
                                control={control}
                                label={'Pnr'}
                                size='md'
                                id='pnr'
                                name='pnr'
                                placeholder='Enter Rbds'
                            />
                        </div>
                        <div>
                            <MuiTextField
                                className='w-full border-0 focus:outline-0'
                                control={control}
                                label={'Total Seats'}
                                size='md'
                                id='total_seats'
                                name='total_seats'
                                placeholder='Enter Rbds'
                            />
                        </div>
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
                                <div>
                                    <MuiTextField
                                        type='text'
                                        className='w-full border-0 focus:outline-0'
                                        control={control}
                                        label='Flight NO'
                                        size='md'
                                        id={`flights.${index}.flight_no`}
                                        name={`flights.${index}.flight_no`}
                                    />
                                </div>
                                <div>
                                    <MuiTextField
                                        type='text'
                                        className='w-full border-0 focus:outline-0'
                                        control={control}
                                        label='Origin'
                                        size='md'
                                        id={`flights.${index}.origin`}
                                        name={`flights.${index}.origin`}
                                    />
                                </div>
                                <div>
                                    <MuiTextField
                                        type='text'
                                        className='w-full border-0 focus:outline-0'
                                        control={control}
                                        label='Destination'
                                        size='md'
                                        id={`flights.${index}.destination`}
                                        name={`flights.${index}.destination`}
                                    />
                                </div>
                                <div>
                                    <MuiDatePicker
                                        className='w-full border-0 focus:outline-0'
                                        control={control}
                                        label='Departure Date'
                                        size='md'
                                        id={`flights.${index}.departure_date`}
                                        name={`flights.${index}.departure_date`}
                                    />
                                </div>
                                <div>
                                    <MuiDatePicker
                                        className='w-full border-0 focus:outline-0'
                                        control={control}
                                        label='Arrival Date'
                                        size='md'
                                        id={`flights.${index}.arrival_date`}
                                        name={`flights.${index}.arrival_date`}
                                    />
                                </div>
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
                    <Button variant='contained' onClick={handleSubmit(data => console.log(data))} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddGroupModal
