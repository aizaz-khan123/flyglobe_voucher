'use client'

import { Button, Card, CardContent, FormControlLabel, FormLabel, Switch, Slider } from '@mui/material'
import 'react-google-flight-datepicker/dist/main.css'

import { FaPencil } from 'react-icons/fa6'

const FlightFilter = ({
  time,
  priceRange,
  handlePriceChange,
  resetAllFilterHandler,
  selectAllStops,
  stopsOptions,
  selectedStops,
  handleSelectAllToggle,
  handleStopChange,
  airlines,
  selectedAirlines,
  handleAirlineChange,
  selectAllDepartureTimes,
  departureTimes,
  selectedDepartureTimes,
  handleSelectAllDepartureTimes,
  handleDepartureTimeChange,
  queryParamss,
  handleInputChange,
  handleClearSelectedFares,
  selectedFares
}) => {
  const queryParams = queryParamss

  const formatPrice = price => {
    return price.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })
  }

  const normalizeSelectedFares = Object.entries(selectedFares)

  return (
    <div className='col-span-12 md:col-span-4 lg:col-span-3 md:sticky top-2 '>
      {/* <div className='hidden lg:block'>
        <div className='p-4 rounded-md shadow-md mb-3 flex items-center justify-center gap-2'>
          <GoClock />
          <span className='text-gray-700 font-medium text-center gap-2'>{formatTime(time)}</span>
        </div>
        <p className='text-sm text-center my-2'>Book before the search expires!</p>
      </div> */}

      {normalizeSelectedFares.length > 0 && (
        <Card className='bg-white mb-5'>
          <CardContent className='p-3 border rounded-lg'>
            <div className='flex justify-between items-center mb-2'>
              <h3 className='text-lg font-semibold'>Selected Flights</h3>
              <Button
                size='sm'
                onClick={handleClearSelectedFares}
                className='text-primary flex items-center gap-1 bg-transparent outline-none border-none underline'
              >
                Clear All
              </Button>
            </div>
            <div>
              {normalizeSelectedFares.map(([sector, fare]) => (
                <div key={sector} className='flex items-center justify-between border rounded p-2 gap-2'>
                  <div>
                    <p className='font-medium'>
                      {sector} - {fare.airline}
                    </p>
                    <p className='text-sm text-gray-500'>{`PKR ${fare.price.gross_amount}`}</p>
                    <p className='text-xs text-gray-400'>{fare.booking_res_code}</p>
                  </div>
                  <FaPencil
                    onClick={handleClearSelectedFares}
                    className='cursor-pointer text-gray-600 hover:text-primary'
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <Card className='w-70 p-4 h-screen lg:h-auto lg:shadow-lg rounded-none lg:rounded-lg lg:mb-3 md:sticky md:top-2'>
        {/* <div className='block lg:hidden'>
          <div className='flex items-center justify-center gap-2'>
            <GoClock />
            <span className='text-gray-700 font-medium text-center gap-2'>{formatTime(time)}</span>
          </div>
          <p className='text-sm text-center my-1'>Book before the search expires!</p>
        </div> */}

        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-lg font-semibold'>Filters</h3>
          <Button
            size='sm'
            onClick={resetAllFilterHandler}
            className='text-primary flex items-center gap-1 bg-transparent outline-none border-none underline'
          >
            Reset All
          </Button>
        </div>

        <CardContent className='p-3 border rounded-lg mb-3'>
          <FormLabel className='flex justify-start items-start p-0'>Price Range</FormLabel>
          <div className='flex gap-2 mb-3'>
            <input
              type='text'
              className='w-1/2 border p-1 rounded text-center'
              value={formatPrice(priceRange.value[0])}
              onChange={e => handleInputChange(e, 0)}
            />
            <span className='text-gray-500'>-</span>
            <input
              type='text'
              className='w-1/2 border p-1 rounded text-center'
              value={formatPrice(priceRange.value[1])}
              onChange={e => handleInputChange(e, 1)}
            />
          </div>
          <Slider
            value={priceRange.value}
            onChange={handlePriceChange}
            min={priceRange.min}
            max={priceRange.max}
            valueLabelDisplay='auto'
            valueLabelFormat={value => value.toLocaleString('en-IN')}
            getAriaLabel={() => 'Price range'}
            className='text-primary'
            sx={{
              '& .MuiSlider-thumb': {
                color: '#8c57ff'
              },
              '& .MuiSlider-track': {
                color: '#8c57ff'
              },
              '& .MuiSlider-rail': {
                color: '#e5e7eb'
              },
              '& .MuiSlider-valueLabel': {
                backgroundColor: '#8c57ff',
                borderRadius: '4px',
                '&:before': {
                  display: 'none'
                }
              }
            }}
          />
        </CardContent>

        <CardContent className='p-3 border rounded-lg mb-3'>
          <FormLabel className='flex justify-start items-start p-0'>Stops</FormLabel>
          <FormControlLabel
            className='flex justify-between flex-row-reverse w-full'
            control={
              <Switch checked={selectAllStops} onChange={handleSelectAllToggle} color='primary' className='!m-0' />
            }
            label='Select All Stops'
            sx={{ color: 'gray', fontSize: '0.875rem', fontWeight: 500 }}
          />
          <div className='flex flex-col gap-2 mt-2'>
            {stopsOptions.map((stop, index) => (
              <label key={index} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  value={stop}
                  className='accent-blue-600'
                  checked={selectedStops.includes(stop === 'Non Stop' ? 0 : stop === '1 Stop' ? 1 : 2)}
                  onChange={() => handleStopChange(stop)}
                />
                {stop}
              </label>
            ))}
          </div>
        </CardContent>

        {airlines && airlines.length > 0 && (
          <CardContent className='p-3 border rounded-lg mb-3'>
            <FormLabel className='flex justify-start items-start p-0'>Airlines</FormLabel>
            <div className='flex flex-col gap-2 mt-2'>
              {airlines.map((airline, index) => (
                <label key={index} className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    value={airline}
                    className='accent-blue-600'
                    checked={selectedAirlines.includes(airline)}
                    onChange={() => handleAirlineChange(airline)}
                  />
                  {airline}
                </label>
              ))}
            </div>
          </CardContent>
        )}
        {/* <DateSelector
          departure_date={queryParams?.departure_date}
          return_date={queryParams?.return_date}
          route_type={queryParams?.route_type}
        /> */}
      </Card>
    </div>
  )
}

export default FlightFilter
