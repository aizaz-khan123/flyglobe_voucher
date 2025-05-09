'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer
} from '@mui/material'
import dayjs from 'dayjs'

import { FiSun } from 'react-icons/fi'
import { IoMoonOutline } from 'react-icons/io5'
import { PiSunHorizonLight } from 'react-icons/pi'

import { LuMenu } from 'react-icons/lu'

import { useSelector } from 'react-redux'

import { GoClock } from 'react-icons/go'

import { FaAngleDown, FaAngleUp, FaPlane } from 'react-icons/fa6'

import { IoMdClose } from 'react-icons/io'

import { FaPlaneDeparture } from 'react-icons/fa'

import FlightFilter from './FlightFilter'
import FlightRouteDisplay from './FlightRouteDisplay'
import { useFlightSearchMutation, useInitiatingMutation } from '@/redux-store/services/api'
import FlightDetailDrawer from './FlightDetailDrawer'

import SearchResultExpireModal from './SearchResultExpireModal'
import { formatTime } from '@/utils/formatTime'

import FlightDetailModal from './FlightDetailModal'

import DateSelector from './DateSelector'
import BookingFareModal from './BookingFareModal'
import FlightSearch from '../FlightComponent/FlightSearch'

import FareOptionCard from './FareOptionCard'
import FlightAccordianFilters from './FlightAccordianFilters'

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
  const anchorRef = useRef(null)

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
  const [selectedFares, setSelectedFares] = useState({})
  const [selectedAirlinesBySector, setSelectedAirlinesBySector] = useState({})
  const [activeSectorIndex, setActiveSectorIndex] = useState(1)
  const [legsLength, setLegsLength] = useState([])

  const handleCloseBookingFareModal = () => setBookingFareModal(false)

  const handleClearSelectedFares = () => {
    setSelectedFares({})
    setSelectedAirlinesBySector({})
    setActiveSectorIndex(1)
  }

  const initiateBookFareHandler = async bookingIds => {
    try {
      const response = await initiateBookFareTrigger({
        booking_id: bookingIds
      }).unwrap()

      setBookingFareModal(true)

      if (response?.status === true) {
        router.push(`/flight/new-booking/${response?.data}`)
      }
    } catch (error) {
      console.error('Mutation failed:', error)

      // Handle error
    }
  }

  const hasSubmittedRef = useRef(false)

  const handleFareSelect = (legIndex, fareData, flightData, allLegs) => {
    const sectorKey = fareData.sector
    const airline = fareData.airline.name
    const sectorKeys = Object.keys(allLegs || {})
    const totalSectors = sectorKeys.length

    setSelectedFares(prev => {
      const newFares = {
        ...prev,
        [sectorKey]: { ...fareData, airline }
      }

      if (Object.keys(newFares).length === totalSectors && !hasSubmittedRef.current) {
        hasSubmittedRef.current = true
        handleCombinedBooking(newFares, totalSectors)
      }

      return newFares
    })

    setSelectedAirlinesBySector(prev => ({
      ...prev,
      [sectorKey]: airline
    }))

    setActiveSectorIndex(prev => Math.min(prev + 1, totalSectors))
  }

  useEffect(() => {
    return () => {
      hasSubmittedRef.current = false
    }
  }, [])

  const handleCombinedBooking = async (fares, totalSectors) => {
    try {
      const bookingIds = []
      const sectorsProcessed = new Set()

      Object.values(fares).forEach(fare => {
        if (!fare?.sector) return
        const sectorKey = fare.sector

        if (!sectorsProcessed.has(sectorKey)) {
          sectorsProcessed.add(sectorKey)
          bookingIds.push(fare.booking_id)
        }
      })

      // Validate against actual sector count from current flight
      if (bookingIds.length !== totalSectors) {
        alert(`Missing ${totalSectors - bookingIds.length} sector selections`)

        return
      }

      const response = await initiateBookFareTrigger({
        booking_id: bookingIds
      }).unwrap()

      setBookingFareModal(true)

      if (response?.status === true) {
        router.push(`/flight/new-booking/${response?.data}`)
      }
    } catch (error) {
      console.error('Booking failed:', error)
      alert(error?.data?.message || 'Failed to process booking')
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
    const uniqueAirlines = new Set(mergeFlightResponse.map(flight => flight?.airline?.name))

    return Array.from(uniqueAirlines)
  }, [mergeFlightResponse])

  const [selectedStops, setSelectedStops] = useState([])
  const [selectedAirlines, setSelectedAirlines] = useState([])
  const [selectAllStops, setSelectAllStops] = useState(false)
  const [selectedDepartureTimes, setSelectedDepartureTimes] = useState([])
  const [selectAllDepartureTimes, setSelectAllDepartureTimes] = useState(false)

  // const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 })
  const [fareMaxPrice, setFareMaxPrice] = useState(0)
  const [fareMinPrice, setFareMinPrice] = useState(0)

  const [priceRange, setPriceRange] = useState({
    min: fareMinPrice,
    max: fareMaxPrice,
    value: [fareMinPrice, fareMaxPrice] // Explicit tuple type
  })

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
  }, [mergeFlightResponse])

  const handlePriceChange = (event, newValue) => {
    setPriceRange(prev => ({
      ...prev,
      value: newValue
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

  useEffect(() => {
    if (mergeFlightResponse) {
      const allPrices = mergeFlightResponse
        .flatMap(flight => {
          // PIA flights
          if (flight.provider === 'PIA_HITIT' || flight.provider === 'SABRE') {
            return flight.fare_option?.map(fare => parseFloat(fare?.price?.gross_amount?.replace(/,/g, '') || 0)) || []
          }

          // Airblue flights
          if (flight.provider === 'AIRBLUE_API') {
            const prices = []

            // Define the fare processor
            const processFare = fare => {
              const amount = fare?.price?.gross_amount

              if (amount) {
                const parsed = parseFloat(amount.replace(/,/g, '') || 0)

                if (!isNaN(parsed)) prices.push(parsed)
              }
            }

            // Handle leg-based fare_options
            if (flight.legs) {
              Object.values(flight.legs).forEach(legGroup => {
                legGroup.forEach(leg => {
                  leg.fare_option?.forEach(processFare)
                })
              })
            }

            return prices
          }

          return []
        })
        .filter(price => !isNaN(price))

      if (allPrices.length > 0) {
        const minPrice = Math.min(...allPrices)
        const maxPrice = Math.max(...allPrices)

        setFareMaxPrice(maxPrice)
        setFareMinPrice(minPrice)
        setPriceRange({
          min: minPrice,
          max: maxPrice,
          value: [minPrice, maxPrice]
        })
      }
    }
  }, [mergeFlightResponse])
  useEffect(() => {
    if (!mergeFlightResponse) return

    const filtered = mergeFlightResponse.filter(flight => {
      // Normalize legs to handle both PIA and Airblue structures
      const normalizedLegs = Array.isArray(flight?.legs)
        ? Array.isArray(flight?.legs[0])
          ? flight?.legs.flat() // Airblue: Flatten nested arrays
          : flight?.legs // PIA: Use as-is
        : Object.values(flight?.legs || {}).flat() // Handle Airblue object structure

      const stops = normalizedLegs?.[0]?.segments?.length ? normalizedLegs[0].segments.length - 1 : 0

      const departureTime = normalizedLegs?.[0]?.segments?.[0]?.departure_datetime || ''

      // Normalize fare_option to handle both array and object structures
      const fareOptions = Array.isArray(flight?.fare_option)
        ? flight?.fare_option
        : Object.values(flight?.fare_option || {})

      const hasMatchingFare = (() => {
        // Define price check function
        const checkFare = fare => {
          const priceStr = fare?.price?.gross_amount || '0'
          const price = parseFloat(priceStr.replace(/,/g, ''))

          return price >= priceRange.value[0] && price <= priceRange.value[1]
        }

        // PIA flights
        if (flight.provider === 'PIA_HITIT' || flight.provider === 'SABRE') {
          return flight.fare_option?.some(checkFare)
        }

        // Airblue flights
        if (flight.provider === 'AIRBLUE_API') {
          // Check leg-based fares
          if (flight.legs) {
            return Object.values(flight.legs).some(legGroup => legGroup.some(leg => leg.fare_option?.some(checkFare)))
          }

          return false
        }

        return false
      })()

      const matchesStops = selectedStops.length === 0 || selectedStops.includes(stops)
      const matchesAirlines = selectedAirlines.length === 0 || selectedAirlines.includes(flight?.airline?.name)

      // Check against sector-specific airline selections
      // Check against sector-specific airline selections
      const matchesSelectedSectors = Object.entries(selectedAirlinesBySector).every(([sectorKey, selectedAirline]) => {
        // Check if the flight has a leg in this sector with the selected airline
        const hasMatchingSector = normalizedLegs.some(leg => {
          // Ensure leg.sector is an array before joining
          const legSector = Array.isArray(leg.sector) ? leg.sector.join('-') : leg.sector

          return legSector === sectorKey && flight.airline.name === selectedAirline
        })

        return hasMatchingSector
      })

      const matchesDepartureTime =
        selectedDepartureTimes.length === 0 ||
        selectedDepartureTimes.some(timeRange => isWithinTimeRange(departureTime, timeRange))

      return matchesStops && matchesAirlines && matchesDepartureTime && hasMatchingFare && matchesSelectedSectors
    })

    setFilteredFlights(filtered || [])
  }, [selectedStops, selectedAirlines, selectedDepartureTimes, priceRange.value, selectedAirlinesBySector])

  const resetAllFilterHandler = () => {
    // Reset local state filters
    setPriceRange({
      min: fareMinPrice,
      max: fareMaxPrice,
      value: [fareMinPrice, fareMaxPrice]
    })
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

  const handleInputChange = (e, index) => {
    const value = Math.max(priceRange.min, Math.min(parseFloat(e.target.value) || 0, priceRange.max))

    setPriceRange(prev => {
      const newValue = [...prev.value]

      newValue[index] = value

      // Ensure min <= currentMin <= currentMax <= max
      if (index === 0) {
        newValue[1] = Math.max(newValue[1], value)
      } else {
        newValue[0] = Math.min(newValue[0], value)
      }

      return {
        ...prev,
        value: newValue
      }
    })
  }

  const getMinFare = flight => {
    // PIA flights
    if (flight.provider === 'PIA_HITIT' || flight.provider === 'SABRE') {
      const fares =
        flight.fare_option?.map(fare => parseFloat(fare?.price?.gross_amount?.replace(/,/g, '') || Infinity)) || []

      return fares.length ? Math.min(...fares) : Infinity
    }

    // Airblue flights
    if (flight.provider === 'AIRBLUE_API') {
      const fares = []

      // Leg-based fares
      if (flight.legs) {
        Object.values(flight.legs).forEach(legGroup => {
          legGroup.forEach(leg => {
            leg.fare_option?.forEach(fare => {
              fares.push(parseFloat(fare?.price?.gross_amount?.replace(/,/g, '') || Infinity))
            })
          })
        })
      }

      return fares.length ? Math.min(...fares) : Infinity
    }

    return Infinity
  }

  useEffect(() => {
    if (mergeFlightResponse) {
      const allPrices = mergeFlightResponse
        .flatMap(flight => {
          // PIA flights
          if (flight.provider === 'PIA_HITIT' || flight.provider === 'SABRE') {
            return flight.fare_option?.map(fare => parseFloat(fare?.price?.gross_amount?.replace(/,/g, '')) || 0) || []
          }

          // Airblue flights
          if (flight.provider === 'AIRBLUE_API' && flight.legs) {
            return Object.values(flight.legs).flatMap(legGroup =>
              legGroup.flatMap(leg =>
                leg.fare_option?.map(fare => parseFloat(fare?.price?.gross_amount?.replace(/,/g, '')) || [])
              )
            )
          }

          return []
        })
        .filter(price => !isNaN(price))

      if (allPrices.length > 0) {
        const minPrice = Math.min(...allPrices)
        const maxPrice = Math.max(...allPrices)

        setPriceRange({
          min: minPrice,
          max: maxPrice,
          value: [minPrice, maxPrice]
        })
      }
    }
  }, [mergeFlightResponse])

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    const aFare = getMinFare(a)
    const bFare = getMinFare(b)

    return aFare - bFare
  })

  const [anchorEl, setAnchorEl] = useState(null)
  const openFlightInfo = anchorEl

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseFlightInfo = () => {
    setAnchorEl(null)
  }

  // Add this helper function at the top of your component
  const getFirstLeg = legs => {
    if (!legs || legs.length === 0) return null
    const firstLeg = legs[0]

    return Array.isArray(firstLeg) ? firstLeg[0] : firstLeg
  }

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className='min-h-screen'>
      {/* Flight Filters & Results */}
      <h3 className='text-xl font-bold space-x-2'>
        {flightSreachIsloading ? (
          <>{/* <h1>Loading...</h1> */}</>
        ) : (
          <>
            {/* <span>{filteredFlights?.length}</span>
            <span>Flights Found</span> */}
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

      <div className='grid grid-cols-12 gap-6 justify-center'>
        {/* Filters Section */}
        {/* <div className='col-span-12 hidden lg:block md:col-span-4 lg:col-span-3 md:sticky top-2'>
          <FlightFilter
            time={time}
            formatTime={formatTime}
            priceRange={priceRange}
            handlePriceChange={handlePriceChange}
            handleInputChange={handleInputChange}
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
            queryParamss={queryParams}
            selectedFares={selectedFares}
            handleClearSelectedFares={handleClearSelectedFares}
          />
        </div> */}

        {/* Flight Results */}
        <div className='col-span-2'></div>
        <div className='col-span-12 md:col-span-12 lg:col-span-8'>
          <Card className='flex justify-between items-center rounded shadow-md p-2'>
            <div className='text-xl pl-4 font-bold'>
              <span>{filteredFlights?.length} </span>
              <span>Flights Found</span>
              <p className='text-sm text-center font-normal my-2'>Book before the search expires!</p>
            </div>

            <div className=' mb-3 flex flex-col items-center justify-center gap-2'>
              <GoClock className='text-gray-700 text-xl font-bold text-center' />
              <span className='text-gray-700 text-xl font-bold text-center gap-2'>{formatTime(time)}</span>
            </div>
          </Card>

          <div className='rounded z-10'>
            <div className='bg-base-100/80 py-2'>
              <div>
                <div className='lg:flex justify-between items-center'>
                  <div>
                    <FlightRouteDisplay queryParams={queryParams} legs={legs} />
                    <span className='text-gray-500 text-sm'>
                      {queryParams?.route_type} • {travelerCount} Travelers • {queryParams?.cabin_class}
                    </span>
                  </div>
                  <div className='flex flex-col md:flex-row items-center gap-2'>
                    {/* <div className='relative'>
                      <div className='relative inline-block'>
                        <AddCommission filteredFlights={filteredFlights} setFilteredFlights={setFilteredFlights} />
                      </div>
                    </div> */}

                    <Button variant='contained' size='small' className='max-sm:is-full is-auto' onClick={handleOpen}>
                      Change Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DateSelector
              departure_date={queryParams?.departure_date}
              return_date={queryParams?.return_date}
              route_type={queryParams?.route_type}
            />
            <div>
              <div
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className='text-sm text-primary bg-transparent transition-all cursor-pointer flex items-center gap-2 justify-end'
              >
                {isFilterOpen ? 'Close' : 'Open'} Filters {isFilterOpen ? <FaAngleUp /> : <FaAngleDown />}
              </div>

              <div
                className={`transition-all duration-1000 ease-in-out mb-[15px] overflow-hidden bg-white ${isFilterOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
              >
                <FlightAccordianFilters
                  time={time}
                  formatTime={formatTime}
                  priceRange={priceRange}
                  handlePriceChange={handlePriceChange}
                  handleInputChange={handleInputChange}
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
                  queryParamss={queryParams}
                  selectedFares={selectedFares}
                  handleClearSelectedFares={handleClearSelectedFares}
                />
              </div>
            </div>
          </div>
          {flightSreachIsloading ? (
            <div className='flex justify-center items-center h-[50%]'>
              <CircularProgress />
            </div>
          ) : (
            <>
              <div>
                <div>
                  {sortedFlights.map((data, index) => {
                    const allLegs = data?.legs || {}

                    const keys = Object.keys(allLegs)
                    const filteredKeys = keys.filter(key => Number(key) === activeSectorIndex)

                    const normalizedLegs = filteredKeys.map(key => allLegs[key]).flat()

                    // const normalizedLegs = data?.legs
                    //   ? Object.values(data.legs).flat() // Convert object to array of arrays and flatten
                    //   : []

                    // Normalize legs to handle both PIA and Airblue structures
                    const normalizedLegsData =
                      Array.isArray(data?.legs) && data?.legs.length > 0
                        ? Array.isArray(data?.legs[0])
                          ? data?.legs.flat() // Airblue: Flatten the nested arrays
                          : data?.legs // PIA: Use as-is
                        : [] // Fallback to an empty array if legs is undefined or empty

                    // Combine fare options from both the root and legs
                    const combinedFareOptions = [
                      ...(Array.isArray(data?.fare_option) ? data.fare_option : []),
                      ...(Array.isArray(normalizedLegs)
                        ? normalizedLegs.flatMap(leg => (Array.isArray(leg?.fare_option) ? leg.fare_option : []))
                        : [])
                    ]

                    return (
                      <Accordion
                        className='mb-2'
                        sx={{
                          marginBottom: '2rem',
                          border: 'none',
                          borderRadius: '10px',
                          backgroundColor: 'white',
                          '&::before': {
                            display: 'none'
                          }
                        }}
                        key={index}
                      >
                        <AccordionSummary
                          expandIcon={''}

                          // aria-controls={`panel${legIndex}-content`}
                          // id={`panel${legIndex}-header`}
                          className='rounded-lg'
                        >
                          <div className='w-full'>
                            <div className='flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-center'>
                              <div className='flex items-center gap-2 mb-2'>
                                {data?.airline?.thumbnail && Object.keys(data.airline.thumbnail).length === 0 ? (
                                  <img
                                    src={data?.airline?.thumbnail || ''}
                                    alt='img'
                                    className='h-14 w-14 object-contain'
                                  />
                                ) : (
                                  <FaPlaneDeparture fontSize={30} className='text primary' />
                                )}
                                <div>
                                  <h3 className='font-semibold text-base mb-1'>{data?.airline?.name}</h3>
                                  <p className='text-gray-500 text-xs'>
                                    {data.provider === 'AIRBLUE_API'
                                      ? normalizedLegs
                                        ?.map(leg =>
                                          Array.isArray(leg?.flight_number)
                                            ? leg?.flight_number.join(', ')
                                            : leg?.flight_number
                                        )
                                        .join(' -> ') || 'No Flight Numbers'
                                      : normalizedLegsData
                                        ?.map(leg =>
                                          Array.isArray(leg?.flight_number)
                                            ? leg?.flight_number.join(', ')
                                            : leg?.flight_number
                                        )
                                        .join(' -> ') || 'No Flight Numbers'}
                                    • {dayjs(flightSearchData?.journey_legs?.departure_date).format('ddd, MMM D, YYYY')}
                                  </p>
                                </div>
                              </div>
                              <div className='flex items-center gap-2'>
                                <div className='text-center'>
                                  <h3 className='font-semibold text-base mb-0 h-4'>
                                    {data.provider === 'AIRBLUE_API'
                                      ? normalizedLegs?.[0]?.segments[0]?.origin?.iata_code || 'N/A'
                                      : normalizedLegsData?.[0]?.segments[0]?.origin?.iata_code || 'N/A'}
                                  </h3>
                                  <span className='text-gray-500 text-xs'>
                                    {dayjs(normalizedLegsData?.[0]?.segments?.[0]?.departure_datetime).format(
                                      'hh:mm A'
                                    )}
                                  </span>
                                </div>
                                <div className='text-center'>
                                  <h3 className='text-gray text-xs mb-0'>
                                    {data.provider === 'AIRBLUE_API'
                                      ? normalizedLegs?.[0]?.journey_duration
                                        ? formatDuration(normalizedLegs?.[0]?.journey_duration)
                                        : 'N/A'
                                      : normalizedLegsData?.[0]?.journey_duration
                                        ? formatDuration(normalizedLegsData?.[0]?.journey_duration)
                                        : 'N/A'}
                                  </h3>
                                  {/* <span className="text-gray-500 flex">
                              ----------{" "}
                              <img src="/media/icons/plane.svg" alt="" />{" "}
                              ---------- */}
                                  <div className='flex text-center items-center justify-center'>
                                    <hr className='w-[30px] md:w-[50px] xl:w-[150px] border-2' />
                                    <FaPlane fontSize={30} className='text-primary' />
                                    <hr className='w-[30px] md:w-[50px] xl:w-[150px] border-2' />
                                  </div>
                                  {/* </span> */}
                                  <h3 className='text-gray text-xs mb-0'>
                                    {data.provider === 'AIRBLUE_API'
                                      ? normalizedLegs?.[0]?.segments?.length === 1
                                        ? 'Non-Stop'
                                        : normalizedLegs?.[0]?.segments?.length === 2
                                          ? `1 Stop (${normalizedLegs?.[0]?.segments[1]?.origin?.iata_code})`
                                          : `1+ Stops (${normalizedLegs?.[0]?.segments
                                            ?.map(segment => segment?.origin?.iata_code)
                                            .join('-')})`
                                      : normalizedLegsData?.[0]?.segments?.length === 1
                                        ? 'Non-Stop'
                                        : normalizedLegsData?.[0]?.segments?.length === 2
                                          ? `1 Stop (${normalizedLegsData?.[0]?.segments[1]?.origin?.iata_code})`
                                          : `1+ Stops (${normalizedLegsData?.[0]?.segments
                                            ?.map(segment => segment?.origin?.iata_code)
                                            .join('-')})`}
                                  </h3>
                                </div>
                                <div className='text-center'>
                                  <h3 className='font-semibold text-base mb-0 h-4'>
                                    {data.provider === 'AIRBLUE_API'
                                      ? normalizedLegs?.[0]?.segments[normalizedLegs?.[0]?.segments.length - 1]
                                        ?.destination?.iata_code || 'N/A'
                                      : normalizedLegsData?.[0]?.segments[normalizedLegsData?.[0]?.segments.length - 1]
                                        ?.destination?.iata_code || 'N/A'}
                                  </h3>
                                  <span className='text-gray-500 text-xs'>
                                    {dayjs(
                                      data.provider === 'AIRBLUE_API'
                                        ? normalizedLegs?.[0]?.segments[normalizedLegs?.[0]?.segments.length - 1]
                                          ?.arrival_datetime
                                        : normalizedLegsData?.[0]?.segments[
                                          normalizedLegsData?.[0]?.segments.length - 1
                                        ]?.arrival_datetime
                                    ).format('hh:mm A')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div>
                                <div className='flex items-center justify-between gap-2'>
                                  <Button className='bg-primary text-white w-fit rounded-md'>{data?.provider}</Button>
                                  <Button
                                    variant='contained'
                                    className='border-2 font-semibold text-sm bg-transparent text-gray-400 py-3'
                                    size='small'
                                    onClick={e => {
                                      e.stopPropagation()
                                      handleOpenViewFlightDetail(data)
                                    }}
                                  >
                                    {/* <img
                                  src="/media/icons/view-detail-icon.svg"
                                  alt=""
                                  className="h-4 w-4"
                                /> */}
                                    View Flight Detail
                                  </Button>
                                  <Button
                                    variant='contained'
                                    className='border-2 font-semibold text-sm bg-transparent text-gray-400 py-3'
                                    size='small'
                                    onClick={() => {
                                      toggleVisible(1)
                                      setFlightFearOptionsData(data)
                                    }}
                                  >
                                    <img src='/media/icons/view-detail-icon.svg' alt='' />
                                    View Detail
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionSummary>

                        <AccordionDetails>
                          {normalizedLegs[0]?.sector.length > 0 && (
                            <div className='border rounded-lg bg-[#F5F6FF] p-2 mb-3 text-center'>
                              {normalizedLegs[0]?.sector?.join(' → ')}
                            </div>
                          )}
                          <div className='grid grid-cols-12 gap-4'>
                            {[...(Array.isArray(data?.fare_option) ? data.fare_option : [])].map(
                              (faresGroupData, faresGroupIndex) => (
                                <FareOptionCard
                                  key={faresGroupIndex}
                                  faresGroupData={faresGroupData}
                                  data={data}
                                  initiateBookFareHandler={initiateBookFareHandler}
                                  handleClick={handleClick}
                                  anchorRef={anchorRef}
                                  openFlightInfo={openFlightInfo}
                                  anchorEl={anchorEl}
                                  allLegs={allLegs}
                                  handleCloseFlightInfo={handleCloseFlightInfo}
                                />
                              )
                            )}
                          </div>
                          {normalizedLegs.map((leg, legIndex) => {
                            const sectorKey = leg.sector.join('-')

                            return (
                              <div key={legIndex} className='grid grid-cols-12 gap-4'>
                                {/* <div className="col-span-12">
                                  {leg?.sector?.join(' → ') || 'Sector information not available'}
                                </div> */}
                                {[
                                  ...(Array.isArray(leg?.fare_option) ? leg.fare_option : [])

                                  // ...(Array.isArray(data?.fare_option) ? data.fare_option : [])
                                ].map((faresGroupData, faresGroupIndex) => (
                                  <FareOptionCard
                                    key={faresGroupIndex}
                                    faresGroupData={faresGroupData}
                                    legIndex={legIndex}
                                    sectorKey={sectorKey}
                                    data={data}
                                    isSelected={selectedFares[sectorKey]?.booking_id === faresGroupData.booking_id}
                                    handleFareSelect={handleFareSelect}
                                    initiateBookFareHandler={initiateBookFareHandler}
                                    handleClick={handleClick}
                                    anchorRef={anchorRef}
                                    openFlightInfo={openFlightInfo}
                                    anchorEl={anchorEl}
                                    allLegs={allLegs}
                                    handleCloseFlightInfo={handleCloseFlightInfo}
                                  />
                                ))}
                                {/* Sector Header */}
                                {/* <Accordion className='col-span-12 mb-3'>
                                  <AccordionSummary
                                    expandIcon={<IoIosArrowDown />}
                                    aria-controls={`panel${legIndex}-content`}
                                    id={`panel${legIndex}-header`}
                                    className='border rounded-lg bg-[#F5F6FF]'
                                  >
                                    <p className='font-bold text-sm text-gray-600 text-center w-full'>
                                      {leg?.sector?.join(' → ') || 'Sector information not available'}
                                    </p>
                                  </AccordionSummary>

                                  <AccordionDetails className='grid grid-cols-12 gap-4 pt-4'>
                                    {([
                                      ...(Array.isArray(leg?.fare_option) ? leg.fare_option : []),
                                      ...(Array.isArray(data?.fare_option) ? data.fare_option : [])
                                    ]).map((faresGroupData, faresGroupIndex) => (
                                      <FareOptionCard
                                        key={faresGroupIndex}
                                        faresGroupData={faresGroupData}
                                        legIndex={legIndex}
                                        sectorKey={sectorKey}
                                        data={data}
                                        isSelected={selectedFares[sectorKey]?.booking_id === faresGroupData.booking_id}
                                        handleFareSelect={handleFareSelect}
                                        initiateBookFareHandler={initiateBookFareHandler}
                                        handleClick={handleClick}
                                        anchorRef={anchorRef}
                                        openFlightInfo={openFlightInfo}
                                        anchorEl={anchorEl}
                                      />
                                    ))}
                                  </AccordionDetails>
                                </Accordion> */}
                              </div>
                            )
                          })}
                        </AccordionDetails>
                      </Accordion>
                    )
                  })}
                </div>
              </div>
              {!flightSreachIsloading && !isFetching.current && filteredFlights?.length === 0 ? (
                <p className='text-gray-500 text-center'>No flight options found.</p>
              ) : null}
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

        // onClickOverlay={() => toggleFilterVisible(2)}
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
            handleInputChange={handleInputChange}
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
            selectedFares={selectedFares}
            queryParamss={queryParams}
            handleClearSelectedFares={handleClearSelectedFares}
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
            // transform: 'translateY(-10%)'
          }
        }}
      >
        <div className='flex items-center justify-between border-b px-4 py-4'>
          <DialogTitle className='p-0 m-0'>Change Search</DialogTitle>
          <IoMdClose className='text-2xl cursor-pointer' onClick={handleClose} />
        </div>

        <DialogContent className='p-0'>
          <FlightSearch initialValues={initialValues} flightSearchOpen={open} flightSearchHandleClose={handleClose} />
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
        <DialogContent>
          <BookingFareModal />
        </DialogContent>
      </Dialog>

      <FlightDetailModal
        viewFlightDetailModal={viewFlightDetailModal}
        handleCloseViewFlightDetail={handleCloseViewFlightDetail}
        queryParams={queryParams}
        data={flightData}
      />
    </div>
  )
}

export default FlightFound
