'use client'

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Button, Card, CardContent, Dialog, DialogContent, DialogTitle, FormLabel, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'react-toastify'

import { IoMdClose } from 'react-icons/io'

import { useCreateAirportMutation } from '@/redux-store/services/api'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'

const CreateAirport = ({ open, onClose }) => {
  const [createAirport, { isLoading }] = useCreateAirportMutation()

  const { control, handleSubmit, setError } = useForm()

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const onSubmit = handleSubmit(async data => {
    await createAirport(data).then(response => {
      if ('error' in response) {
        setErrors(response?.error.data?.errors)
        
return
      }

      const { status, data: responseData } = response?.data

      if (status) {
        toast.success(`${responseData.name} has been created`)

        // router.push(routes.apps.settings.airports)
        onClose()
      } else {
        setErrors(response?.data?.errors)
      }
    })
  })

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle className='font-bold flex items-center justify-between'>
        Create Airport
        <IoMdClose className='cursor-pointer' onClick={onClose} />
      </DialogTitle>
      <DialogContent>
        <div className='grid grid-cols-1 gap-6'>
          <Card>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Airport Information
              </Typography>
              <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
                <div>
                  <FormLabel htmlFor='name'>Airport Name</FormLabel>
                  <MuiTextField
                    fullWidth
                    control={control}
                    size='small'
                    id='name'
                    name='name'
                    placeholder='Enter Airport Name'
                  />
                </div>
                <div>
                  <FormLabel htmlFor='iso_country'>ISO Country</FormLabel>
                  <MuiTextField
                    fullWidth
                    control={control}
                    size='small'
                    id='iso_country'
                    name='iso_country'
                    placeholder='Enter ISO Country'
                  />
                </div>
                <div>
                  <FormLabel htmlFor='municipality'>Municipality</FormLabel>
                  <MuiTextField
                    fullWidth
                    control={control}
                    size='small'
                    id='municipality'
                    name='municipality'
                    placeholder='Enter Municipality'
                  />
                </div>
                <div>
                  <FormLabel htmlFor='iata_code'>IATA Code</FormLabel>
                  <MuiTextField
                    fullWidth
                    control={control}
                    size='small'
                    id='iata_code'
                    name='iata_code'
                    placeholder='Enter IATA Code'
                  />
                </div>
                <div>
                  <FormLabel htmlFor='country'>Country</FormLabel>
                  <MuiTextField
                    fullWidth
                    control={control}
                    size='small'
                    id='country'
                    name='country'
                    placeholder='Enter Country Name'
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='mt-6 flex justify-end gap-6'>
          <Button variant='outlined' size='medium' onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant='contained' size='medium' onClick={onSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { CreateAirport }
