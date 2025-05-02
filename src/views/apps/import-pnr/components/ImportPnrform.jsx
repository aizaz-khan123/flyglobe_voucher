'use client'

import { useForm } from 'react-hook-form'
import { Button, Card, CardContent } from '@mui/material'

import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'

export const connectorValues = ['SABRE']

const ImportPnrform = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      connector: '',
      pnr_number: ''
    }
  })

  const onSubmit = data => {
    console.log('Form Submitted:', data)
  }

  return (
    <>
      <Card className='bg-white'>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-4'>
              <div className='mb-5'>
                <MuiDropdown
                  control={control}
                  name='connector'
                  label='Connector'
                  placeholder='Connector'
                  options={connectorValues.map(title => ({
                    value: title,
                    label: `${title}`
                  }))}
                />
              </div>
              <div className='mb-5'>
                <MuiTextField control={control} name='pnr_number' label='PNR Number' />
              </div>
            </div>
            <div className='flex justify-end'>
              <Button variant='contained'>Import PNR</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default ImportPnrform
