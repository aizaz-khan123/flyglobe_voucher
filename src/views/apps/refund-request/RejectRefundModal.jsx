import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRejectReFundMutation } from '@/redux-store/services/api';

const RejectRefundModal = ({ isOpen, RefundRequestRefetch, booking, handleRejectRefundTicket }) => {
  const [rejectRefund, { isLoading }] = useRejectReFundMutation();
  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    try {
      const payload = {
        booking_id: booking?.booking_id,
      };

      const response = await rejectRefund(payload).unwrap();
      if (response?.code === 200) {
        toast.success(response?.message || "Refund rejected successfully.");
        handleRejectRefundTicket();
        RefundRequestRefetch();
      } else {
        toast.error(response?.message || "Failed to reject refund.");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject refund.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleRejectRefundTicket}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Reject Refund
        <IconButton
          aria-label="close"
          onClick={handleRejectRefundTicket}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography>
          You are about to reject the refund for Booking:{" "}
          <strong style={{ color: '#1976d2' }}>{booking?.booking_id}</strong>. Would you like to proceed further?
        </Typography>
      </DialogContent>
      <div className='mt-3'>
        <DialogActions>
          <Button variant="outlined" color="error" size="small" onClick={handleRejectRefundTicket}>
            No
          </Button>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Yes, proceed'}
            </Button>
          </form>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default RejectRefundModal;
