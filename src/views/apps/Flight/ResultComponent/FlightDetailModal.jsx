import React from 'react'

import { Dialog, DialogContent } from '@mui/material'
import dayjs from 'dayjs'
import { IoMdClose } from 'react-icons/io'
import { FaPlane } from 'react-icons/fa6'

const FlightDetailModal = ({ viewFlightDetailModal, handleCloseViewFlightDetail, data, queryParams }) => {
  if (!data || !data.legs || data.legs.length === 0) {
    return null
  }

  // const { legs } = data
  const legs = data.legs ? Object.values(data.legs).flat() : [];

  return (
    <Dialog
      open={viewFlightDetailModal}
      onClose={handleCloseViewFlightDetail}
      maxWidth={false}
      fullWidth
      sx={{ width: { xs: '100%', sm: '80%' }, margin: 'auto' }}
      disableEscapeKeyDown
    >
      <DialogContent className='py-5'>
        <div className='w-full'>
          {legs.map((leg, legIndex) => {
            const segments = leg.segments
            const totalDuration = leg.journey_duration
            const totalHours = Math.floor(totalDuration / 60)
            const totalMinutes = totalDuration % 60

            return (
              <div key={legIndex} className='mb-8'>
                <div className='flex items-center justify-between pb-2'>
                  <div className='flex items-center gap-2'>
                    <h2 className='text-md md:text-lg lg:text-2xl font-bold '>
                      {queryParams?.route_type === "RETURN" ? "Returning from " : ""}
                      {segments[0].origin.municipality} ({segments[0].origin.iata_code}) to{' '}
                      {segments[segments.length - 1].destination.municipality} (
                      {segments[segments.length - 1].destination.iata_code})
                    </h2>
                    <p className=' text-sm md:text-base'>
                      Total duration: {totalHours}h {totalMinutes}m
                    </p>
                  </div>
                  {legIndex === 0 &&
                    <div>
                      <IoMdClose className='text-2xl cursor-pointer' onClick={handleCloseViewFlightDetail} />
                    </div>
                  }
                </div>

                {segments.map((segment, segmentIndex) => (
                  <React.Fragment key={segmentIndex}>
                    {segmentIndex !== 0 && (
                      <p className='text-center my-2 mt-4 py-2 text-base font-medium'>
                        Stopover in {segment.origin.municipality} ({segment.origin.iata_code}) |{' '}
                        {formatDuration(segment.layover_waited_time)}
                      </p>
                    )}

                    <div className='mt-4 p-4 border shadow-lg rounded-lg'>
                      <div className='flex items-center justify-between border-b pb-3'>
                        <p className=' font-semibold flex items-center gap-3 text-md lg:text-xl'>
                          <img src='/images/icons/from.svg' className='h-6' alt='icon' />
                          {segment.origin.municipality} ({segment.origin.iata_code}) to{' '}
                          {segment.destination.municipality} ({segment.destination.iata_code})
                        </p>
                        <p className=' text-sm lg:text-lg'>
                          Aircraft: {segment.operating_airline.name} ({segment.flight_number})
                        </p>
                      </div>
                      <div className='flex items-center justify-between mt-2'>
                        <p className=' text-sm lg:text-md'>
                          {dayjs(segment.departure_datetime).format('DD MMMM YYYY')}
                        </p>
                        <p className=' text-sm lg:text-md'>{dayjs(segment.arrival_datetime).format('DD MMMM YYYY')}</p>
                      </div>
                      <div className='flex items-center justify-between gap-2 mt-3'>
                        <div className='text-center'>
                          <h3 className='font-bold mb-0 text-xl md:text-3xl lg:text-5xl text-primary'>
                            {dayjs(segment.departure_datetime).format('HH:mm')}
                          </h3>
                        </div>
                        <div className='flex text-center items-center justify-center'>
                          <hr className='w-[30px] md:w-[100px] xl:w-[200px] border-2' />
                          <FaPlane fontSize={40} className='hidden lg:block text-primary' />
                          <hr className='w-[100px] xl:w-[200px] border-2 hidden lg:block' />
                          <FaPlane fontSize={40} className='md:h-14 text-primary' />
                          <hr className='w-[30px] md:w-[100px] xl:w-[200px] border-2' />
                        </div>
                        <div className='text-center'>
                          <h3 className='font-bold mb-0 text-xl md:text-3xl lg:text-5xl text-primary'>
                            {dayjs(segment.arrival_datetime).format('HH:mm')}
                          </h3>
                        </div>
                      </div>
                      <div className='flex items-center justify-between mt-3'>
                        <p className=' font-bold text-md lg:text-lg'>{segment.origin.iata_code}</p>
                        <p className=' font-bold text-md lg:text-lg'>{segment.destination.iata_code}</p>
                      </div>
                      {/* <div className='flex items-center justify-between mt-2'>
                        <p className=' text-base'>{dayjs(segment.departure_datetime).format('DD MMMM YYYY')}</p>
                        <p className=' text-base'>{dayjs(segment.arrival_datetime).format('DD MMMM YYYY')}</p>
                      </div> */}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FlightDetailModal

const formatDuration = minutes => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${hours}h ${mins}m`
}
