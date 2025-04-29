import { useState } from 'react'

import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, Input, Radio } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'

import { useBookingEmailMutation } from '@/redux-store/services/api'

const EmailTicketModal = ({ isModalOpen, handleEmailTicketModal, userEmail, bookingId, type }) => {
  const [selectedOption, setSelectedOption] = useState('user')
  const [otherEmail, setOtherEmail] = useState('')

  const [bookingEmail, { isLoading }] = useBookingEmailMutation()

  const handleSend = async () => {
    const emailToSend = selectedOption === 'user' ? userEmail : otherEmail

    if (selectedOption === 'other' && !otherEmail) {
      toast.error('Please enter a valid email address.')

      return
    }

    await bookingEmail({ email_type: type, email: emailToSend, booking_id: bookingId }).then(response => {
      handleEmailTicketModal()

      if ('error' in response) {
        toast.error('Please try again sometime later. Thanks')

        return
      }
    })
    toast.success('Email sent successfully!')
  }

  return (
    <Dialog open={isModalOpen} fullWidth>
      <DialogContent>
        <div className='flex items-center justify-between mb-8'>
          <h3 className='text-md font-semibold'>
            {type === 'send_ticket_email' ? 'Send Ticket via Email' : 'Send Booking via Email'}
          </h3>
          <IoMdClose onClick={handleEmailTicketModal} fontSize={20} />
        </div>

        <h2>Select Email Destination</h2>
        <div className='mt-1 flex flex-col gap-3'>
          <label className='flex items-center gap-3 cursor-pointer'>
            <Radio
              aria-label='Send to My Email'
              color='primary'
              checked={selectedOption === 'user'}
              onChange={() => setSelectedOption('user')}
            />
            <span>Send to my registered email ({userEmail})</span>
          </label>
          <label className='flex items-center gap-3 cursor-pointer'>
            <Radio
              aria-label='Send to Another Email'
              color='primary'
              checked={selectedOption === 'other'}
              onChange={() => setSelectedOption('other')}
            />
            <span>Send to another email</span>
          </label>

          {selectedOption === 'other' && (
            <Input
              type='email'
              placeholder='Enter email address'
              value={otherEmail}
              onChange={e => setOtherEmail(e.target.value)}
              className='mt-2 w-full'
            />
          )}
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          color='primary'
          className='text-md'
          size='md'
          onClick={handleSend}
          loading={isLoading}
          disabled={isLoading}
          variant='contained'
        >
          Send Email
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EmailTicketModal
