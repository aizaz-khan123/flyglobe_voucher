import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { useTemporaryLimitMutation } from '@/redux-store/services/api';
import MuiDatePicker from '@/components/mui-form-inputs/MuiDatePicker';
import MuiTextField from '@/components/mui-form-inputs/MuiTextField';




const TemporaryLimitModal = ({ isOpen, handleClose, temporaryLimit, orgUUid, refetch }) => {

    const [temporaryLimitCall, { isLoading }] = useTemporaryLimitMutation();

    const temporaryLimitSchema = z.object({
        temp_credit_limit: z.string({ required_error: 'Temporary Limit Amount is Required!' }),
        temp_limit_due_date: z.string({ required_error: 'Temporary Limit Due must be Required!' }),
    });

    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            temp_credit_limit: temporaryLimit?.temp_credit_limit ? temporaryLimit?.temp_credit_limit.toString() : '',
            temp_limit_due_date: temporaryLimit?.temp_limit_due_date
        },
        resolver: zodResolver(temporaryLimitSchema),
    })

    const setErrors = () => {
        Object.entries(errors).forEach(([key, value]) =>
            setError(key, { message: value })
        );
    };

    const onSubmit = handleSubmit(async (data) => {

        const payload = { ...data, uuid: orgUUid };

        await temporaryLimitCall(payload).then((response) => {
            if ("error" in response) {
                if (response.error.data?.code == 400) {
                    toast.error(response.error.data?.message);
                    
return;
                }

                setErrors(response.error.data.errors);
                
return;
            }

            if (response.data.code == 200) {
                toast.success(response?.data?.message);
                handleClose();
                refetch();
            }
        });
    });

    return (
        <Dialog open={isOpen} fullWidth maxWidth='sm'>
            <form method="dialog">

            </form>
            <DialogTitle className='font-semibold flex items-center justify-between'>
                Temporaray Limit
                <IoMdClose className='cursor-pointer' onClick={handleClose} />
            </DialogTitle>
            <DialogContent>
                <div>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <MuiTextField
                                className="w-full border-0 focus:outline-0"
                                control={control}
                                size="md"
                                label='Temporary limit'
                                id="temp_credit_limit"
                                name="temp_credit_limit"
                                placeholder="Enter Temporary limit"
                            />
                        </div>
                        <div>
                            <MuiDatePicker
                                control={control}
                                name='temp_limit_due_date'
                                label='Date'
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <form method="dialog">
                    <Button color="primary" variant='contained' loading={isLoading} disabled={isLoading} onClick={() => onSubmit()}>Submit</Button>
                </form>
            </DialogActions>
        </Dialog>
    )
}

export default TemporaryLimitModal
