import React from 'react'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  timelineItemClasses
} from '@mui/lab'

import { FaPlane, FaPlaneArrival, FaPlaneDeparture } from 'react-icons/fa6'

import { formatDate } from '@/utils/formatDate'
import { formatTimeDifference, formatTimeInPK } from '@/utils/formatTime'
import { stringHelper } from '@/utils/string'

const FlightTimeline = ({ segment }) => {
  return (
    <Card className='bg-base-100 mb-5 border-2 border-gray-200 rounded-xl'>
      <h2 className='bg-blue-50 p-2 rounded-t-lg text-center font-semibold w-full justify-center text-base'>
        {' '}
        {/* Monday, January 27, 2025 */}
        {formatDate(segment.seg_departure_datetime)}
      </h2>
      <CardContent>
        <div className='flex items-center gap-2'>
          <Timeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0
              }
            }}
            position='right'
          >
            {/* Departure */}
            <TimelineItem>
              <TimelineOppositeContent>
                <Typography variant='body2' fontWeight='bold'>
                  {formatTimeInPK(segment.seg_departure_datetime)}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color='primary' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Box display='flex' alignItems='center' gap={1} mb={1}>
                  {/* <img src="/media/icons/from.svg" alt="From" style={{ height: 24 }} /> */}
                  <FaPlaneDeparture className='text-primary' fontSize={20} />
                  <Typography fontWeight={600}>
                    <span style={{ color: '#6B7280' }}>
                      {segment?.d_airport?.municipality} ({segment?.d_airport?.iata_code})
                    </span>
                  </Typography>
                </Box>
                <Typography variant='body2' color='text.secondary'>
                  {formatTimeDifference(segment.seg_departure_datetime, segment.seg_arrival_datetime)}
                </Typography>
              </TimelineContent>
            </TimelineItem>

            {/* Arrival */}
            <TimelineItem>
              <TimelineOppositeContent>
                <Typography variant='body2' fontWeight='bold'>
                  {formatTimeInPK(segment.seg_arrival_datetime)}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color='primary' />
              </TimelineSeparator>
              <TimelineContent>
                <Box display='flex' alignItems='center' gap={1} mb={1}>
                  {/* <img src="/media/icons/going-to.svg" alt="To" style={{ height: 28 }} /> */}
                  <FaPlaneArrival className='text-primary' fontSize={23} />
                  <Typography fontWeight={600}>
                    <span style={{ color: '#6B7280' }}>
                      {segment?.a_airport?.municipality} ({segment?.a_airport?.iata_code})
                    </span>
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
          {segment.o_airline !== segment.m_airline && (
            <>
              <div className='flex items-center gap-2'>
                <img src={segment?.marketing_airline?.thumbnail} alt='img' className='h-16 w-16 object-contain' />
                <div>
                  <div>
                    {segment?.marketing_airline?.name && (
                      <h3 className='font-semibold text-base'>{segment?.marketing_airline?.name}</h3>
                    )}
                    {segment?.m_airline && (
                      <span className='text-gray-500 text-xs'>
                        {segment?.m_airline}-{segment?.m_flight_number}
                      </span>
                    )}
                  </div>
                  <span className='text-xs text-gray-500'>Marketing Airline</span>
                </div>
              </div>
            </>
          )}
          <div className='flex items-center gap-2'>
            <img src={segment?.operating_airline?.thumbnail} alt='img' className='h-16 w-16 object-contain' />
            <div>
              <div>
                {segment?.operating_airline?.name && (
                  <h3 className='font-semibold text-base'>{segment?.operating_airline?.name}</h3>
                )}
                {segment?.o_airline && (
                  <span className='text-gray-500 text-xs'>
                    {segment?.o_airline}-{segment?.o_flight_number}
                  </span>
                )}
              </div>
              {segment.o_airline !== segment.m_airline && (
                <span className='text-xs text-gray-500'>Operating Airline</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const BookingFlightDetail = ({ bookingClass, booked_segments, airline }) => {
  return (
    <>
      <Card className='bg-base-100 mb-5'>
        <CardContent>
          <div className='flex justify-between w-full space-x-0'>
            <h2 className='font-semibold text-lg'>Flight Details</h2>
            <h2 className='font-semibold text-lg text-right'>BookingClass: {bookingClass}</h2>
          </div>
          {booked_segments?.map((segment, key) => {
            return (
              <div className='mt-1 space-y-1' key={key}>
                <Accordion className='bg-base-200'>
                  <AccordionSummary
                    expandIcon={
                      <div className='bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center'>
                        <ExpandMoreIcon />
                      </div>
                    }
                  >
                    <div className='flex md:flex-row flex-col justify-between items-center w-full'>
                      <div className='flex items-center gap-2 mb-2'>
                        <FaPlaneDeparture className='text-primary' fontSize={30} />
                        <div>
                          <h3 className='font-semibold text-base'>{stringHelper.convertToAlpa(key + 1)}</h3>
                          <span className='text-gray-500 text-xs'>{formatDate(segment.seg_departure_datetime)}</span>
                        </div>
                      </div>
                      <div className='flex md:flex-row flex-col items-center gap-2  mt-3'>
                        <div className='flex items-center gap-2 mb-2 mr-6'>
                          <img
                            src={segment?.marketing_airline?.thumbnail}
                            alt='img'
                            className='h-16 w-16 object-contain'
                          />
                          <div>
                            <h3 className='font-semibold text-base'>{segment?.marketing_airline?.iata_code}</h3>
                            <span className='text-gray-500 text-xs'>
                              {segment?.m_airline}-{segment?.m_flight_number}
                            </span>
                          </div>
                        </div>
                        <div className='text-center'>
                          <h3 className='font-semibold text-base mb-0'>{segment?.seg_origin}</h3>
                          <span className='text-gray-500 text-xs'>
                            {formatTimeInPK(segment.seg_departure_datetime)}
                          </span>
                        </div>
                        <div className='text-center'>
                          <h3 className='text-gray text-xs mb-0'>
                            {formatTimeDifference(
                              segment.seg_departure_datetime,
                              segment?.childs.length === 0
                                ? segment.seg_arrival_datetime
                                : segment?.childs[segment?.childs.length - 1]?.seg_arrival_datetime
                            )}
                          </h3>
                          <div className='flex text-center items-center justify-center'>
                            <hr className='w-[30px] md:w-[100px] xl:w-[200px] border-2' />
                            <FaPlane fontSize={40} className='text-primary' />
                            <hr className='w-[30px] md:w-[100px] xl:w-[200px] border-2' />
                          </div>

                          {/* <span className="text-gray-500 flex items-center">
                                                        ------- <img src="/media/icons/plane.svg" alt="plane" className="mx-1" /> -------
                                                    </span> */}
                          <h3 className='text-gray text-xs mb-0'>
                            {segment?.childs.length == 0 ? 'Non-Stop' : segment?.childs.length + ' Stop'}
                          </h3>
                        </div>
                        <div className='text-center'>
                          <h3 className='font-semibold text-base mb-0'>
                            {segment?.childs.length === 0
                              ? segment.seg_destination
                              : segment?.childs[segment?.childs.length - 1]?.seg_destination}
                          </h3>
                          <span className='text-gray-500 text-xs'>
                            {formatTimeInPK(
                              segment?.childs.length === 0
                                ? segment.seg_arrival_datetime
                                : segment?.childs[segment?.childs.length - 1]?.seg_arrival_datetime
                            )}
                          </span>
                        </div>
                      </div>
                      <div></div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FlightTimeline segment={segment} />
                    {segment?.childs.length > 0 && (
                      <h1 className='text-primary text-base font-semibold text-center mb-5'>
                        Layover:{' '}
                        {formatTimeDifference(
                          segment?.seg_arrival_datetime,
                          segment?.childs[0]?.seg_departure_datetime
                        )}{' '}
                        at {segment?.a_airport?.name}
                      </h1>
                    )}

                    {segment?.childs?.map((sec_segment, index) => {
                      return (
                        <React.Fragment key={index}>
                          {index < 0 && (
                            <h1 className='text-primary text-base font-semibold text-center mb-5'>
                              Layover:{' '}
                              {formatTimeDifference(
                                sec_segment?.seg_arrival_datetime,
                                segment?.childs[index + 1]?.seg_departure_datetime
                              )}{' '}
                              at {sec_segment?.a_airport?.name}
                            </h1>
                          )}
                          <FlightTimeline segment={sec_segment} />
                        </React.Fragment>
                      )
                    })}
                  </AccordionDetails>
                </Accordion>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </>
  )
}

export default BookingFlightDetail
