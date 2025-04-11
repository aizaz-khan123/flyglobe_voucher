'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Menu,
  Typography
} from '@mui/material'
import dayjs from 'dayjs'

import { FiSun } from 'react-icons/fi'
import { IoMoonOutline } from 'react-icons/io5'
import { PiSunHorizonLight } from 'react-icons/pi'

import { LuMenu } from 'react-icons/lu'

import { useSelector } from 'react-redux'

import InfoIcon from '@mui/icons-material/Info'

import { GoTypography } from 'react-icons/go'

import { FaPlane } from 'react-icons/fa6'

import AddCommission from './AddCommission'
import FlightFilter from './FlightFilter'
import FlightRouteDisplay from './FlightRouteDisplay'
import { useFlightSearchMutation, useInitiatingMutation } from '@/redux-store/services/api'
import FlightDetailDrawer from './FlightDetailDrawer'

import SearchResultExpireModal from './SearchResultExpireModal'
import { formatTime } from '@/utils/formatTime'

import FlightDetailModal from './FlightDetailModal'

import DateSelector from './DateSelector'

const stopsOptions = ['Non Stop', '1 Stop', '1+ Stops']

const departureTimes = [
  { label: '00:00 - 06:00', icon: <PiSunHorizonLight /> },
  { label: '06:00 - 12:00', icon: <FiSun /> },
  { label: '12:00 - 18:00', icon: <PiSunHorizonLight /> },
  { label: '18:00 - 24:00', icon: <IoMoonOutline /> }
]

