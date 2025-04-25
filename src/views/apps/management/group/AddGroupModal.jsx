import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { gender } from '@/data/dropdowns/DropdownValues'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'

const AddGroupModal = ({ open, isEdit, onClose, }) => {
    const { control, onSubmit, setError, reset, isLoading } = useForm()

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
                <DialogTitle className='font-bold flex items-center justify-between'>
                    {isEdit === true ? 'Edit' : 'Create'} Add Group Flight
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
        </>
    )
}

export default AddGroupModal
