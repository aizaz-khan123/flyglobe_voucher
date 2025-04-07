import MuiTextField from '@/components/mui-form-inputs/MuiTextField';
import { useAdminChangePasswordMutation } from '@/redux-store/services/api';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import * as yup from "yup";

const ChangePasswordModal = ({ isOpen, handleClose, userUUid }) => {

    const validationSchema = yup.object({
        new_password: yup
            .string()
            .min(8, "Minimum 8 symbols")
            .max(16, "Maximum 16 symbols")
            .matches(/[A-Z]/, "Password must contain at least one capital letter")
            .matches(/[\W_]/, "Password must contain at least one special character")
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .required("Password is required"),
        confirm_new_password: yup
            .string()
            .required("Confirm New Password is required")
            .oneOf([yup.ref("new_password")], "Password and Confirm Password didn't match"),
    });
    const [adminChangePassword, { isLoading }] = useAdminChangePasswordMutation();
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            new_password: '',
            confirm_new_password: ''
        },
        resolver: yupResolver(validationSchema),
    })

    const setErrors = (errors) => {
        Object.entries(errors).forEach(([key, value]) =>
            setError(key, { message: value })
        );
    };

    const onSubmit = async (data) => {

        const payload = { new_password: data.new_password, uuid: userUUid }; // Add uuid dynamically
        await adminChangePassword(payload).then((response) => {
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
            }
        });
    };

    return (
        <Dialog open={isOpen}
            maxWidth='sm'
            fullWidth>
            <DialogTitle className='font-semibold flex items-center justify-between'>
                Change Password
                <IoMdClose className='cursor-pointer' onClick={handleClose} />
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <MuiTextField
                                className="w-full border-0 focus:outline-0"
                                control={control}
                                size="md"
                                label="New Password"
                                id="new_password"
                                name="new_password"
                                placeholder="Enter New Password"
                            />
                        </div>
                        <div>
                            <MuiTextField
                                className="w-full border-0 focus:outline-0"
                                control={control}
                                size="md"
                                label="Confirm New Password"
                                id="confirm_new_password"
                                name="confirm_new_password"
                                placeholder="Enter Confirm New Password"
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' loading={isLoading} disabled={isLoading} onClick={handleSubmit(onSubmit)}>
                        Submit
                    </Button>
                </DialogActions>
            </form>

        </Dialog>
    )
}

export default ChangePasswordModal
