'use client'
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    Typography,
    Box,
    FormLabel,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import MuiTextField from '@/components/mui-form-inputs/MuiTextField';
import { useMakeRefundMutation } from '@/redux-store/services/api';

export const formatCurrency = (amount) => {
    return `PKR ${amount?.toLocaleString('en-PK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};
const AcceptRefundModal = ({ isOpen, RefundRequestRefetch, booking, handleAcceptRefundTicket }) => {
    const toaster = useToast();
    const [makeRefund, { isLoading }] = useMakeRefundMutation();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            refund_amount: '',
        },
    });

    const onSubmit = async (data) => {
        try {
            const payload = {
                booking_id: booking?.booking_id,
                data: {
                    refund_amount: data.refund_amount,
                },
            };

            const response = await makeRefund(payload).unwrap();
            if (response?.code === 200) {
                toaster.success(response?.message || 'Refund processed successfully.');
                handleAcceptRefundTicket();
                RefundRequestRefetch();
            } else {
                toaster.error(response?.message || 'Failed to process refund.');
            }
        } catch (error) {
            toaster.error(error?.data?.message || 'Failed to process refund.');
        }
    };

    return (
        <Dialog open={isOpen} onClose={handleAcceptRefundTicket} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Accept Refund</Typography>
                <IconButton size="small" onClick={handleAcceptRefundTicket}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Typography mb={2}>
                    You are about to refund Booking: <strong style={{ color: '#3b82f6' }}>{booking?.booking_id}</strong>. Would you like to proceed further?
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
                        <Box>
                            <FormLabel htmlFor="total_amount">Total Amount</FormLabel>
                            <Box
                                sx={{
                                    color: '#3b82f6',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem',
                                    borderRadius: 1,
                                    height: '50px',
                                    px: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#f1f5f9',
                                    border: '1px solid #e2e8f0',
                                }}
                            >
                                {formatCurrency(booking?.total_amount)}
                            </Box>
                        </Box>
                        <Box>
                            <FormLabel htmlFor="total_amount">Refund Amount</FormLabel>

                            <MuiTextField
                                control={control}
                                id="refund_amount"
                                name="refund_amount"
                                placeholder="Enter Refund Amount"
                            />
                        </Box>
                    </Box>
                </form>
            </DialogContent>
            <div className='mt-3'>
                <DialogActions>
                    <Button onClick={handleAcceptRefundTicket} variant='outlined' >
                        No
                    </Button>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Button
                            variant='contained'
                            type="submit"
                            disabled={isLoading}
                            startIcon={isLoading && <CircularProgress color="inherit" size={16} />}
                        >
                            {isLoading ? 'Processing...' : 'Yes, proceed'}
                        </Button>
                    </form>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default AcceptRefundModal;
