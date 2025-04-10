'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  TextareaAutosize,
  FormControlLabel,
  Switch,
  CircularProgress
} from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'
import { useCreateNewsMutation, useUpdateNewsMutation, useShowNewsQuery } from '@/redux-store/services/api'
import { useRouter } from 'next/navigation'
import MuiTextField from '@/components/mui-form-inputs/MuiTextField'

// Define your news schema
const newsSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(3),
  description: z.string().optional(),
  news_url: z.string().url('Invalid URL format').optional(),
  is_feature: z.boolean().default(false),
  image: z.any().optional()
})

const NewsForm = ({ open, onClose, refetch, newsId }) => {
  const [imagePreview, setImagePreview] = useState(null)
  const [isImageChanged, setIsImageChanged] = useState(false)

  // API hooks
  const {
    data: newsDetails,
    isSuccess: isNewsSuccess,
    isLoading: isDetailsLoading,
    error: fetchError,
    refetch: refetchNews
  } = useShowNewsQuery(newsId, {
    skip: !newsId,
    refetchOnMountOrArgChange: true
  })

  const [createNews, { isLoading: isCreating }] = useCreateNewsMutation()
  const [updateNews, { isLoading: isUpdating, error: updateError }] = useUpdateNewsMutation()

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors },
    register,
    watch
  } = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      description: '',
      news_url: '',
      is_feature: false,
      image: undefined
    }
  })

  // Fetch and set news data when in edit mode
  useEffect(() => {
    if (open && newsId) {
      refetchNews()
    }
  }, [open, newsId, refetchNews])

  // Reset form and set values when data is loaded
  useEffect(() => {
    if (isNewsSuccess && newsDetails) {
      reset({
        title: newsDetails.title || '',
        description: newsDetails.description || '',
        news_url: newsDetails.news_url || '',
        is_feature: newsDetails.is_feature || false
      })
      if (newsDetails.image_url) {
        setImagePreview(newsDetails.image_url)
      }
    }
  }, [newsDetails, isNewsSuccess, reset])

  // Handle image changes
  const handleChangeImage = fileItems => {
    if (fileItems.length > 0) {
      const file = fileItems[0]
      setValue('image', file)
      setIsImageChanged(true)

      // Create preview
      const reader = new FileReader()
      reader.onload = e => {
        setImagePreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    } else {
      setValue('image', undefined)
      setImagePreview(null)
      setIsImageChanged(true)
    }
  }

  // Error handling
  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => {
      setError({ message: value })
    })
  }

  // Form submission
  const onSubmit = handleSubmit(async data => {
    const formData = new FormData()

    if (newsId) {
      // Edit existing news
      formData.append('_method', 'put')

      // Only append image if it was changed
      if (isImageChanged && data.image) {
        formData.append('image', data.image)
      }

      // Append other fields
      formData.append('title', data.title)
      formData.append('description', data.description || '')
      formData.append('news_url', data.news_url || '')
      formData.append('is_feature', data.is_feature.toString())

      try {
        const response = await updateNews({
          newsId,
          updated_data: formData
        }).unwrap()

        if (response?.code === 200) {
          toast.success(response?.message || 'News updated successfully')
          refetch()
          onClose()
        } else if (response?.errors) {
          setErrors(response.errors)
        }
      } catch (error) {
        if (error.data?.errors) {
          setErrors(error.data.errors)
        } else {
          toast.error(error.data?.message || 'Failed to update news')
        }
      }
    } else {
      // Create new news
      const createFormData = new FormData()
      if (data.image) {
        createFormData.append('image', data.image)
      }
      createFormData.append('title', data.title)
      createFormData.append('description', data.description || '')
      createFormData.append('news_url', data.news_url || '')
      createFormData.append('is_feature', data.is_feature.toString())

      try {
        const response = await createNews(createFormData).unwrap()

        if (response?.code === 200) {
          toast.success(response?.message || 'News created successfully')
          refetch()
          onClose()
        } else if (response?.errors) {
          setErrors(response.errors)
        }
      } catch (error) {
        if (error.data?.errors) {
          setErrors(error.data.errors)
        } else {
          toast.error(error.data?.message || 'Failed to create news')
        }
      }
    }
  })

  const handleCancel = () => {
    reset()
    onClose()
  }

  if (isDetailsLoading) {
    return (
      <Dialog open={open} onClose={handleCancel}>
        <DialogContent>
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
            <CircularProgress />
            <Box ml={2}>Loading news details...</Box>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth='md'>
      <DialogTitle className='font-bold flex items-center justify-between'>
        {newsId ? 'Edit News' : 'Create News'}
        <IconButton onClick={handleCancel}>
          <IoMdClose style={{ fontSize: '1.5rem' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component='form' noValidate>
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
            <div>
              <TextField
                {...register('title')}
                control={control}
                margin='normal'
                fullWidth
                label='News Title'
                id='title'
                name='title'
                placeholder='Enter News Title'
                error={!!errors.title}
                helperText={errors.title?.message}
                size='small'
              />

              <TextField
                {...register('news_url')}
                control={control}
                margin='normal'
                fullWidth
                label='News URL'
                id='news_url'
                name='news_url'
                placeholder='Enter News URL'
                error={!!errors.news_url}
                helperText={errors.news_url?.message}
                size='small'
              />

              <Box mt={2}>
                <MuiTextField
                  {...register('description')}
                  minRows={4}
                  control={control}
                  placeholder='News Description'
                  style={{
                    width: '100%',
                    padding: '8px',
                    // borderColor: errors.description ? '#f44336' : '#ccc',
                    borderRadius: '4px',
                    fontFamily: 'inherit'
                  }}
                />
                {errors.description && (
                  <p style={{ color: '#f44336', fontSize: '0.75rem', margin: '3px 14px 0' }}>
                    {errors.description.message}
                  </p>
                )}
              </Box>
              <FormControlLabel
                control={<Switch {...register('is_feature')} name='is_feature' color='primary' />}
                label='Is Feature News'
                labelPlacement='start'
                sx={{ mt: 2, justifyContent: 'flex-start', ml: 0 }}
              />
            </div>

            <div>
              <Box mb={2}>
                <input type='file' onChange={e => handleChangeImage(e.target.files)} accept='image/*' />
              </Box>

              {imagePreview && (
                <Box mt={2} textAlign='center'>
                  <img
                    src={imagePreview}
                    alt='Preview'
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '4px'
                    }}
                  />
                </Box>
              )}
            </div>
          </div>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant='outlined' onClick={handleCancel} disabled={isCreating || isUpdating}>
          Cancel
        </Button>
        <Button variant='contained' onClick={onSubmit} disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? <CircularProgress size={24} /> : newsId ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewsForm
