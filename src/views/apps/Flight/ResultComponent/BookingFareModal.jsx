import { CircularProgress } from '@mui/material'

const BookingFareModal = () => {
  return (
    <div className='flex justify-center items-center max-w-md py-3'>
      <div className='text-center'>
        <CircularProgress />
        <h1 className='text-2xl font-semibold py-3'>Making Your Booking</h1>
        <p className='text-base font-normal text-gray-700 text-start'>
          Please hold on while we confirm your booking. This may take a few moments, but we’re ensuring everything is
          perfectly arranged for your trip.
        </p>
      </div>
    </div>
  )
}

export default BookingFareModal
