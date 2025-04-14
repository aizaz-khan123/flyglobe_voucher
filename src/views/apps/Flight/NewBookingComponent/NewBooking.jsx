'use client'

import React, { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Input
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DateRangeIcon from '@mui/icons-material/DateRange'
import PersonIcon from '@mui/icons-material/Person'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { GrCloudUpload } from 'react-icons/gr'
import dayjs from 'dayjs'
import { FaPersonWalkingLuggage } from 'react-icons/fa6'
import PhoneInput from 'react-phone-input-2'

import 'react-phone-input-2/lib/style.css'
import { toast } from 'react-toastify'

import { useBookingAvailabilityConfirmationQuery, useBookingConfirmMutation } from '@/redux-store/services/api'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import MuiDatePicker from '@/components/mui-form-inputs/MuiDatePicker'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import MuiAutocomplete from '@/components/mui-form-inputs/MuiAutoComplete'
import { formattedDate, formatDate } from '@/utils/formatDate'
import { nationalities } from '@/data/dropdowns/nationalities'
import { gender, genderTitle } from '@/data/dropdowns/DropdownValues'

const passengerSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  passenger_type: yup.string().required('Passenger type is required'),
  date_of_birth: yup.string().required('Date of Birth is required'),
  gender: yup.string().required('Gender is required'),
  nationality: yup.string().required('Nationality is required'),
  d_type: yup.string().required('Document Type is required'),
  d_expiry: yup.string().required('Document Expiry is required'),
  d_number: yup.string().required('Document Number is required')
})

const validationSchema = yup.object().shape({
  passengers: yup.array().of(passengerSchema),
  confirmation_id: yup.string().required('Confirmation ID is required'),
  contact_number: yup.string().required('Contact number is required')
})

