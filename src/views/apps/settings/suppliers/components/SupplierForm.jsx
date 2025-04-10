'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IoMdClose } from 'react-icons/io'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  FormControlLabel,
  Switch,
  Box,
  Typography
} from '@mui/material'

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useShowSupplierQuery
} from '@/redux-store/services/api'

const supplierSchema = z.object({
  name: z.string({ required_error: "Supplier name is required" })
    .trim()
    .min(3, { message: "Supplier name must be at least 3 characters" }),
  description: z.string().max(500).optional(),
  status: z.boolean().default(false)
})

const SupplierForm = ({ 
  open, 
  onClose, 
  refetch, 
  supplierId 
}) => {
  const { 
    control, 
    handleSubmit, 
    setError, 
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(supplierSchema)
  })

  // Fetch supplier details if in edit mode
  const { 
    data: supplierDetails, 
    isLoading: isDetailsLoading,
    isFetching
  } = useShowSupplierQuery(supplierId, {
    skip: !supplierId,
    refetchOnMountOrArgChange: true
  })

  const [createSupplier, { isLoading: isCreating }] = useCreateSupplierMutation()
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation()

  useEffect(() => {
    if (open) {
      // Reset to default values when opening modal
      reset({
        name: '',
        description: '',
        status: false
      })
      
      // Populate if in edit mode and data is available
      if (supplierId && supplierDetails) {
        reset({
          name: supplierDetails.name || '',
          description: supplierDetails.description || '',
          status: supplierDetails.status || false
        })
      }
    }
  }, [open, supplierId, supplierDetails, reset])

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => {
      setError(key, { message: value })
    })
  }

  const onSubmit = handleSubmit(async data => {
    if (supplierId) {
      // Edit existing supplier
      const updated_data = {
        _method: 'put',
        ...data
      }
  
      await updateSupplier({ 
        supplierId, 
        updated_data 
      }).then(response => {
        if ('error' in response) {
          setErrors(response?.error?.data?.errors)
          return
        }
  
        toast.success(response?.data?.message || 'Supplier updated successfully')
        refetch()
        onClose()
        reset()
      })
    } else {
      // Create new supplier
      await createSupplier(data).then(response => {
        if ('error' in response) {
          setErrors(response?.error?.data?.errors)
          return
        }
  
        toast.success(response?.data?.message || 'Supplier created successfully')
        refetch()
        onClose()
        reset()
      })
    }
  })

  
  const handleClose = () => {
    reset()
    onClose()
  }

  if (isDetailsLoading || isFetching) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            p: 4 
          }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading supplier details...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="font-bold flex items-center justify-between">
        {supplierId ? 'Edit Supplier' : 'Add New Supplier'}
        <IoMdClose 
          className="cursor-pointer" 
          onClick={handleClose} 
          style={{ fontSize: '1.5rem' }} 
        />
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <div className="grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2">
<div className='flex items-end gap-4'>
<MuiTextField
              control={control}
              label="Supplier Name"
              id="name"
              name="name"
              placeholder="Enter Supplier Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              size="small"
              fullWidth
            />

<FormControlLabel
              control={
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                      color="primary"
                    />
                  )}
                />
              }
              label="Status"
              labelPlacement="start"
              sx={{ 
                justifyContent: 'flex-start', 
                ml: 0, 
                mt: 2 
              }}
            />
</div>

            <MuiTextField
              control={control}
              label="Description"
              id="description"
              name="description"
              placeholder="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
              className="col-span-1 md:col-span-2"
              size="small"
              multiline
              rows={4}
              fullWidth
            />
          </div>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button 
          variant="outlined" 
          onClick={handleClose} 
          disabled={isCreating || isUpdating}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={onSubmit} 
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? (
            <CircularProgress size={24} />
          ) : supplierId ? (
            'Update'
          ) : (
            'Save'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SupplierForm
