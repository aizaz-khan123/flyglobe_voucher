import React, { useState } from 'react';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import MuiTextField from '@/components/mui-form-inputs/MuiTextField';
import MuiDatePicker from '@/components/mui-form-inputs/MuiDatePicker';
import { useForm, useFieldArray } from 'react-hook-form';
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown';

const PackageDetails = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      rows: [
        { city: 'Makkah', nights: '', checkIn: '', checkOut: '', hotel: '', room: '' },
        { city: 'Madinah', nights: '', checkIn: '', checkOut: '', hotel: '', room: '' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows"
  });

  const cityOptions = [
    { value: 'Makkah', label: 'Makkah' },
    { value: 'Madinah', label: 'Madinah' },
    { value: 'Jeddah', label: 'Jeddah' },
    { value: 'Riyadh', label: 'Riyadh' }
  ];

  const hotelOptions = [
    { value: 'Hotel A', label: 'Hotel A' },
    { value: 'Hotel B', label: 'Hotel B' },
    { value: 'Hotel C', label: 'Hotel C' }
  ];

  const roomOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Double', label: 'Double' },
    { value: 'Suite', label: 'Suite' }
  ];

  const hourOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString().padStart(2, '0')
  }));

  const ampmOptions = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' }
  ];

  const handleAddRow = () => {
    append({ city: '', nights: '', checkIn: '', checkOut: '', hotel: '', room: '' });
  };

  const handleRemoveRow = (index) => {
    if (fields.length <= 1) return;
    remove(index);
  };

  const calculateTotalNights = () => {
    return fields.reduce((total, row) => {
      const nights = parseInt(row.nights) || 0;
      return total + nights;
    }, 0);
  };

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2}}>


      {fields.map((field, index) => (
        <>
        <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={2}>
          <h3 className="text-sm font-semibold">City</h3>

        </Grid>
        <Grid item xs={1}>
          <h3 className="text-sm font-semibold">Nights</h3>
        </Grid>
        <Grid item xs={2}>
          <h3 className="text-sm font-semibold">Check-in</h3>
        </Grid>
        <Grid item xs={2}>
          <h3 className="text-sm font-semibold">Check-out</h3>
        </Grid>
        <Grid item xs={2}>
          <h3 className="text-sm font-semibold">Hotel</h3>
        </Grid>
        <Grid item xs={2}>
          <h3 className="text-sm font-semibold">Room</h3>
        </Grid>
      </Grid>
        <Grid container spacing={2} key={field.id} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={2}>
          <MuiDropdown
                control={control}
                name={`rows.${index}.hotel`}
                options={hotelOptions}
                size="small"
              />
          </Grid>
          <Grid item xs={1}>
            <MuiTextField
              control={control}
              name={`rows.${index}.nights`}
              size="small"
              placeholder="Nights"
              type="number"
            />
          </Grid>
          <Grid item xs={2}>
            <MuiDatePicker
              control={control}
              name={`rows.${index}.checkIn`}
              format="DD-MM-YYYY"
              className="w-full cursor-pointer"
              minDate={dayjs()}
              size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <MuiDatePicker
              control={control}
              name={`rows.${index}.checkOut`}
              format="DD-MM-YYYY"
              className="w-full cursor-pointer"
              minDate={dayjs()}
              size="small"
            />
          </Grid>
          <Grid item xs={2}>
          <MuiDropdown
                control={control}
                name={`rows.${index}.hotel`}
                options={hotelOptions}
                size="small"
              />
          </Grid>
          <Grid item xs={2}>
          <MuiDropdown
                control={control}
                name={`rows.${index}.hotel`}
                options={hotelOptions}
                size="small"
              />
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => handleRemoveRow(index)} disabled={fields.length <= 1}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
        </>
        
      ))}

      <div className='flex items-end justify-end gap-4'>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRow}
          type="button"
        >
          Add Row
        </Button>
        
        <Typography variant="body1" className='flex flex-col'>
          Total Nights
          <MuiTextField
              control={control}
              name={`nights`}
              size="small"
              placeholder="Nights"
              type="number"
            />
        </Typography>
        

      </div>
      <Button variant="contained" color="primary" type="submit" className='w-full mt-2'>
          Next
        </Button>
    </Box>
  );
};

export default PackageDetails;


