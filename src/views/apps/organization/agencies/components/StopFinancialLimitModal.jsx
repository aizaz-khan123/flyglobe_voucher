

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';




const StopFinancialLimitModal = ({ isOpen, handleClose }) => {
    const { control } = useForm()
    return (
        <Dialog open={isOpen} className=" h-11/12">
            <DialogTitle className='font-semibold flex justify-between'>
                Stop Financial
                <IoMdClose className='cursor-pointer' onClick={handleClose} />
            </DialogTitle>
            <DialogContent>
                You are about to stop financial Limit. Would you like to proceed further ?
            </DialogContent>
            <DialogActions>
                <Button color="error">
                    No
                </Button>
                <Button color="primary" variat="contained">
                    Yes
                </Button>
            </DialogActions>

        </Dialog>
    )
}

export default StopFinancialLimitModal
