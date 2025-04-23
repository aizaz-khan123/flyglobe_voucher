'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { FaArrowRight, FaArrowRightArrowLeft, FaCalendar } from 'react-icons/fa6'
import { Card, CardContent } from '@mui/material'
import CryptoJS from 'crypto-js'

const SECRET_KEY = 'my_random_secret_key_12345'

export const RecentSearch = () => {
  const router = useRouter()
  const [recentSearches, setRecentSearches] = useState([])
  const [payloadValues, setPayloadValues] = useState('')

  // Function to decrypt data
  const decryptData = ciphertext => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8)

      return decryptedData ? JSON.parse(decryptedData) : []
    } catch (error) {
      console.error('Decryption error:', error)

      return []
    }
  }

  useEffect(() => {
    // Retrieve recent searches from local storage
    const storedSearches = localStorage.getItem('recentSearches')

    // const searches = storedSearches ? JSON.parse(storedSearches) : [];
    const searches = storedSearches ? decryptData(storedSearches) : []

    setRecentSearches(searches)
  }, [])

  const formatDate = dateString => {
    const date = new Date(dateString)

    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    })
  }

  const handleRecentSearch = search => {
    const payload =
      search?.route_type === 'MULTICITY'
        ? {
          cabin_class: search?.cabin_class,
          route_type: search?.route_type,
          legs: search?.legs,
          traveler_count: search?.traveler_count
        }
        : {
          cabin_class: search?.cabin_class,
          departure_date: search?.departure_date,
          destination: search?.destination,
          origin: search?.origin,
          return_date: search?.route_type === 'RETURN' ? search?.return_date : null,
          route_type: search?.route_type,
          traveler_count: search?.traveler_count
        }

    if (!payload) return // Ensure payload is defined before proceeding

    const { traveler_count, legs, ...restPayload } = payload
    const serializedLegs = legs?.map(leg => `${leg.origin},${leg.destination},${leg.departure_date}`).join(',')

    const queryString = new URLSearchParams(
      Object.entries({
        ...restPayload,
        ...(traveler_count || {}),
        ...(legs ? { legs: serializedLegs } : {})
      }).reduce((acc, [key, value]) => {
        acc[key] = String(value) // Convert all values to strings

        return acc
      }, {})
    ).toString()

    setPayloadValues(queryString)
    router.push(`/en/flight/search/result?${queryString}`)
  }

  return (
    <>
      <Card className='bg-base-100/80 backdrop-blur-lg rounded-lg shadow-md mb-5'>
        <CardContent className='p-6'>
          <div>
            <h2 className='text-lg font-semibold mb-4'>Recent Searches</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {recentSearches?.map((search, index) => {
                const travelerCount =
                  Number(search?.traveler_count?.adult_count || 0) +
                  Number(search?.traveler_count?.child_count || 0) +
                  Number(search?.traveler_count?.infant_count || 0)

                return (
                  <div
                    key={index}
                    className='border-2 border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer'
                    onClick={() => handleRecentSearch(search)}
                  >
                    <div className='flex justify-between items-center'>
                      <div className='text-lg font-semibold text-primary flex items-center gap-2'>
                        {search.route_type === 'MULTICITY' ? (
                          <>
                            {search.legs[0].origin} ... {search.legs[search.legs.length - 1].destination}
                          </>
                        ) : search.route_type === 'RETURN' ? (
                          <>
                            {search.origin} <FaArrowRightArrowLeft /> {search.destination}
                          </>
                        ) : (
                          <>
                            {search.origin} <FaArrowRight /> {search.destination}
                          </>
                        )}
                      </div>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='2'
                        stroke='currentColor'
                        className='w-5 h-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M17.25 6.75L21 10.5m0 0l-3.75 3.75M21 10.5H3'
                        />
                      </svg>
                    </div>

                    <div className='text-sm text-gray-500 mt-2 flex items-center gap-2'>
                      <FaCalendar />
                      {search.route_type === 'MULTICITY' ? (
                        search.legs?.map((leg, index) => (
                          <div key={index} className='flex gap-2 items-center'>
                            <span>{formatDate(leg.departure_date)}</span>
                            {leg.return_date && (
                              <>
                                <span>-</span>
                                <span>{formatDate(leg.return_date)}</span>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <>
                          <span>{formatDate(search.departure_date)}</span>{' '}
                          {search.route_type !== 'ONEWAY' && -(<span>{formatDate(search.return_date)}</span>)}
                        </>
                      )}
                    </div>

                    <div className='text-sm text-gray-500 mt-1 flex items-center gap-2'>
                      <img src='/images/icons/view-detail-icon.svg' alt='' />
                      {search.route_type} • {travelerCount} Travelers • {search.cabin_class}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
