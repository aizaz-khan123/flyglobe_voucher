'use client'

// React Imports
import { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// Component Imports
import { toast, useToast } from 'react-toastify'

import { useDispatch } from 'react-redux'

import Link from '@components/Link'
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useVerifyMutation, useResendMutation } from '@/redux-store/services/api'

import { connectors, loggedIn } from '@/redux-store/Features/authslice'
import { updateAuthCookie } from '@/libs/cookie/auth'

const TwoStepsV1 = ({ mode }) => {
  // States
  const [otp, setOtp] = useState(Array(6).fill(''))
  const inputRefs = useRef([])
  const [isLoading, setIsLoading] = useState(false)

  // Hooks
  const params = useParams()
  const email = params.id
  const dispatch = useDispatch()
  const router = useRouter()
  const authBackground = useImageVariant(
    mode,
    '/images/pages/auth-v1-mask-light.png',
    '/images/pages/auth-v1-mask-dark.png'
  )

  const [verify] = useVerifyMutation()
  const [resend, { isLoading: resendLoading }] = useResendMutation()

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
      verifyOTP()
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

  const verifyOTP = async () => {
    const otpCode = otp.join('')

    if (otpCode.length < 6) {
      toast.error('Please complete the OTP verification before logging in.')

      return
    }

    setIsLoading(true)
    await verify({ email, otp: otpCode }).then(async response => {
      if ('error' in response) {
        toast.error(response?.error?.data?.message)
        setIsLoading(false)

        return
      }

      if (response.data.code === 200) {
        const userDetail = response.data.data

        await Promise.allSettled([
          dispatch(loggedIn({ userDetail })),
          dispatch(connectors({ connectors: userDetail?.connectors })),
          updateAuthCookie({ user: userDetail?.user })
        ])
        setIsLoading(false)
        toast.success('Login successfully...')
        router.push('/dashboard')
      }
    })
  }

  const handleResendOtp = async () => {
    await resend({ email }).then(response => {
      if ('error' in response) {
        toast.error(response?.error?.data?.message)

        return
      }

      toast.success('New OTP sent to your email...')
    })
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen relative p-6'>
      <Card className='flex flex-col sm:w-[450px]'>
        <CardContent className='p-6 sm:p-12'>
          <Link href='/'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-5'>
            <Typography variant='h4'>Two Step Verification 💬</Typography>
            <Typography>Enter the 6-digit OTP sent to your email.</Typography>
            <div className='flex gap-2 justify-center' onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  value={digit}
                  inputRef={el => (inputRefs.current[index] = el)}
                  onChange={e => handleInputChange(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                  variant='outlined'
                />
              ))}
            </div>
            <Button fullWidth variant='contained' onClick={verifyOTP} disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify My Account'}
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Didn&apos;t get the code?</Typography>
              <Button onClick={handleResendOtp} disabled={resendLoading}>
                {resendLoading ? 'Resending...' : 'Resend'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default TwoStepsV1