const FlightFound = () => {
  const [flightFearOptionsData, setFlightFearOptionsData] = useState({})
  const [visible, setVisible] = useState(null)
  const [filterVisible, setFilterVisible] = useState(null)
  const connectors = useSelector(state => state.auth.connectors)

  const toggleVisible = index => setVisible(visible == index ? null : index)

  const toggleFilterVisible = index => setFilterVisible(filterVisible == index ? null : index)

  const router = useRouter()

  const searchParams = useSearchParams()
  const handleCloseFlightDetails = () => setVisible(null)

  // Memoized state for search parameters
  const [queryParams, setQueryParams] = useState({
    cabin_class: searchParams.get('cabin_class'),
    departure_date: searchParams.get('departure_date'),
    destination: searchParams.get('destination'),
    origin: searchParams.get('origin'),
    return_date: searchParams.get('return_date'),
    route_type: searchParams.get('route_type'),
    adult_count: searchParams.get('adult_count'),
    child_count: searchParams.get('child_count'),
    infant_count: searchParams.get('infant_count'),
    legsParam: searchParams.get('legs')
  })

  // Update state only when `searchParams` change
  useEffect(() => {
    setQueryParams({
      cabin_class: searchParams.get('cabin_class'),
      departure_date: searchParams.get('departure_date'),
      destination: searchParams.get('destination'),
      origin: searchParams.get('origin'),
      return_date: searchParams.get('return_date'),
      route_type: searchParams.get('route_type'),
      adult_count: searchParams.get('adult_count'),
      child_count: searchParams.get('child_count'),
      infant_count: searchParams.get('infant_count'),
      legsParam: searchParams.get('legs')
    })
  }, [searchParams])

  // Memoized `legs` array to prevent unnecessary recalculations
  const legs = useMemo(() => {
    return queryParams.legsParam?.split(',').reduce((acc, value, index, array) => {
      if (index % 3 === 0) {
        acc.push({
          origin: array[index],
          destination: array[index + 1],
          departure_date: array[index + 2]
        })
      }

      return acc
    }, [])
  }, [queryParams.legsParam])

  // API Hook
  const [flightSearchTrigger, { data: flightSearchData, isLoading: flightSreachIsloading }] = useFlightSearchMutation()

  const [initiateBookFareTrigger, { data: initiateBookFareData }] = useInitiatingMutation()

  // Prevent duplicate API calls
  const isFetching = useRef(false)
  const [mergeFlightResponse, setMergeFlightResponse] = useState([])

  const searchApiPayload = async () => {
    if (isFetching.current) return
    isFetching.current = true

    try {
      if (!queryParams.cabin_class || !queryParams.route_type) return

      if (!connectors?.length) {
        console.warn('No connectors found.')

        return
      }

      const promises = connectors.map(async connector => {
        const payload = {
          cabin_class: queryParams.cabin_class,
          departure_date: queryParams.departure_date,
          destination: queryParams.destination,
          origin: queryParams.origin,
          return_date: queryParams.route_type === 'ONEWAY' ? null : queryParams.return_date,
          route_type: queryParams.route_type,
          traveler_count: {
            adult_count: parseInt(queryParams.adult_count || '0', 10),
            child_count: parseInt(queryParams.child_count || '0', 10),
            infant_count: parseInt(queryParams.infant_count || '0', 10)
          },
          uid: connector.uuid,
          ...(queryParams.route_type === 'MULTICITY' && { legs })
        }

        const response = await flightSearchTrigger(payload)

        // ✅ Safely access data to avoid JavaScript errors
        return response?.data?.journey_legs?.flight_options || []
      })

      const results = await Promise.allSettled(promises)

      const mergedFlights = results
        .filter(result => result.status === 'fulfilled') // Ignore failed responses
        .flatMap(result => result.value) // Extract values

      setMergeFlightResponse(mergedFlights)
      setFilteredFlights(prev => [...prev, ...mergedFlights]) // Merge new results
    } catch (error) {
      console.error('Error fetching flights:', error)
    } finally {
      isFetching.current = false
    }
  }

  // Debounced API call with stable dependencies
  // const stableConnectors = useMemo(() => connectors, []); // Memoize `connectors`

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchApiPayload()
    }, 500) // 500ms debounce

    return () => clearTimeout(timeout)
  }, [queryParams, legs, connectors])

  const travelerCount =
    Number(queryParams?.adult_count || 0) +
    Number(queryParams?.child_count || 0) +
    Number(queryParams?.infant_count || 0)

  const initialValues = {
    traveler_count: {
      adult_count: Number(queryParams?.adult_count || 1),
      child_count: Number(queryParams?.child_count || 0),
      infant_count: Number(queryParams?.infant_count || 0)
    },

    route_type: queryParams?.route_type || 'ONEWAY',
    origin: queryParams?.origin || null,
    destination: queryParams?.destination || null,
    departure_date: queryParams?.departure_date || '',
    return_date: queryParams?.return_date || '',
    cabin_class: queryParams?.cabin_class || 'ECONOMY',
    traveler: '',

    legs: legs || [
      { origin: '', destination: '', departure_date: '' },
      { origin: '', destination: '', departure_date: '' }
    ]
  }

  const formatDuration = minutes => {
    const days = Math.floor(minutes / (24 * 60))
    const hours = Math.floor((minutes % (24 * 60)) / 60)
    const mins = minutes % 60

    const parts = []

    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`)
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`)
    if (mins > 0) parts.push(`${mins} minute${mins > 1 ? 's' : ''}`)

    return parts.join(' ')
  }

  const [open, setOpen] = useState(false)

  const [filteredFlights, setFilteredFlights] = useState(flightSearchData?.journey_legs?.flight_options || [])

  const [searchResultExpireModal, setsearchResultExpireModal] = useState(false)

  const handleCloseSearchResultExpireModal = () => setsearchResultExpireModal(false)

  const [openComission, setOpenComission] = useState(false)

  const searchResultExpireModalHandleOpen = () => setsearchResultExpireModal(true)

  const [bookingFareModal, setBookingFareModal] = useState(false)
  const handleCloseBookingFareModal = () => setBookingFareModal(false)

  const initiateBookFareHandler = async booking_id => {
    try {
      const response = await initiateBookFareTrigger({
        booking_id
      }).unwrap()

      setBookingFareModal(true)

      if (response?.status === true) {
        router.push(`/en/apps/flight/new-booking/${response?.data?.confirmation_id}`)
      }
    } catch (error) {
      console.error('Mutation failed:', error)
      let errorMessage = 'Something went wrong. Please try again.'

      if (
        error &&
        typeof error === 'object' &&
        'data' in error &&
        error.data &&
        typeof error.data === 'object' &&
        'message' in error.data
      ) {
        errorMessage = error.data.message
      }

      toaster.error(errorMessage)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [time, setTime] = useState(10 * 60)

  useEffect(() => {
    if (time <= 0) {
      searchResultExpireModalHandleOpen()

      return
    }

    const timer = setInterval(() => {
      setTime(prevTime => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [time])
  useEffect(() => {
    setTime(10 * 60)
  }, [queryParams])

  const airlines = useMemo(() => {
    if (!mergeFlightResponse) return []

    const uniqueAirlines = new Set(mergeFlightResponse.map(flight => flight.airline.name))

    return Array.from(uniqueAirlines)
  }, [flightSearchData])

  const [selectedStops, setSelectedStops] = useState([])
  const [selectedAirlines, setSelectedAirlines] = useState([])
  const [selectAllStops, setSelectAllStops] = useState(false)
  const [selectedDepartureTimes, setSelectedDepartureTimes] = useState([])
  const [selectAllDepartureTimes, setSelectAllDepartureTimes] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 })
  const [viewFlightDetailModal, setViewFlightDetail] = useState(false)
  const [flightData, setFlightData] = useState()

  const handleOpenViewFlightDetail = data => {
    setViewFlightDetail(true)
    setFlightData(data)
  }

  const handleCloseViewFlightDetail = () => {
    setViewFlightDetail(false)
    setFlightData('')
  }

  // Initialize filtered flights
  useEffect(() => {
    if (mergeFlightResponse) {
      setFilteredFlights(mergeFlightResponse)
    } else {
      setFilteredFlights([])
    }
  }, [flightSearchData])

  const handlePriceChange = (e, type) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: Number(e.target.value)
    }))
  }

  const handleStopChange = stopLabel => {
    let stopNumber = stopLabel === 'Non Stop' ? 0 : stopLabel === '1 Stop' ? 1 : 2

    setSelectedStops(prev => (prev.includes(stopNumber) ? prev.filter(s => s !== stopNumber) : [...prev, stopNumber]))

    // If manually selecting stops, turn off "Select All" mode
    setSelectAllStops(false)
  }

  const handleSelectAllToggle = () => {
    if (selectAllStops) {
      setSelectedStops([]) // Uncheck all stops
    } else {
      setSelectedStops([0, 1, 2]) // Select all stops
    }

    setSelectAllStops(!selectAllStops)
  }

  const handleAirlineChange = airline => {
    setSelectedAirlines(prev => (prev.includes(airline) ? prev.filter(a => a !== airline) : [...prev, airline]))
  }

  // Handle Departure Time Selection
  const handleDepartureTimeChange = timeLabel => {
    setSelectedDepartureTimes(prev =>
      prev.includes(timeLabel) ? prev.filter(t => t !== timeLabel) : [...prev, timeLabel]
    )

    setSelectAllDepartureTimes(false)
  }

  // Handle "Select All Departure Times" Toggle
  const handleSelectAllDepartureTimes = () => {
    if (selectAllDepartureTimes) {
      setSelectedDepartureTimes([])
    } else {
      setSelectedDepartureTimes(departureTimes.map(t => t.label))
    }

    setSelectAllDepartureTimes(!selectAllDepartureTimes)
  }

  const isWithinTimeRange = (departureTime, timeRange) => {
    const [start, end] = timeRange.split(' - ').map(t => parseInt(t.replace(':', ''), 10))

    const flightTime = parseInt(departureTime.replace(':', ''), 10)

    return flightTime >= start && flightTime <= end
  }

  // Filter flights when selectedStops updates
  useEffect(() => {
    if (!mergeFlightResponse) return

    const filtered = mergeFlightResponse.filter(flight => {
      const stops = flight.legs[0]?.segments?.length ? flight.legs[0].segments.length - 1 : 0

      const departureTime = flight.legs[0]?.segments[0]?.departure_datetime || ''

      // Convert price to a number (remove commas)
      const priceString = flight.fare_option[0]?.price?.gross_amount || '0'
      const price = Number(priceString.replace(/,/g, ''))

      const matchesStops = selectedStops.length === 0 || selectedStops.includes(stops)

      const matchesAirlines = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline.name)

      const matchesDepartureTime =
        selectedDepartureTimes.length === 0 ||
        selectedDepartureTimes.some(timeRange => isWithinTimeRange(departureTime, timeRange))

      const matchesPrice = price >= priceRange.min && price <= priceRange.max

      return matchesStops && matchesAirlines && matchesDepartureTime && matchesPrice
    })

    setFilteredFlights(filtered || [])
  }, [flightSearchData, selectedStops, selectedAirlines, selectedDepartureTimes, priceRange])

  const resetAllFilterHandler = () => {
    // Reset local state filters
    setPriceRange({ min: 0, max: 5000000 })
    setSelectedStops([])
    setSelectedAirlines([])
    setSelectedDepartureTimes([])
    setSelectAllStops(false)
    setSelectAllDepartureTimes(false)

    // Reset filtered flights to show all available flights
    if (mergeFlightResponse) {
      setFilteredFlights(mergeFlightResponse)
    }
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const openFlightInfo = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseFlightInfo = () => {
    setAnchorEl(null)
  }

  return (
    <div className='p-4 min-h-screen'>
      {/* Flight Filters & Results */}
      <h3 className='text-xl mb-5 font-bold space-x-2'>
        {flightSreachIsloading ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <span>{filteredFlights?.length}</span>
            <span>Flights Found</span>
            <span
              className='cursor-pointer inline lg:hidden'
              onClick={() => {
                toggleFilterVisible(2)
              }}
            >
              <LuMenu className='inline' />
            </span>
          </>
        )}
      </h3>

      <div className='grid grid-cols-12 gap-6'>
        {/* Filters Section */}
        <div className='col-span-12 hidden lg:block md:col-span-4 lg:col-span-3 md:sticky top-2'>
          <FlightFilter
            time={time}
            formatTime={formatTime}
            priceRange={priceRange}
            handlePriceChange={handlePriceChange}
            resetAllFilterHandler={resetAllFilterHandler}
            selectAllStops={selectAllStops}
            stopsOptions={stopsOptions}
            selectedStops={selectedStops}
            handleSelectAllToggle={handleSelectAllToggle}
            handleStopChange={handleStopChange}
            airlines={airlines}
            selectedAirlines={selectedAirlines}
            handleAirlineChange={handleAirlineChange}
            selectAllDepartureTimes={selectAllDepartureTimes}
            departureTimes={departureTimes}
            selectedDepartureTimes={selectedDepartureTimes}
            handleSelectAllDepartureTimes={handleSelectAllDepartureTimes}
            handleDepartureTimeChange={handleDepartureTimeChange}
          />
        </div>

        {/* Flight Results */}
        <div className='col-span-12 md:col-span-12 lg:col-span-9'>
          <div className=' p-1 rounded z-10'>
            <Card className='bg-base-100/80 backdrop-blur-lg rounded-lg shadow-md mb-5'>
              <CardContent>
                <div className='lg:flex justify-between items-center'>
                  <div>
                    <FlightRouteDisplay queryParams={queryParams} legs={legs} />
                    <span className='text-gray-500 text-sm'>
                      {queryParams?.route_type} • {travelerCount} Travelers • {queryParams?.cabin_class}
                    </span>
                  </div>
                  <div className='flex flex-col md:flex-row items-center gap-2'>
                    <div className='relative'>
                      <div className='relative inline-block'>
                        <AddCommission filteredFlights={filteredFlights} setFilteredFlights={setFilteredFlights} />
                      </div>
                    </div>

                    <Button variant='contained' className='max-sm:is-full is-auto' onClick={handleOpen}>
                      Change Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <DateSelector
              departure_date={queryParams?.departure_date}
              return_date={queryParams?.return_date}
              route_type={queryParams?.route_type}
            />
          </div>
          {flightSreachIsloading ? (
            <div className='flex justify-center items-center h-[50%]'>
              <CircularProgress />
            </div>
          ) : (
            <>
              <div>
                {filteredFlights.map((data, index) => (
                  <Card key={index} className='mb-5 static'>
                    <CardContent>
                      <div className='flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-center'>
                        <div className='flex items-center gap-2 mb-2'>
                          <img src={data?.airline?.thumbnail || ''} alt='img' className='h-14 w-14 object-contain' />
                          <div>
                            <h3 className='font-semibold text-base mb-1'>{data?.airline?.name}</h3>
                            <p className='text-gray-500 text-xs'>
                              {data?.legs?.map((leg, index) => leg.flight_number.join(', ')).join(' -> ')} •{' '}
                              {dayjs(flightSearchData?.journey_legs?.departure_date).format('ddd, MMM D, YYYY')}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='text-center'>
                            <h3 className='font-semibold text-base mb-0 h-4'>
                              {data?.legs[0]?.segments[0]?.origin?.iata_code}
                            </h3>
                            <span className='text-gray-500 text-xs'>
                              {dayjs(data?.legs[0]?.segments[0]?.departure_datetime).format('hh:mm A')}
                            </span>
                          </div>
                          <div className='text-center'>
                            <h3 className='text-gray text-xs mb-0'>
                              {data?.legs[0]?.journey_duration
                                ? formatDuration(data?.legs[0]?.journey_duration)
                                : 'N/A'}
                            </h3>
                            {/* <span className="text-gray-500 flex">
                              ----------{" "}
                              <img src="/media/icons/plane.svg" alt="" />{" "}
                              ---------- */}
                            <div className='flex text-center items-center justify-center'>
                              <hr className='w-[30px] md:w-[50px] xl:w-[200px] border-2' />
                              <FaPlane fontSize={30} className='text-primary' />
                              <hr className='w-[30px] md:w-[50px] xl:w-[200px] border-2' />
                            </div>
                            {/* </span> */}
                            <h3 className='text-gray text-xs mb-0'>
                              {data?.legs[0]?.segments?.length === 1 ? (
                                'Non-Stop'
                              ) : data?.legs[0]?.segments?.length === 2 ? (
                                `1 Stop (${data?.legs[0]?.segments[1]?.origin?.iata_code})`
                              ) : (
                                <>
                                  {`1+ Stops (`}
                                  {data?.legs[0]?.segments?.map(segment => segment?.origin?.iata_code).join('-')}
                                  {`)`}
                                </>
                              )}
                            </h3>
                          </div>
                          <div className='text-center'>
                            <h3 className='font-semibold text-base mb-0 h-4'>
                              {data?.legs[0]?.segments[data?.legs[0]?.segments.length - 1]?.destination?.iata_code}
                            </h3>
                            <span className='text-gray-500 text-xs'>
                              {dayjs(
                                data?.legs[0]?.segments[data?.legs[0]?.segments.length - 1]?.arrival_datetime
                              ).format('hh:mm A')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className='flex items-center justify-end gap-2'>
                            <h1 className='bg-blue-500 text-white font-semibold w-fit px-10 py-1 rounded-md text-sm'>
                              {data?.provider}
                            </h1>
                            {/* <span>|</span>
                            <img src="/media/icons/detail-icon.svg" className="" alt="" /> */}
                          </div>
                          {/* <Link href={`/flights/1`}> */}
                          <div className='flex flex-col'>
                            <Button
                              variant='outline'
                              className='border-0 font-semibold text-sm hover:bg-transparent hover:text-gray px-0'
                              size='xs'
                              onClick={() => handleOpenViewFlightDetail(data)}
                            >
                              {/* <img
                                  src="/media/icons/view-detail-icon.svg"
                                  alt=""
                                  className="h-4 w-4"
                                /> */}
                              View Flight Detail
                            </Button>
                            <Button
                              variant='outline'
                              className='border-0 font-semibold text-sm hover:bg-transparent hover:text-gray px-0'
                              size='xs'
                              onClick={() => {
                                toggleVisible(1), setFlightFearOptionsData(data)
                              }}
                            >
                              <img src='/media/icons/view-detail-icon.svg' alt='' />
                              View Detail
                            </Button>
                          </div>
                          {/* </Link> */}
                        </div>
                      </div>
                      {data?.fare_option?.map((faresGroupData, faresGroupIndex) => {
                        const baseFare = Number(faresGroupData?.price?.base_fare.replace(/,/g, '')) || 0

                        const tax = Number(faresGroupData?.price?.tax.replace(/,/g, '')) || 0

                        const grossAmount = Number(faresGroupData?.price?.gross_amount.replace(/,/g, '')) || 0

                        const totalFare = grossAmount
                        const formattedTotalFare = totalFare.toLocaleString()

                        return (
                          <>
                            <div className='grid grid-cols-12 items-center gap-2 border-t py-2'>
                              <div className='col-span-12 lg:col-span-6 xl:col-span-3 border-r-2 pe-2'>
                                <div className='flex justify-between items-center'>
                                  <p className='font-normal text-sm text-gray'>{faresGroupData?.rbd}</p>
                                  {faresGroupData?.has_meal ? (
                                    <img src='/media/icons/food-icon.svg' className='h-5' alt='' />
                                  ) : (
                                    <img src='/media/icons/no-food-icon.svg' className='h-5' alt='' />
                                  )}
                                </div>
                              </div>
                              <div className='col-span-12  lg:col-span-6 xl:col-span-5'>
                                {data?.name == 'SABRE_API' ? (
                                  <div className='flex gap-2 justify-start items-center'>
                                    <img src='/media/icons/baggage-icon.svg' className='h-5' alt='' />
                                    <p className='font-normal text-sm text-gray space-x-1'>
                                      <span>{faresGroupData?.bagage_info}</span>
                                    </p>

                                    <p
                                      className={`px-3 py-1 w-[10rem] text-center rounded-full text-xs font-medium ${faresGroupData.is_refundable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                    >
                                      {faresGroupData.is_refundable ? 'Refundable' : 'Non-Refundable'}
                                    </p>
                                  </div>
                                ) : (
                                  <div className='flex gap-2 justify-start items-center'>
                                    {faresGroupData?.bagage_info?.maxAllowedWeight?.weight === 0 ? (
                                      <img src='/media/icons/no-baggage-icon.svg' className='h-5' alt='' />
                                    ) : (
                                      <img src='/media/icons/baggage-icon.svg' className='h-5' alt='' />
                                    )}
                                    <p className='font-normal text-sm text-gray space-x-1'>
                                      {faresGroupData?.bagage_info?.maxAllowedWeight?.weight === 0 ? (
                                        'No Baggage'
                                      ) : (
                                        <>
                                          <span>{faresGroupData?.bagage_info?.maxAllowedWeight?.weight}</span>
                                          <span>
                                            {faresGroupData?.bagage_info?.maxAllowedWeight?.unitOfMeasureCode}
                                          </span>
                                          <span>
                                            (
                                            {faresGroupData?.bagage_info?.maxAllowedPieces === 0
                                              ? 'As per airline policy'
                                              : faresGroupData?.bagage_info?.maxAllowedPieces}{' '}
                                            PC)
                                          </span>
                                        </>
                                      )}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className='col-span-12 xl:col-span-4'>
                                <div className='flex items-center justify-between lg:justify-end gap-2'>
                                  <div className='flex items-center gap-2'>
                                    <span className='font-semibold text-base'>
                                      {faresGroupData?.price?.currency} {faresGroupData?.price?.gross_amount}
                                    </span>
                                    <div>
                                      <IconButton size='small' onClick={handleClick}>
                                        <InfoIcon fontSize='small' className='text-gray' />
                                      </IconButton>
                                      <Menu
                                        anchorEl={anchorEl}
                                        open={openFlightInfo}
                                        onClose={handleCloseFlightInfo}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                      >
                                        <Box p={2} minWidth={200}>
                                          <GoTypography variant='body2' color='textSecondary'>
                                            Price Detail
                                          </GoTypography>
                                          <Box display='flex' justifyContent='space-between' my={1}>
                                            <Typography variant='body2' color='textSecondary'>
                                              Base Fare
                                            </Typography>
                                            <Typography variant='body2' color='textSecondary'>
                                              {faresGroupData?.price?.currency} {faresGroupData?.price?.base_fare}
                                            </Typography>
                                          </Box>
                                          <Box display='flex' justifyContent='space-between' my={1}>
                                            <Typography variant='body2' color='textSecondary'>
                                              Tax
                                            </Typography>
                                            <Typography variant='body2' color='textSecondary'>
                                              {faresGroupData?.price?.currency} {faresGroupData?.price?.tax}
                                            </Typography>
                                          </Box>
                                          <Box display='flex' justifyContent='space-between' my={1}>
                                            <Typography variant='body2' color='textSecondary'>
                                              Gross Fare
                                            </Typography>
                                            <Typography variant='body2' color='textSecondary'>
                                              {faresGroupData?.price?.currency} {faresGroupData?.price?.gross_amount}
                                            </Typography>
                                          </Box>
                                          <Divider />
                                          <Box display='flex' justifyContent='space-between' mt={1}>
                                            <Typography variant='body2' color='textSecondary'>
                                              Total
                                            </Typography>
                                            <Typography variant='body2' color='textSecondary'>
                                              {faresGroupData?.price?.currency} {formattedTotalFare}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </Menu>
                                    </div>
                                  </div>
                                  <Button
                                    variant='contained'
                                    className='max-sm:is-full is-auto'
                                    onClick={() => {
                                      initiateBookFareHandler(faresGroupData?.booking_id)
                                    }}
                                  >
                                    Book Fare
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
              {mergeFlightResponse === false && <p className='text-gray-500 text-center'>No flight options found.</p>}
            </>
          )}
        </div>
      </div>
      <Drawer
        open={visible == 1}
        anchor='right'
        variant='temporary'
        onClose={handleCloseFlightDetails}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <FlightDetailDrawer
          flightFearOptionsData={flightFearOptionsData}
          flightSearchData={flightSearchData}
          formatDuration={formatDuration}
        />
      </Drawer>

      <Drawer
        open={filterVisible == 2}
        onClickOverlay={() => toggleFilterVisible(2)}

        // sideClassName="z-[50]"
        onClose={() => setFilterVisible(null)}
        end
        anchor='right'
        variant='temporary'
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <div className='w-full md:sticky top-2'>
          <FlightFilter
            time={time}
            formatTime={formatTime}
            priceRange={priceRange}
            handlePriceChange={handlePriceChange}
            resetAllFilterHandler={resetAllFilterHandler}
            selectAllStops={selectAllStops}
            stopsOptions={stopsOptions}
            selectedStops={selectedStops}
            handleSelectAllToggle={handleSelectAllToggle}
            handleStopChange={handleStopChange}
            airlines={airlines}
            selectedAirlines={selectedAirlines}
            handleAirlineChange={handleAirlineChange}
            selectAllDepartureTimes={selectAllDepartureTimes}
            departureTimes={departureTimes}
            selectedDepartureTimes={selectedDepartureTimes}
            handleSelectAllDepartureTimes={handleSelectAllDepartureTimes}
            handleDepartureTimeChange={handleDepartureTimeChange}
          />
        </div>
      </Drawer>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth='xl'
        PaperProps={{
          sx: {
            transform: 'translateY(-10%)'
          }
        }}
      >
        <DialogTitle className='border-b'>Change Search</DialogTitle>
        <DialogContent>
          {/* <FlightSearch
                        initialValues={initialValues}
                        flightSearchOpen={open}
                        flightSearchHandleClose={handleClose}
                    /> */}
        </DialogContent>
      </Dialog>
      <Dialog
        open={searchResultExpireModal}

        // onClose={handleCloseSearchResultExpireModal}
        onClose={handleCloseSearchResultExpireModal}
        maxWidth='md'
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            transform: 'translateY(-10%)'
          }
        }}
      >
        <DialogContent>
          <SearchResultExpireModal
            searchApiPayload={searchApiPayload}
            setTime={setTime}
            handleCloseSearchResultExpireModal={handleCloseSearchResultExpireModal}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={bookingFareModal}

        // onClose={handleCloseBookingFareModal}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseBookingFareModal()
          }
        }}
        maxWidth='md'
        disableEscapeKeyDown
      >
        <DialogContent>{/* <BookingFareModal /> */}</DialogContent>
      </Dialog>

      <FlightDetailModal
        viewFlightDetailModal={viewFlightDetailModal}
        handleCloseViewFlightDetail={handleCloseViewFlightDetail}
        data={flightData}
      />
    </div>
  )
}

export default FlightFound
