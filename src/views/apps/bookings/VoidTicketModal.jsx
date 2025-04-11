import { useEffect, useState } from 'react'

import { Button, Card, CardContent, Dialog, DialogActions, DialogContent } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'

import { useVoidTicketMutation } from '@/redux-store/services/api'

const VoidTicketModal = ({ isModalOpen, passengers, handleVoidTicketModal, bookingPnr, refectBooking }) => {
  const [selected, setSelected] = useState([])
  const [voidTicket] = useVoidTicketMutation()

  useEffect(() => {
    if (passengers?.length) {
      setSelected(passengers.map(p => p.ticket_number))
    }
  }, [passengers])

  const [disableVoidTicket, setDisableVoidTicket] = useState(false)
  const [disableCancelBooking, setDisableCancelBooking] = useState(false)
  const [loadingVoidTicket, setLoadingVoidTicket] = useState(false)
  const [loadingCancelTicket, setLoadingCancelTicket] = useState(false)

  const handleCancelBooking = () => {
    if (selected.length == 0) {
      toast.error('Please select at least one ticket to proceed.')

      return
    }

    setLoadingCancelTicket(true)
    setDisableVoidTicket(true)
    setDisableCancelBooking(true)
    const body = { tickets: selected, action: 'cancel_booking', reservation_id: bookingPnr }

    handleSubmit(body)
    setLoadingCancelTicket(false)
    setDisableVoidTicket(false)
    setDisableCancelBooking(false)
  }

  const handleVoidTicket = () => {
    if (selected.length == 0) {
      toast.error('Please select at least one ticket to proceed.')

      return
    }

    setLoadingVoidTicket(true)
    setDisableVoidTicket(true)
    setDisableCancelBooking(true)
    const body = { tickets: selected, action: 'void_ticket', reservation_id: bookingPnr }

    handleSubmit(body)
    setLoadingVoidTicket(false)
    setDisableVoidTicket(false)
    setDisableCancelBooking(false)
  }

  const handleSubmit = async body => {
    await voidTicket(body).then(response => {
      if ('error' in response) {
        toast.error(response?.error?.data?.message)
      }

      toast.success('Ticket has been Successfully Voided...')
      handleVoidTicketModal()
      refectBooking()
    })
  }

  const handleToggle = ticketNumber => {
    setSelected(prevSelected =>
      prevSelected.includes(ticketNumber)
        ? prevSelected.filter(num => num !== ticketNumber)
        : [...prevSelected, ticketNumber]
    )
  }

  const isAnyUncheck = selected.length !== passengers.length

  return (
    <Dialog
      open={isModalOpen}
      fullWidth

      // className="w-1/2 max-w-2xl h-11/12"
    >
      <DialogContent>
        <div className='flex items-center justify-between mb-8'>
          <h3 className='text-md font-semibold'>Void Ticket</h3>
          <IoMdClose onClick={handleVoidTicketModal} fontSize={20} />
        </div>

        <div className='mt-4'>
          <div className='grid  gap-4'>
            {passengers.map(passenger => (
              <div
                key={passenger.ticket_number}
                className='flex items-center justify-between bg-gray-100 p-3 rounded-md cursor-pointer'
              >
                <label className='relative flex items-center cursor-pointer w-full justify-between'>
                  <div className='flex flex-col'>
                    <span className='text-lg font-medium'>
                      {' '}
                      {passenger.last_name}/{passenger.first_name} {passenger.title == 'Mr' ? 'MR' : 'MS'}
                    </span>
                    <span className='text-lg text-gray-500'>Ticket: {passenger.ticket_number}</span>
                  </div>
                  <input
                    type='checkbox'
                    className='sr-only peer'
                    checked={selected.includes(passenger.ticket_number)}
                    onChange={() => handleToggle(passenger.ticket_number)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1/2 after:left-1 after:-translate-y-1/2 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all relative"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <form method='dialog' className='flex gap-1'>
          {!isAnyUncheck ? (
            <>
              <Button
                variant='contained'
                onClick={handleVoidTicket}
                loading={loadingCancelTicket}
                disabled={disableVoidTicket}
              >
                Void Ticket & Cancel Booking
              </Button>
              <Button
                variant='contained'
                onClick={handleCancelBooking}
                loading={loadingVoidTicket}
                disabled={disableCancelBooking}
              >
                Void Ticket & Save Booking
              </Button>
            </>
          ) : (
            <Button variant='contained'>Void Ticket</Button>
          )}
        </form>
      </DialogActions>
    </Dialog>
  )
}

export default VoidTicketModal
