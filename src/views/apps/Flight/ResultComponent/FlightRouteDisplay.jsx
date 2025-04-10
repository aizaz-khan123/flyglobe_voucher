import { Fragment } from 'react'

const FlightRouteDisplay = ({ queryParams, legs }) => {
  if (queryParams?.route_type === 'MULTICITY') {
    return (
      <div className='flex items-center gap-2'>
        {legs?.map((leg, index) => (
          <Fragment key={index}>
            <h3 className='font-semibold text-lg mb-0'>{leg.origin}</h3>
            <img src='/media/icons/plane.svg' alt='' />
            <h3 className='font-semibold text-lg mb-0'>{leg.destination}</h3>
            {index < legs.length - 1 && <span>|</span>}
          </Fragment>
        ))}
      </div>
    )
  }

  if (queryParams?.route_type === 'RETURN') {
    return (
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-2'>
          <h3 className='font-semibold text-lg mb-0'>{queryParams?.origin}</h3>
          <img src='/media/icons/plane.svg' alt='' />
          <h3 className='font-semibold text-lg mb-0'>{queryParams?.destination}</h3>
        </div>
        <span>|</span>
        <div className='flex items-center gap-2'>
          <h3 className='font-semibold text-lg mb-0'>{queryParams?.destination}</h3>
          <img src='/media/icons/plane.svg' alt='' />
          <h3 className='font-semibold text-lg mb-0'>{queryParams?.origin}</h3>
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-2'>
      <h3 className='font-semibold text-lg mb-0'>{queryParams?.origin}</h3>
      <img src='/media/icons/plane.svg' alt='' />
      <h3 className='font-semibold text-lg mb-0'>{queryParams?.destination}</h3>
    </div>
  )
}

export default FlightRouteDisplay
