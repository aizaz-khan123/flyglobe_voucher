import React, { useRef } from 'react'

import { Button, Box, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'

const MUIFileUploader = ({ onFileChange }) => {
  const fileInputRef = useRef(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = event => {
    const files = event.target.files

    onFileChange?.(files) // Trigger your custom handler
  }

  return (
    <Box
      textAlign='center'
      border='2px dashed #ccc'
      p={4}
      borderRadius={2}
      sx={{
        cursor: 'pointer',
        '&:hover': { borderColor: 'primary.main' }
      }}
    >
      <Typography variant='body1' mb={2}>
        Drag and drop your file here or
      </Typography>
      <Button variant='contained' startIcon={<UploadFileIcon />} onClick={handleButtonClick}>
        Browse
      </Button>
      <input
        type='file'
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/*' // Accept only images
      />
    </Box>
  )
}

export default MUIFileUploader
