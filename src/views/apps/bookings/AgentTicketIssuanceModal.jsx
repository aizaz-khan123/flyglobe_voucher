'use client'

import { Button, Dialog, DialogContent } from '@mui/material'
import { IoMdClose } from 'react-icons/io'

import BookingOTP from './BookingOTP'

const AgentTicketIssuanceModal = ({ isModalOpen = true, bookingPnr, refectBooking, handleIssueTicketModal }) => {
  return (
    <>
      <Dialog open={isModalOpen} className='w-1/2 max-w-5xl h-11/5'>
        <form method='dialog'>
          <Button
            size='sm'
            color='ghost'
            shape='circle'
            className='absolute right-2 top-[20px]'
            aria-label='Close modal'
            onClick={() => handleIssueTicketModal()}
          >
            <IoMdClose />
          </Button>
        </form>

        <h3 className='text-md font-semibold mb-2'>Ticket Issuance Confirmation</h3>

        <DialogContent>
          <div className='flex flex-col items-center w-full mt-5'>
            <h2 className='text-2xl font-semibold text-center text-base-content/80 mb-4'>Enter OTP</h2>
            <p className='text-center text-sm text-base-content/60 mb-6'>
              We&rsquo;ve sent a one-time OTP to your registered email address.
            </p>

            <BookingOTP
              bookingId={bookingPnr}
              refectBooking={refectBooking}
              handleIssueTicketModal={handleIssueTicketModal}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AgentTicketIssuanceModal
