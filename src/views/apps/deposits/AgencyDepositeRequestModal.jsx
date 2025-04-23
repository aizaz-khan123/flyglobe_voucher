'use client'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown';
import MuiTextField from '@/components/mui-form-inputs/MuiTextField';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, Modal } from '@mui/material';
import React from 'react'
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io'
import { useBankDropdownQuery, useDepositsRequestMutation } from '@/redux-store/services/api';


const AgencyDepositeRequestModal = ({ isOpen, RefundRequestRefetch, booking, handleDepositeRequestModal }) => {
    const [depositeRequest, { isLoading }] = useDepositsRequestMutation();
    const { data: bankDropdownData } = useBankDropdownQuery('');
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            bank_id: "",
            deposit_amount: "",
            reciept: null, // Default value for the receipt
        },
    });

    const onSubmit = async (data) => {
        try {
            // Construct FormData
            const formData = new FormData();
            formData.append("bank_id", data.bank_id);
            formData.append("deposit_amount", data.deposit_amount);
            if (data.reciept) {
                formData.append("reciept", data.reciept); // Append the file
            }

            // Send the FormData to the API
            const response = await depositeRequest(formData).unwrap();
            if (response?.code === 200) {
                toast.success(response?.message || "Deposit request processed successfully.");
                handleDepositeRequestModal();
                RefundRequestRefetch();
            } else {
                toast.error(response?.message || "Failed to process deposit request.");
            }
        } catch (error) {
            toast.error(error?.data?.message || "Failed to process deposit request.");
        }
    };

    return (
        <Dialog open={isOpen} backdrop className='w-md'>
            <DialogTitle className="font-semibold flex justify-between">
                Agency Deposit
                <button
                    size="sm"
                    color="ghost"
                    shape="circle"
                    aria-label="Close modal"
                    onClick={handleDepositeRequestModal}
                >
                    <IoMdClose fontSize={20} />
                </button>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-5 p-3">
                        <div>
                            <MuiDropdown
                                control={control}
                                label={"Bank"}
                                name="bank_id"
                                placeholder="Select Bank"
                                options={
                                    bankDropdownData?.map((bankData) => ({
                                        value: bankData.id,
                                        label: bankData.bank_name,
                                    })) || []
                                }
                                isClearable
                                noOptionsMessage={() => "No banks found"}
                                wrapperClassName="w-full"
                                className="text-sm"
                                size="md"
                            />
                        </div>
                        <div>
                            <MuiTextField
                                className="w-full border-0 focus:outline-0"
                                control={control}
                                size="md"
                                id="deposit_amount"
                                name="deposit_amount"
                                placeholder="Enter Deposit Amount"
                                label="Deposit Amount"
                            />
                        </div>
                    </div>
                    <div className="grid grid-col-1">
                        <FormLabel title={"Receipt"} htmlFor="reciept"></FormLabel>
                        <Controller
                            name="reciept"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <input
                                    type="file"
                                    id="reciept"
                                    name="reciept"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        onChange(file); // Update react-hook-form
                                        setValue("reciept", file); // Update the form value
                                    }}
                                />
                            )}
                        />
                    </div>
                </form>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={handleDepositeRequestModal}>
                    No
                </Button>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Button variant='contained' type="submit" loading={isLoading}>
                        Yes, proceed
                    </Button>
                </form>
            </DialogActions>
        </Dialog>
    )
}

export default AgencyDepositeRequestModal;
