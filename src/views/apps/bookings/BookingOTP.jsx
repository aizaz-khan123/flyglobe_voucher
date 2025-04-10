'use client'

import { useRef, useState } from 'react'

import { Button } from '@mui/material'
import { toast } from 'react-toastify'

import { useIssueTicketMutation, useTicketOtpEmailMutation } from '@/redux-store/services/api'

const BookingOTP = ({ bookingId, refectBooking, handleIssueTicketModal }) => {
  const inputRefs = useRef([])
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [ticketOptEmail, { isLoading: ticketOtpLoading }] = useTicketOtpEmailMutation()

  const [issueTicket, { isLoading: isIssueTicketLoading }] = useIssueTicketMutation()

  const handleInputChange = (e, index) => {
    const { value } = e.target

    if (/^\d$/.test(value)) {
      const newOtp = [...otp]

      newOtp[index] = value
      setOtp(newOtp)

      if (index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    } else if (value === '') {
      const newOtp = [...otp]

      newOtp[index] = ''
      setOtp(newOtp)
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (e.key === 'Enter' && index === 5) {
      verifyOTPIssueTicket()
    }
  }

  const handlePaste = e => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)

    const newOtp = pastedData.split('').map(char => (/^\d$/.test(char) ? char : ''))

    setOtp(newOtp)

    const lastIndex = newOtp.findIndex(char => !char)

    if (lastIndex === -1) {
      inputRefs.current[5]?.focus()
    } else {
      inputRefs.current[lastIndex]?.focus()
    }
  }

  const verifyOTPIssueTicket = async () => {
    const otpCode = otp.join('')

    await issueTicket({ bookingId, otpCode }).then(response => {
      if ('error' in response) {
        toast.error(response?.error?.data?.message)

        return
      }

      toast.success('Ticket Successfully Generated...')
      refectBooking()
      handleIssueTicketModal()
    })
  }

  const handleResendOtp = async () => {
    await ticketOptEmail({}).then(response => {
      if ('error' in response) {
        toast.error(response?.error?.data?.message)

        return
      }

      toast.success(response?.data?.message)
    })
  }

  return (
    <>
      <div className='form-control'>
        <div className='flex items-center gap-2' onPaste={handlePaste}>
          {otp?.map((digit, index) => (
            <input
              key={index}
              type='text'
              maxLength={1}
              value={digit}
              ref={el => {
                if (el) inputRefs.current[index] = el
              }}
              onChange={e => handleInputChange(e, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              className='ml-1 w-14 h-11 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg'
            />
          ))}
        </div>
      </div>

      <p className='mt-4 text-center text-md text-base-content/100 md:mt-6'>
        Didn&rsquo;t receive the OTP?{' '}
        <button
          onClick={handleResendOtp}
          className='text-primary hover:underline focus:outline-none'
          disabled={ticketOtpLoading}
        >
          {ticketOtpLoading ? (
            <svg
              className='animate-spin h-5 w-5 text-primary'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          ) : (
            'Resend'
          )}
        </button>
      </p>

      <div className='mt-4 md:mt-6'>
        <Button
          variant='contained'
          onClick={verifyOTPIssueTicket}
          loading={isIssueTicketLoading}
          disabled={isIssueTicketLoading}
        >
          Verify OTP & Issue Ticket
        </Button>
      </div>
    </>
  )
}

export default BookingOTP
