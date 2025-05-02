'use client'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'

import { useDepositsRejectMutation } from '@/redux-store/services/api'

const RejectDepositeModal = ({ isOpen, RefundRequestRefetch, depositeUUID, handleRejectDepositeModal }) => {
  const [rejectDeposite, { isLoading }] = useDepositsRejectMutation()

  const { handleSubmit } = useForm() // Import and use handleSubmit from react-hook-form

  const onSubmit = async () => {
    const response = await rejectDeposite(depositeUUID).unwrap()

    if (response?.code === 200) {
      toast.success(response?.message || 'Refund rejected successfully.')
      handleRejectDepositeModal()
      RefundRequestRefetch()
    }
  }

  return (
    <Dialog open={isOpen} backdrop>
      <DialogTitle className='font-semibold flex justify-between'>
        Accept Deposite
        <Button size='sm' color='ghost' shape='circle' aria-label='Close modal' onClick={handleRejectDepositeModal}>
          <IoMdClose />
        </Button>
      </DialogTitle>
      <DialogContent>
        <p>You are about to reject the deposite request. Would you like to proceed further?</p>

        <DialogActions>
          <Button variant='outlined' onClick={handleRejectDepositeModal}>
            No
          </Button>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button variant='contained' type='submit' loading={isLoading}>
              Yes, proceed
            </Button>
          </form>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default RejectDepositeModal
