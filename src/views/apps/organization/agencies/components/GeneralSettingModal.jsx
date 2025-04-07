import MuiTextField from '@/components/mui-form-inputs/MuiTextField';
import { useGeneralSettingMutation } from '@/redux-store/services/api';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import { z } from "zod";

const GeneralSettingModal = ({ isOpen, handleClose, generalSettingData, orgUUid, refetch }) => {

    const [generalSettingCall, { isLoading }] = useGeneralSettingMutation();

    const generalSetting = z.object({
        void_charges: z.string().optional(),
        extra_commision: z.string().optional(),
        can_issue_ticket: z.boolean(),
    });

    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            void_charges: generalSettingData?.void_charges ? generalSettingData?.void_charges.toString() : '',
            extra_commision: generalSettingData?.extra_commision ? generalSettingData?.extra_commision.toString() : '',
            can_issue_ticket: generalSettingData?.can_issue_ticket ? true : false,
        },
        resolver: zodResolver(generalSetting),
    })

    const setErrors = (errors) => {
        Object.entries(errors).forEach(([key, value]) =>
            setError(key, { message: value })
        );
    };

    const onSubmit = handleSubmit(async (data) => {

        const payload = { ...data, uuid: orgUUid };

        await generalSettingCall(payload).then((response) => {
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
            <DialogTitle className='font-semibold flex items-center justify-between'>
                General Settings
                <IoMdClose className='cursor-pointer' onClick={handleClose} />
            </DialogTitle>
            <DialogContent>
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                        <div>
                            <MuiTextField
                                className="w-full border-0 focus:outline-0"
                                control={control}
                                size="md"
                                label='Void Charges'
                                id="void_charges"
                                name="void_charges"
                                placeholder="Enter Void Charges"
                                type="number"
                            />
                        </div>
                        <div>
                            <MuiTextField
                                className="w-full border-0 focus:outline-0"
                                control={control}
                                size="md"
                                label='Add Extra Commission'
                                id="extra_commision"
                                name="extra_commision"
                                placeholder="Enter Extra Commission"
                                type="number"
                            />
                        </div>
                        <div>
                            <FormLabel htmlFor="can_issue_ticket">Allow Ticket Issuance</FormLabel>
                            <Switch
                                color='primary'
                                control={control}
                                size="md"
                                id="can_issue_ticket"
                                name="can_issue_ticket"
                                placeholder="Enter Allow Ticket Issuance"
                            />
                        </div>

                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button color="primary" variant='contained' loading={isLoading} disabled={isLoading} onClick={() => onSubmit()}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

export default GeneralSettingModal
