import { Box, Button, Typography } from "@mui/material"
import { useRef } from "react"
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { IoClose } from "react-icons/io5"

export const MUIFileUploader = ({ onFileChange, preview,handleRemoveImage }) => {
  const fileInputRef = useRef(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = event => {
    const files = event.target.files
    onFileChange?.(files)
  }

  return (
    <Box
      textAlign='center'
      border='2px dashed #ccc'
      p={4}
      borderRadius={2}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        '&:hover': { borderColor: 'primary.main' },
        minHeight: '220px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      {preview ? (
        <>
        <Box position='relative'>
          <img
            src={preview}
            alt='Preview'
            style={{ maxWidth: '100%', maxHeight: '160px', objectFit: 'contain' }}
          />
        </Box>
         <Box position='absolute' top={8} right={8}>
         <Button size='small' variant='contained' color='error' onClick={handleRemoveImage} >
           <IoClose/>
         </Button>
       </Box>
       </>
      ) : (
        <>
          <Typography variant='body1' mb={2}>
            Drag and drop your file here or
          </Typography>
          <Button variant='contained' startIcon={<UploadFileIcon />} onClick={handleButtonClick}>
            Browse
          </Button>
        </>
      )}
     
      <input
        type='file'
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/*'
      />
    </Box>
  )
}
