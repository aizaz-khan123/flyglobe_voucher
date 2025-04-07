'use client'

import React from 'react'

import { useParams } from 'next/navigation'

import BookingDetail from '@/views/apps/bookings/BookingDetail'

const Page = () => {
    const params = useParams()
    const bookingId = params.id

    return <BookingDetail bookingId={bookingId} />
}

export default Page
