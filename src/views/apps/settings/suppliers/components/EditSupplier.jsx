'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Switch,
  Typography
} from '@mui/material'

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import {
  useShowSupplierQuery,
  useUpdateSupplierMutation
} from '@/redux-store/services/api'


const EditSupplier = ({ open, onClose, supplierId }) => {
  const router = useRouter()

  // Only fetch when dialog is open and supplierId exists
  const {
    data: supplier,
    isSuccess: isSupplierSuccess,
    error,
    isLoading: isShowLoading,
    isFetching,
    refetch
  } = useShowSupplierQuery(supplierId, {
 
    refetchOnMountOrArgChange: true
  })

  const [updateSupplier, { error: errorSupplier, isLoading: isLoadingSupplier }] = useUpdateSupplierMutation()

  const { control, handleSubmit, setError, setValue, watch, reset, register } = useForm()

  // Reset form when opening/closing dialog
  useEffect(() => {
    if (open && supplierId) {
      refetch()
    } else {
      reset()
    }
  }, [open, supplierId])

  // Set form values when data is loaded
  useEffect(() => {
    if (isSupplierSuccess && supplier) {
      reset({
        name: supplier.name,
        description: supplier.description,
        status: supplier.status
      })
    }
  }, [supplier, isSupplierSuccess, reset])

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const onSubmit = handleSubmit(async data => {
    try {
      const updated_data = {
        _method: 'put',
        ...data
      }
      
      const response = await updateSupplier({ supplierId, updated_data })
      
      if ('error' in response) {
        setErrors(response?.error?.data?.errors || {})
       
        return
      }

      if (response.data?.code === 200) {
        toaster.success(response?.data?.message)
        refetch()
        onClose()
        router.push(routes.apps.settings.suppliers)
      } else {
        setErrors(response?.data?.errors || {})
      }
    } catch (err) {
      console.error('Update failed:', err)
      toaster.error('Failed to update supplier')
    }
  })

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth='md'>
      {isShowLoading || isFetching ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading supplier details...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, color: 'error.main' }}>
          <Typography>Error fetching supplier details.</Typography>
        </Box>
      ) : (
        <>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Edit Supplier
            <IoMdClose style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={handleCancel} />
          </DialogTitle>

          <DialogContent>
            <Box component='form' noValidate sx={{ mt: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <FormLabel htmlFor='name'>Supplier Name</FormLabel>
                  <MuiTextField
                    fullWidth
                    margin='normal'
                    control={control}
                    id='name'
                    name='name'
                    placeholder='Enter Supplier Name'
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={<Switch {...register('status')} name='status' color='primary' />}
                    label='Status'
                    labelPlacement='start'
                    sx={{
                      ml: 0,
                      '& .MuiFormControlLabel-label': {
                        ml: 1
                      }
                    }}
                  />
                </Box>

                <Box sx={{ gridColumn: '1 / -1' }}>
                  <FormLabel htmlFor='description'>Description</FormLabel>
                  <MuiTextField
                    fullWidth
                    margin='normal'
                    multiline
                    rows={4}
                    control={control}
                    id='description'
                    name='description'
                    placeholder='Description'
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button variant='outlined' onClick={handleCancel} disabled={isLoadingSupplier}>
              Cancel
            </Button>
            <Button variant='contained' onClick={onSubmit} disabled={isLoadingSupplier}>
              {isLoadingSupplier ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export { EditSupplier }
