import React, { useState } from 'react'

import dayjs from 'dayjs'

import { Tabs, Tab, Box, Typography } from '@mui/material'

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  timelineItemClasses
} from '@mui/lab'

import BaggageInformation from './BaggageInformation'
import CancellationInformation from './CancellationInformation'

const FlightDetailDrawer = ({ flightFearOptionsData, formatDuration }) => {
  const [flightDrawerTabs, setFlightDrawerTabs] = useState('flightInfo')

  const handleChange = (event, newValue) => {
    setFlightDrawerTabs(newValue)
  }

  const legs = flightFearOptionsData.legs ? Object.values(flightFearOptionsData.legs).flat() : [];
  const combinedFareOptions = [
    ...(Array.isArray(flightFearOptionsData?.fare_option) ? flightFearOptionsData.fare_option : []),
    ...(Array.isArray(legs) ? legs.flatMap((leg) => Array.isArray(leg?.fare_option) ? leg.fare_option : []) : []),
  ];
  return (
    <Box className='min-h-full  p-5 shadow-lg rounded-lg border overflow-y-auto'>
      <Typography variant='h6' gutterBottom>
        Flight Details
      </Typography>

      <Tabs
        value={flightDrawerTabs}
        onChange={handleChange}
        variant='fullWidth'
        textColor='primary'
        indicatorColor='primary'
      >
        <Tab value='flightInfo' label='Flight Info' />
        <Tab value='baggage' label='Baggage' />
        <Tab value='cancellation' label='Cancellation' />
      </Tabs>

      <Box className='mt-5 overflow-hidden'>
        {flightDrawerTabs === 'flightInfo' && (
          <Box>
            {legs?.map((legsData, legIndex) => (
              <Box key={legIndex} className='mb-5'>
                <Typography variant='subtitle1' className='font-semibold  mb-3'>
                  Sector Detail: ({legsData?.sector[0]} - {legsData?.sector[1]})
                </Typography>
                {legsData?.segments?.map((segment, segmentIndex) => (
                  <Box key={segmentIndex}>
                    {segmentIndex !== 0 && (
                      <Box className='mt-1 text-xs flex items-center justify-center gap-1 border-t border-b py-2 border-dashed'>
                        ⏳{' '}
                        <span className='font-normal text-sm '>
                          {formatDuration(segment?.layover_waited_time)} layover - {segment?.origin?.name} (
                          {segment?.origin?.iata_code})
                        </span>
                      </Box>
                    )}
                    <Timeline
                      sx={{
                        [`& .${timelineItemClasses.root}:before`]: {
                          flex: 0,
                          padding: 0
                        }
                      }}
                      position='right'
                    >
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot color='primary' />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant='body2' className=''>
                            {dayjs(segment?.departure_datetime).format('hh:mm A')} - {segment?.origin?.country} (
                            {dayjs(segment?.departure_datetime).format('ddd, MMM D, YYYY')})
                          </Typography>
                          <Typography variant='body2' className=''>
                            ({segment?.origin?.iata_code}) {segment?.origin?.name}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>

                      <TimelineItem className='ms-[6px]'>
                        <TimelineSeparator>
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant='body2' className=''>
                            Duration: ({formatDuration(segment?.duration_minutes)}) | Flight: ({segment?.flight_number})
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>

                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot color='primary' />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant='body2' className=''>
                            {dayjs(segment?.arrival_datetime).format('hh:mm A')} - {segment?.destination?.country} (
                            {dayjs(segment?.arrival_datetime).format('ddd, MMM D, YYYY')})
                          </Typography>
                          <Typography variant='body2' className=''>
                            ({segment?.destination?.iata_code}) {segment?.destination?.name}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    </Timeline>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}

        {flightDrawerTabs === 'baggage' && flightFearOptionsData?.name === 'SABRE_API' && (
          <Box>
            <Typography variant='h6' className='mb-3'>
              Baggage Information
            </Typography>
            <BaggageInformation fareOptions={flightFearOptionsData.fare_option} />
          </Box>
        )}
        {flightDrawerTabs === 'cancellation' && (
          <Box>
            <Typography variant='h6' className='mb-3'>
              Cancellation Information
            </Typography>
            <CancellationInformation fareOptions={combinedFareOptions} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default FlightDetailDrawer
