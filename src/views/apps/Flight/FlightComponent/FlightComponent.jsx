import FlightSearch from './FlightSearch'
import { RecentSearch } from './RecentSearch'

const FlightComponent = () => {
  return (
    <div className=''>
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