const NewBooking = () => {
  const { id } = useParams()
  const bookingId = id
  const [travelers, setTravelers] = useState([])
  const [expandedIndex, setExpandedIndex] = useState([])
  const [bookingConfirmTrigger, { isLoading: bookingConfirmationLoading }] = useBookingConfirmMutation()
  const toaster = toast()
  const router = useRouter()

  const {
    data: bookingAvailabilityConfirmationData,
    error,
    isLoading
  } = useBookingAvailabilityConfirmationQuery(bookingId, {
    refetchOnMountOrArgChange: true
  })

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      passengers: [],
      confirmation_id: bookingId,
      contact_number: ''
    },
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    if (bookingAvailabilityConfirmationData) {
      const travelerList = []

      const {
        adult_count = 0,
        child_count = 0,
        infant_count = 0
      } = bookingAvailabilityConfirmationData?.request?.traveler_count || {}

      for (let i = 1; i <= adult_count; i++) travelerList.push({ type: 'Adult', label: `Traveler ${i} : Adult` })
      for (let i = 1; i <= child_count; i++) travelerList.push({ type: 'Child', label: `Traveler ${i} : Child` })
      for (let i = 1; i <= infant_count; i++) travelerList.push({ type: 'Infant', label: `Traveler ${i} : Infant` })

      setTravelers(travelerList)
    }
  }, [bookingAvailabilityConfirmationData])

  useEffect(() => {
    reset({
      passengers: travelers.map(traveler => ({
        title: 'MR',
        first_name: '',
        last_name: '',
        passenger_type: traveler.type === 'Adult' ? 'ADT' : traveler.type === 'Child' ? 'CNN' : 'INF',
        date_of_birth: dayjs()
          .subtract(traveler.type === 'Adult' ? 11 : traveler.type === 'Child' ? 4 : 1, 'year')
          .format('YYYY-MM-DD'),
        gender: 'M',
        nationality: 'PK',
        d_type: 'P',
        d_expiry: dayjs().format('YYYY-MM-DD'),
        d_number: ''
      })),
      confirmation_id: bookingId,
      contact_number: ''
    })
  }, [travelers, reset, bookingId])

  const handleAccordionChange = index => {
    setExpandedIndex(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]))
  }

  const onSubmit = async data => {
    await bookingConfirmTrigger(data).then(response => {
      if (response.error) {
        setError('contact_number', { message: 'An error occurred.' })

        return
      }

      toaster.success('Booking has been Created Successfully.')
      setTimeout(() => {
        router.push(`/booking/${response?.data?.data?.booking_id || ''}`)
      }, 500)
    })
  }

  const travelerCount = bookingAvailabilityConfirmationData?.request?.traveler_count || {}
  const adult_count = travelerCount?.adult_count || 0
  const child_count = travelerCount?.child_count || 0
  const infant_count = travelerCount?.infant_count || 0

  const segmentData = bookingAvailabilityConfirmationData?.segment_data || []

  if (isLoading) return <Typography>Loading Booking Confirmation details...</Typography>
  if (error) return <Typography color='error'>Booking Time Expired. Please try again.</Typography>

  return (
    <>
      <div className='grid grid-cols-12 gap-3 p-4'>
        <div className='col-span-12'>
          <div>
            {/* Booking Header */}

            {/* ---------------------- Contact Details----------- */}

            <div className='grid grid-cols-12 gap-3'>
              <form className='col-span-9' onSubmit={handleSubmit(onSubmit)}>
                {/* <div className="col-span-9"> */}
                <Card className='bg-base-100 mb-5'>
                  <CardContent>
                    <div className='flex justify-between items-cente'>
                      <div>
                        <div className=' mb-2 ml-1'>
                          Flight Route Display component
                          {/* <FlightRouteDisplay queryParams={bookingAvailabilityConfirmationData?.request} legs={bookingAvailabilityConfirmationData?.request?.legs} /> */}
                        </div>
                        <div className='flex gap-3'>
                          <div className='flex gap-2'>
                            <DateRangeIcon />
                            <p className='text-gray-600 text-md font-bold'>
                              {formatDate(bookingAvailabilityConfirmationData?.request?.departure_date)}{' '}
                            </p>
                          </div>

                          {adult_count > 0 && (
                            <div className='flex gap-2'>
                              <PersonIcon />
                              <p className='text-gray-600 text-md font-bold'>{adult_count} Adult</p>
                            </div>
                          )}

                          {child_count > 0 && (
                            <div className='flex gap-2'>
                              <ChildCareIcon />
                              <p className='text-gray-600 text-md font-bold'>{child_count} Child</p>
                            </div>
                          )}

                          {infant_count > 0 && (
                            <div className='flex gap-2'>
                              <ChildFriendlyIcon />
                              <p className='text-gray-600 text-md font-bold'>{infant_count} Infant</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h2 className='text-md font-semibold text-primary'>Booking Confirmation</h2>

                        <h2 className='text-xl font-semibold ml-3'>{bookingId}</h2>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <div className='pb-0'>
                    <div className='flex gap-2 items-center p-4'>
                      <div className='bg-primary rounded-lg p-3 flex items-center justify-center'>
                        <PhoneEnabledIcon className='text-white' />
                      </div>
                      <h2 className='text-2xl font-semibold'>Contact Details</h2>
                    </div>
                  </div>

                  <Accordion
                    className='mt-0  pl-6 pr-6'
                    disableGutters
                    sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
                    defaultExpanded
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} className='text-lg font-semibold px-0'>
                      <h2 className='text-md font-semibold'>Lead Traveler</h2>
                    </AccordionSummary>

                    <AccordionDetails className='p-0'>
                      <div className='flex justify-between pb-10 pr-5'>
                        <div className='w-1/3'>
                          <Controller
                            name='contact_number'
                            control={control}
                            render={({ field: { ref, ...field }, fieldState }) => (
                              <div className='w-full'>
                                <PhoneInput
                                  {...field}
                                  country='pk'
                                  onChange={value => field.onChange(value)}
                                  containerClass='w-full'
                                  inputClass='w-full px-3 py-2 border border-gray-300 text-black ps-12 from-control rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                                />
                                {fieldState.error && (
                                  <div className='text-xs text-[#d32f2f] tracking-wide font-normal font-serif ms-2 mt-1'>
                                    {fieldState.error?.message}
                                  </div>
                                )}
                              </div>
                            )}
                          />
                        </div>

                        {/* Contact Details Button */}
                        <div className='bg-blue-100 py-4 px-8 rounded-lg w-[20rem]'>
                          <p className='text-black text-2xl font-semibold text-start'>Contact Details</p>
                          <span>{watch('contact_number')}</span>
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </Card>

                <Card className=' mt-5'>
                  <div className='pb-0 px-4'>
                    <div className='flex gap-2 items-center py-4 '>
                      <div className='bg-primary rounded-lg p-3 flex justify-center items-center'>
                        <FaPersonWalkingLuggage className='text-white text-[1.5rem]' />
                      </div>
                      <h2 className='text-2xl font-semibold'> Traveler Details</h2>
                    </div>
                  </div>

                  {travelers?.map((traveler, index) => (
                    <Accordion
                      key={index}
                      expanded={expandedIndex.includes(index)} // Auto-expand on validation error
                      onChange={() => handleAccordionChange(index)}
                      className='pl-5 pr-5 shadow-none'
                      disableGutters
                      sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        className='text-lg font-semibold px-0'
                        sx={{
                          minHeight: 'unset',
                          '&.Mui-expanded': { minHeight: 'unset' }
                        }}
                      >
                        <h2 className='text-md font-semibold'>{traveler.label}</h2>
                      </AccordionSummary>
                      <AccordionDetails className='p-0 pr-5'>
                        <div className='grid grid-cols-12 gap-5'>
                          <div className='col-span-12 mb-5 gap-6 flex items-center justify-between'>
                            <div className='w-5/6'>
                              <label className='block text-gray-700 font-medium mb-2'>Upload File</label>
                              <div className='relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:border-blue-500 transition'>
                                <Input
                                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                  type='file'
                                />
                                <GrCloudUpload className='text-4xl' />
                                <p className='text-gray-500 text-sm'>Click to upload file</p>
                              </div>
                            </div>

                            <Button className='text-md font-normal px-5 mt-8' variant='contained'>
                              Scan Passport
                            </Button>
                          </div>
                          <div className='col-span-12 mb-5'>
                            <MuiTextField
                              control={control}
                              name={`passengers.${index}.passenger_type`}
                              label='Passenger Type'
                            />
                          </div>
                          <div className='col-span-2 mb-5'>
                            <MuiDropdown
                              control={control}
                              name={`passengers.${index}.title`}
                              label='Title'
                              placeholder='Title'
                              options={genderTitle.map(title => ({
                                value: title,
                                label: `${title}`
                              }))}
                            />
                          </div>
                          <div className='col-span-5 mb-5'>
                            <MuiTextField
                              control={control}
                              name={`passengers.${index}.first_name`}
                              label='First Name'
                            />
                          </div>
                          <div className='col-span-5 mb-5'>
                            <MuiTextField control={control} name={`passengers.${index}.last_name`} label='Last Name' />
                          </div>
                          <div className='col-span-6 mb-5'>
                            <MuiDatePicker
                              control={control}
                              name={`passengers.${index}.date_of_birth`}
                              label='Date of Birth*'
                              minDate={dayjs().subtract(100, 'year')}
                              maxDate={dayjs()}
                            />
                          </div>
                          <div className='col-span-6 mb-5'>
                            <MuiDropdown
                              control={control}
                              placeholder='Gender'
                              name={`passengers.${index}.gender`}
                              label='Gender'
                              options={gender.map(gender => ({
                                value: gender.value,
                                label: `${gender.label}`
                              }))}
                            />
                          </div>
                          <div className='col-span-6 mb-5'>
                            <MuiAutocomplete
                              control={control}
                              name={`passengers.${index}.nationality`}
                              label='Nationality'
                              value={'PK'}
                              options={nationalities.map(nationality => ({
                                value: nationality?.value,
                                label: nationality?.label
                              }))}
                            />
                          </div>

                          <div className='col-span-6 mb-5'>
                            <MuiDropdown
                              control={control}
                              name={`passengers.${index}.d_type`}
                              label='Document Type'
                              placeholder='Document'
                              options={[
                                { label: 'CNIC', value: 'I' },
                                { label: 'PASSPORT', value: 'P' }
                              ].map(document => ({
                                value: document?.value,
                                label: document?.label
                              }))}
                            />
                          </div>
                          <div className='col-span-6 mb-5'>
                            <MuiDatePicker
                              control={control}
                              name={`passengers.${index}.d_expiry`}
                              label='Passport Expiry*'
                            />
                          </div>
                          <div className='col-span-6 mb-5'>
                            <MuiTextField
                              control={control}
                              name={`passengers.${index}.d_number`}
                              label='Document Number'
                            />
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Card>
                <Button
                  variant='contained'
                  className='text-md font-normal px-5 mt-6'
                  // size='md'
                  style={{ float: 'right' }}
                  onClick={handleSubmit(onSubmit)}
                  loading={bookingConfirmationLoading}
                  disabled={bookingConfirmationLoading}
                >
                  Booking Confirm
                </Button>
                {/* </div> */}
              </form>
              <div className='col-span-3'>
                <Card className='bg-base-100 mb-5'>
                  <CardContent>
                    <div className='flex justify-center'>
                      <img src='/images/figma/study-abroad.svg' alt='img' />
                    </div>
                  </CardContent>
                </Card>
                <div>
                  {bookingAvailabilityConfirmationData?.fare_info_list?.length > 0 && (
                    <Card className='bg-base-100 mb-5'>
                      <CardContent>
                        <Typography variant='h6' fontWeight='600' mb={2}>
                          Price Summary
                        </Typography>

                        {bookingAvailabilityConfirmationData?.fare_info[0]?.price?.fare_break_down &&
                          Object.entries(bookingAvailabilityConfirmationData?.fare_info[0]?.price?.fare_break_down)
                            .length > 0 && (
                            <div>
                              {Object.entries(
                                bookingAvailabilityConfirmationData?.fare_info[0]?.price?.fare_break_down
                              ).map(([key, data], index) => {
                                const passengerType =
                                  key === 'ADT' ? 'Adult' : key === 'CNN' ? 'Child' : key === 'INF' ? 'Infant' : key

                                return (
                                  <div key={index} className='flex justify-between border-b pb-2'>
                                    <p className='font-semibold'>
                                      {bookingAvailabilityConfirmationData?.airline?.iata_code} ({passengerType}) x{' '}
                                      {data?.quantity}:
                                    </p>
                                    <p className='text-gray-400'>
                                      {data?.prices?.currency} {data?.prices?.gross_amount}
                                    </p>
                                  </div>
                                )
                              })}

                              <div className='flex mt-4 border-b pb-2'>
                                <h4 className='font-semibold'>Price you Pay:</h4>
                                <h4 className='text-blue-600 font-bold ml-[55px]'>
                                  {bookingAvailabilityConfirmationData?.fare_info[0]?.price?.currency}{' '}
                                  {bookingAvailabilityConfirmationData?.fare_info[0]?.price?.gross_amount}
                                </h4>
                              </div>
                            </div>
                          )}

                        <Accordion className='p-0 ' sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                          <AccordionSummary
                            expandIcon={
                              <div className=' text-black rounded-full w-8 h-8 flex items-center justify-center'>
                                <ExpandMoreIcon />
                              </div>
                            }
                            className='text-lg font-bold mb-3 !px-0'
                          >
                            <h1 className='text-lg font-bold'>Fare Breakdown</h1>
                          </AccordionSummary>

                          <AccordionDetails className='!p-0'>
                            <div className='space-y-5'>
                              {bookingAvailabilityConfirmationData?.fare_info[0]?.price?.fare_break_down &&
                                Object.entries(
                                  bookingAvailabilityConfirmationData?.fare_info[0]?.price?.fare_break_down
                                ).map(([key, data], index) => {
                                  const passengerType =
                                    key === 'ADT' ? 'Adult' : key === 'CHILD' ? 'Child' : key === 'INF' ? 'Infant' : key

                                  return (
                                    <div key={index} className='border p-2 rounded-md'>
                                      <Typography className='px-0'>
                                        <h2 className='font-semibold text-lg py-3'>{passengerType}</h2>
                                      </Typography>
                                      <hr className='mb-2 mt-0' />
                                      <div>
                                        <div className='flex justify-between items-center mb-1'>
                                          <p className='text-gray-800 text-sm font-semibold'>Base Fare:</p>
                                          <p className='text-gray text-sm font-semibold text-end'>
                                            {data?.prices?.currency} {data?.prices?.base_fare}
                                          </p>
                                        </div>
                                        <div className='flex justify-between items-center mb-1'>
                                          <p className='text-gray-800 text-sm font-semibold'>Tax:</p>
                                          <p className='text-gray text-sm font-semibold text-end'>
                                            {data?.prices?.currency} {data?.prices?.tax}
                                          </p>
                                        </div>
                                        <div className='flex justify-between items-center mb-1'>
                                          <p className='text-gray-800 text-sm font-semibold'>Gross Fare:</p>
                                          <p className='text-gray text-sm font-semibold text-end'>
                                            {data?.prices?.currency} {data?.prices?.gross_amount}
                                          </p>
                                        </div>
                                        <hr className='border mt-3' />
                                        <div className='flex justify-between mt-4'>
                                          <h4 className='font-semibold text-lg'>Total to Pay:</h4>
                                          <h4 className='text-blue-600 font-bold text-lg'>
                                            {data?.prices?.currency} {data?.prices?.gross_amount}
                                          </h4>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </CardContent>
                    </Card>
                  )}

                  {/* <Card className='bg-base-100 mb-5'>
                    <CardContent>
                      <Typography variant='h6' fontWeight='600' mb={2}>
                        Price Summary
                      </Typography>
                      <div>
                        {Object.entries(
                          bookingAvailabilityConfirmationData?.fare_info_list[0]?.price?.fare_break_down || {}
                        ).map(([key, data], index) => {
                          const passengerType =
                            key === 'ADT' ? 'Adult' : key === 'CNN' ? 'Child' : key === 'INF' ? 'Infant' : key
                          return (
                            <div key={index} className='flex justify-between border-b pb-2'>
                              <p className='font-semibold'>
                                {bookingAvailabilityConfirmationData?.airline?.iata_code} ({passengerType}) x{' '}
                                {data?.quantity}:
                              </p>
                              <p className='text-gray-400'>
                                {data?.prices?.currency} {data?.prices?.gross_amount}
                              </p>
                            </div>
                          )
                        })}

                        <div className='flex mt-4 border-b pb-2'>
                          <h4 className='font-semibold'>Price you Pay:</h4>
                          <h4 className='text-blue-600 font-bold ml-[55px]'>
                            {bookingAvailabilityConfirmationData?.fare_info_list[0]?.price.currency}{' '}
                            {bookingAvailabilityConfirmationData?.fare_info_list[0]?.price.gross_amount}
                          </h4>
                        </div>
                      </div>
                      <Accordion
                        className='p-0 '
                        disableGutters
                        sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <div className='bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center'>
                              <ExpandMoreIcon />
                            </div>
                          }
                          className='text-lg font-bold mb-3 !px-0'
                        >
                          <h1 className='text-lg font-bold'>Fare Breakdown</h1>
                        </AccordionSummary>

                        <AccordionDetails className='!p-0'>
                          <div className='space-y-5'>
                            {Object.entries(
                              bookingAvailabilityConfirmationData?.fare_info_list[0]?.price?.fare_break_down || {}
                            ).map(([key, data], index) => {
                              const passengerType =
                                key === 'ADT' ? 'Adult' : key === 'CHILD' ? 'Child' : key === 'INF' ? 'Infant' : key
                              return (
                                <div key={index} className='border p-2 rounded-md'>
                                  <Typography className='px-0'>
                                    <h2 className='font-semibold text-lg py-3'>{passengerType}</h2>
                                  </Typography>
                                  <hr className='mb-2 mt-0' />
                                  <div>
                                    <div className='flex justify-between items-center mb-1'>
                                      <p className='text-gray-800 text-sm font-semibold'>Base Fare:</p>
                                      <p className='text-gray text-sm font-semibold text-end'>
                                        {data?.prices?.currency} {data?.prices?.base_fare}
                                      </p>
                                    </div>
                                    <div className='flex justify-between items-center mb-1'>
                                      <p className='text-gray-800 text-sm font-semibold'>Tax:</p>
                                      <p className='text-gray text-sm font-semibold text-end'>
                                        {data?.prices?.currency} {data?.prices?.tax}
                                      </p>
                                    </div>
                                    <div className='flex justify-between items-center mb-1'>
                                      <p className='text-gray-800 text-sm font-semibold'>Gross Fare:</p>
                                      <p className='text-gray text-sm font-semibold text-end'>
                                        {data?.prices?.currency} {data?.prices?.gross_amount}
                                      </p>
                                    </div>
                                    <hr className='border mt-3' />
                                    <div className='flex justify-between mt-4'>
                                      <h4 className='font-semibold text-lg'>Total to Pay:</h4>
                                      <h4 className='text-blue-600 font-bold text-lg'>
                                        {data?.prices?.currency} {data?.prices?.gross_amount}
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card> */}
                </div>
                <div>
                  {segmentData.map((sector, sectorIndex) => {
                    const firstSegment = sector.segments[0]
                    const lastSegment = sector.segments[sector.segments.length - 1]
                    const totalStops = sector.segments.length - 1
                    const layoverAirports = sector.segments.slice(0, -1).map(seg => seg.destination.iata_code)

                    return (
                      <Card key={sectorIndex} className='bg-base-100 mb-5'>
                        <CardContent>
                          <Typography>
                            {/* <h2 className="font-semibold text-lg">Trip Summary - Flight {sectorIndex + 1}</h2> */}
                            Trip Summary - Flight {sectorIndex + 1}
                          </Typography>

                          <div>
                            {/* Total Journey Duration */}
                            <div className='mt-3'>
                              <p className='text-gray-500 text-sm'>
                                Total Flight Duration: {Math.floor(sector.journey_duration / 60)}h{' '}
                                {sector.journey_duration % 60}m
                              </p>
                            </div>

                            {/* Departure & Arrival Dates */}
                            <div className='flex items-center justify-between mt-5'>
                              <div className='border-b pb-2'>
                                <p className='font-semibold'>Departure</p>
                                date string
                                {/* <p className="text-gray-400">{formattedDate(firstSegment.departure_datetime)}</p> */}
                              </div>

                              <div className=''>
                                <p className='font-semibold'>Arrival</p>
                                date string
                                {/* <p className="text-gray-400">{formattedDate(lastSegment.arrival_datetime)}</p> */}
                              </div>
                            </div>

                            {/* Airports & Timeline */}
                            <div className='flex items-center gap-2 mt-3 justify-center'>
                              <div className='text-center'>
                                <h3 className='font-semibold text-base mb-0 h-4'>{firstSegment.origin.iata_code}</h3>
                                <span className='text-gray-500 text-xs'>
                                  {new Date(firstSegment.departure_datetime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>

                              <div className='text-center'>
                                <span className='text-gray-500 flex items-center'>
                                  --------------
                                  {/* <img src="/media/icons/plane.svg" alt="plane" className="mx-1" />  */}
                                </span>
                                {/* <h3 className="text-gray text-xs mb-0">
                                                                {totalStops > 0 ? `${totalStops} Stop${totalStops > 1 ? 's' : ''}` : 'Non-Stop'}
                                                            </h3> */}

                                <h3 className='text-gray text-xs mb-0'>
                                  {totalStops > 0 ? (
                                    <>
                                      {totalStops} Stop{totalStops > 1 ? 's' : ''}
                                      {layoverAirports.length > 0 && (
                                        <>
                                          {' ('}
                                          {layoverAirports.join(', ')}
                                          {')'}
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    'Non-Stop'
                                  )}
                                </h3>
                              </div>

                              <div className='text-center'>
                                <h3 className='font-semibold text-base mb-0 h-4'>
                                  {lastSegment.destination.iata_code}
                                </h3>
                                <span className='text-gray-500 text-xs'>
                                  {new Date(lastSegment.arrival_datetime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewBooking
