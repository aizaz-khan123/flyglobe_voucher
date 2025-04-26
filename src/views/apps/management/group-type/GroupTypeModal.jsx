import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { gender } from '@/data/dropdowns/DropdownValues'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'

const GroupTypeModal = ({ open, isEdit, onClose, }) => {
    const { control, handleSubmit, setError, reset, formState: { isSubmitting }, setValue, watch, isLoading } = useForm({
        defaultValues: {
            group_type: '',
            status: '',
        }
    })
    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
                <DialogTitle className='font-bold flex items-center justify-between'>
                    {isEdit === true ? 'Update' : 'Add'}  Group Type
                    <IoMdClose className='cursor-pointer' onClick={onClose} />
                </DialogTitle>
                <DialogContent>
                    <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
                        <div>
                            <MuiTextField
                                control={control}
                                label='Group Type'
                                name='group_type'
                                size='md'
                                id='group_type'
                                className='w-full border-0 text-base'
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
                                options={gender.map(data => ({
                                    label: data.label,
                                    value: data.label
                                }))}
                                placeholder='Status'
                            />
                        </div>
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

export default GroupTypeModal
