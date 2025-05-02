import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'

import { useDepositsAcceptMutation } from '@/redux-store/services/api'

const AcceptDepositeModal = ({ isOpen, RefundRequestRefetch, depositeUUID, handleAcceptDepositeModal }) => {
  const [acceptDeposite, { isLoading }] = useDepositsAcceptMutation()

  const { handleSubmit } = useForm() // Import and use handleSubmit from react-hook-form

  const onSubmit = async () => {
    const response = await acceptDeposite(depositeUUID).unwrap()

    if (response?.code === 200) {
      toast.success(response?.message || 'Refund rejected successfully.')
      handleAcceptDepositeModal()
      RefundRequestRefetch()
    }
  }

  return (
    <Dialog open={isOpen} backdrop>
      <DialogTitle className='font-semibold flex justify-between'>
        Accept Deposite
        <Button size='sm' color='ghost' shape='circle' aria-label='Close modal' onClick={handleAcceptDepositeModal}>
          <IoMdClose />
        </Button>
      </DialogTitle>
      <DialogContent>
        <p>You are about to reject the deposite request. Would you like to proceed further?</p>

        <DialogActions>
          <Button variant='outlined' onClick={handleAcceptDepositeModal}>
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

export default AcceptDepositeModal
