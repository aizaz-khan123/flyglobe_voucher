'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
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
// import { FaCheck, FaTimes } from 'react-icons/fa'

import { toast } from 'react-toastify'
import { useCreateNewsMutation } from '@/redux-store/services/api'

const CreateNews = ({ open, onClose }) => {
  const [createNews, { isLoading }] = useCreateNewsMutation()
  const [imagePreview, setImagePreview] = useState(null)

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors },
    register
  } = useForm({
    defaultValues: {
      title: '',
      news_url: '',
      is_feature: false,
      description: '',
      image: undefined
    }
  })

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => {
      setError(key, {
        type: 'manual',
        message: value
      })
    })
  }

  const handleChangeImage = fileItems => {
    if (fileItems.length > 0) {
      const fileItem = fileItems[0]
      const file = fileItem.file
      setValue('image', file)

      // Create preview
      const reader = new FileReader()
      reader.onload = e => {
        setImagePreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    } else {
      setValue('image', undefined)
      setImagePreview(null)
    }
  }

  const onSubmit = handleSubmit(async data => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value)
        }
      })

      const response = await createNews(formData).unwrap()

      if (response.status) {
        toast.success(`${response.data.title} has been created`)
        reset()
        onClose()
      } else if (response.errors) {
        setErrors(response.errors)
      }
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors)
      }
    }
  })

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth='md'>
      <DialogTitle className='font-bold flex items-center justify-between'>
        Create News
        <IconButton onClick={handleCancel}>
          <IoMdClose style={{ fontSize: '1.5rem' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component='form' noValidate sx={{ mt: 2 }}>
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

              <FormControlLabel
                control={<Switch {...register('is_feature')} name='is_feature' color='primary' />}
                label='Is Feature News'
                labelPlacement='start'
                sx={{ mt: 2, justifyContent: 'flex-start', ml: 0 }}
              />

              <Box mt={2}>
                <TextareaAutosize
                  {...register('description')}
                  minRows={4}
                  placeholder='News Description'
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderColor: errors.description ? '#f44336' : '#ccc',
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
            </div>

            <div>
              <Box mb={2}>
                <input
                  type='file'
                  // ref={fileInputRef}
                  onChange={handleChangeImage}
                  accept='image/*'
                />
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
        <Button
          variant='outlined'
          onClick={handleCancel}
          disabled={isLoading}
          //   startIcon={<FaTimes />}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={onSubmit}
          disabled={isLoading}
          //   startIcon={<FaCheck />}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateNews
