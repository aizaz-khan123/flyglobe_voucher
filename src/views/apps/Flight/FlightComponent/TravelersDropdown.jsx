import React, { useState } from 'react'

import { Controller } from 'react-hook-form'
import { Button, IconButton, Popover, Typography, Box } from '@mui/material'
import { IoPeople } from 'react-icons/io5'
import { IoMdAdd, IoMdCloseCircleOutline } from 'react-icons/io'
import { FaMinus } from 'react-icons/fa6'
import { AiOutlineMinus } from 'react-icons/ai'

const TravelersDropdown = ({ control, name }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'travelers-popover' : undefined

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className='relative traveler-dropdown'>
          <Button
            aria-describedby={id}
            variant='outlined'
            startIcon={<IoPeople />}
            onClick={handleClick}
            className='w-full h-[55px]'
            style={{ justifyContent: 'start' }}
          >
            {`${field?.value?.adult_count ?? 1} Adults | ${field?.value?.child_count ?? 0} Child | ${field?.value?.infant_count ?? 0} Infant`}
          </Button>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            sx={{
              width: anchorEl ? anchorEl.clientWidth : 'auto',
              '& .MuiPaper-root': {
                width: anchorEl ? anchorEl.clientWidth : 'auto'
              }
            }}
          >
            <Box p={2}>
              {[
                { label: 'Adult', subtext: '(12 years and above)', type: 'adult_count' },
                { label: 'Children', subtext: '(2 to 11 years)', type: 'child_count' },
                { label: 'Infants', subtext: '(0 to less than 2)', type: 'infant_count' }
              ].map(item => (
                <Box key={item.type} display='flex' justifyContent='space-between' alignItems='center' sx={{ mb: 1 }}>
                  <Box>
                    <Typography variant='body1'>{item.label}</Typography>
                    <Typography variant='caption' color='textSecondary'>
                      {item.subtext}
                    </Typography>
                  </Box>

                  <Box display='flex' alignItems='center'>
                    <IconButton
                      size='small'
                      onClick={() =>
                        field.onChange({
                          ...field.value,
                          [item.type]:
                            item.type === 'adult_count'
                              ? Math.max(1, (field?.value?.[item.type] ?? 1) - 1)
                              : Math.max(0, (field?.value?.[item.type] ?? 0) - 1)
                        })
                      }
                    >
                      <AiOutlineMinus />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>
                      {field?.value?.[item.type] ?? (item.type === 'adult_count' ? 1 : 0)}
                    </Typography>
                    <IconButton
                      size='small'
                      onClick={() =>
                        field.onChange({
                          ...field.value,
                          [item.type]: (field?.value?.[item.type] ?? (item.type === 'adult_count' ? 1 : 0)) + 1
                        })
                      }
                    >
                      <IoMdAdd />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Popover>
        </div>
      )}
    />
  )
}

export default TravelersDropdown
