'use client'

import { useEffect } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { Button, Card, CardContent, FormControlLabel, FormLabel, Switch } from '@mui/material'

import { toast } from 'react-toastify'

import { useGetSupplierListQuery, useShowConnectorQuery, useUpdateConnectorMutation } from '@/redux-store/services/api'

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'

const SABREConnector = () => {
  const { data: supplierDropDown } = useGetSupplierListQuery()
  const { data: connector, isSuccess: isConnectorSuccess } = useShowConnectorQuery('SABRE')
  const [updateConnector, { isLoading: isUpdateLoading }] = useUpdateConnectorMutation()

  const connectorSchema = z.object({
    api_key: z.string({ required_error: 'API_KEY Required!' }),
    api_secret: z.string({ required_error: 'API_SECRET Required!' }),
    connector_domain: z.string({ required_error: 'DOMAIN Required!' }),
    printer: z.string({ required_error: 'PRINTER Required!' }),
    pcc: z.string({ required_error: 'PCC Required!' }),
    supplier_id: z.number({ required_error: 'Supplier ID Required!' }).min(1, 'Supplier ID is required!'),
    is_enable: z.boolean()
  })

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(connectorSchema)
  })

  useEffect(() => {
    if (isConnectorSuccess && connector) {
      reset({
        api_key: connector.api_key,
        api_secret: connector.api_secret,
        connector_domain: connector.connector_domain,
        printer: connector.printer,
        pcc: connector.pcc,
        is_enable: connector.is_enable,
        supplier_id: connector.supplier_id
      })
    }
  }, [connector, isConnectorSuccess, reset])

  const onSubmit = handleSubmit(async data => {
    const updated_data = {
      ...data,
      name: 'Sabre',
      type: 'SABRE'
    }

    await updateConnector(updated_data).then(response => {
      if (response.data?.code == 200) {
        toast.success('SABRE Api Credentials Updated!')
      }
    })
  })

  return (
    <>
      <Card className='mt-5 bg-base-100'>
        <CardContent className={'p-0'}>
          <CardContent className='gap-0'>
            <div>SABRE API Credentials</div>
            <div className='mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
              <div>
                <FormLabel title={'API KEY'} htmlFor='api_key'></FormLabel>
                <MuiTextField
                  className='w-full border-0 focus:outline-0'
                  control={control}
                  size='md'
                  id='api_key'
                  name='api_key'
                  placeholder='Enter API KEY'
                />
              </div>
              <div>
                <FormLabel title={'API SECRET'} htmlFor='api_secret'></FormLabel>
                <MuiTextField
                  className='w-full border-0 focus:outline-0'
                  control={control}
                  size='md'
                  id='api_secret'
                  name='api_secret'
                  placeholder='Enter API SECRET'
                />
              </div>
              <div>
                <FormLabel title={'DOMAIN'} htmlFor='connector_domain'></FormLabel>
                <MuiTextField
                  className='w-full border-0 focus:outline-0'
                  control={control}
                  size='md'
                  id='connector_domain'
                  name='connector_domain'
                  placeholder='Enter DOMAIN'
                />
              </div>
              <div>
                <FormLabel title={'PRINTER'} htmlFor='printer'></FormLabel>
                <MuiTextField
                  className='w-full border-0 focus:outline-0'
                  control={control}
                  size='md'
                  id='printer'
                  name='printer'
                  placeholder='Enter printer'
                />
              </div>
              <div>
                <FormLabel title={'PCC'} htmlFor='pcc'></FormLabel>
                <MuiTextField
                  className='w-full border-0 focus:outline-0'
                  control={control}
                  size='md'
                  id='pcc'
                  name='pcc'
                  placeholder='Enter PCC'
                />
              </div>
              <div>
                <FormLabel title='Supplier' htmlFor='supplier_id' />
                {supplierDropDown ? (
                  <MuiDropdown
                    control={control}
                    name='supplier_id'
                    size='md'
                    id='supplier_id'
                    className='w-full border-0 text-base'
                    options={supplierDropDown.map(supplier => ({
                      label: supplier.name,
                      value: supplier.id
                    }))}
                    placeholder='Select Supplier'
                  />
                ) : (
                  <p>Loading...</p>
                )}
              </div>

              <div>
                <div>
                  <Controller
                    name='is_enable'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={!!field.value} color='primary' />}
                        label='Status'
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className=' flex justify-between gap-6'>
              <div></div>
              <div className='mt-6 flex justify-end gap-6'>
                <Button
                  color='primary'
                  size='md'
                  onClick={onSubmit}

                  // startIcon={<Icon icon={checkIcon} fontSize={18} />}
                  loading={isUpdateLoading}
                  variant='contained'
                  className='mt-2'
                >
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </CardContent>
      </Card>
    </>
  )
}

export { SABREConnector }
