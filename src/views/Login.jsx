'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// Component Imports
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'

import { toast } from 'react-toastify'

import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { getLocalizedUrl } from '@/utils/i18n'

import { useLoginMutation } from '@/redux-store/services/api'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(5, 'Password must be at least 5 characters')
    .max(15, 'Password must not exceed 15 characters')
})

const Login = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isDisable, setIsDisable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Hooks
  const searchParams = useSearchParams()
  const router = useRouter()
  const { lang: locale } = useParams()

  const authBackground = useImageVariant(
    mode,
    '/images/pages/auth-v1-mask-light.png',
    '/images/pages/auth-v1-mask-dark.png'
  )

  const {
    control,
    handleSubmit,
    setError,
    register,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const [loginUser, { isLoading: loginLoading }] = useLoginMutation()

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const onSubmit = async data => {
    setIsDisable(true)
    setIsLoading(true)

    const response = await loginUser(data)

    if ('error' in response) {
      if (response.error.data?.code === 400) {
        toast.error(response.error.data?.message)
        setIsDisable(false)
        setIsLoading(false)

        return
      }

      setErrors(response.error.data.errors)
      setIsDisable(false)
      setIsLoading(false)

      return
    }

    if (response.data.code === 200) {
      toast.success(response?.data?.message)
      router.push(`/verification/${encodeURIComponent(response?.data?.data)}?q=${searchParams.get('redirectTo') || ''}`)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href={getLocalizedUrl('/', locale)} className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-5'>
            <div>
              <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
              <Typography className='mbs-1'>Please sign-in to your account and start the adventure</Typography>
            </div>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
              <TextField
                autoFocus
                fullWidth
                label='Email'
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                fullWidth
                label='Password'
                type={isPasswordShown ? 'text' : 'password'}
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton size='small' edge='end' onClick={() => setIsPasswordShown(!isPasswordShown)}>
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <FormControlLabel control={<Checkbox />} label='Remember me' />
                <Typography
                  className='text-end'
                  color='primary.main'
                  component={Link}
                  href={getLocalizedUrl('/en/forgot-password', locale)}
                >
                  Forgot password?
                </Typography>
              </div>
              <Button fullWidth variant='contained' type='submit' disabled={isDisable || isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Login
