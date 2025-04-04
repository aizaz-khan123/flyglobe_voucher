import { Typography } from '@mui/material'

import FlightSearch from './FlightSearch'
import { RecentSearch } from './RecentSearch'

const FlightComponent = () => {
  const flightImage = '/images/flight/FlightImage.png'

  return (
    <div className=''>
      <Typography variant='h4'>Book Flights</Typography>
      <div className='flight-img mt-2'>
        <img src={flightImage} alt='' className=' w-[100%]' />
      </div>
      <div className='mt-2'>
        <FlightSearch />
      </div>
      <div className='mt-4'>
        <RecentSearch />
      </div>
    </div>
  )
}

export default FlightComponent
