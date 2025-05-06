import MuiDatePicker from '@/components/mui-form-inputs/MuiDatePicker';
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown';
import MuiTextField from '@/components/mui-form-inputs/MuiTextField';
import React from 'react';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';

const FlightInformation = () => {
  const { control } = useForm();

  // Static data for dropdown options
  const sectorOptions = [
    { value: 'ISB-JED', label: 'ISB - JED' },
    { value: 'JED-ISB', label: 'JED - ISB' },
    { value: 'LHE-DXB', label: 'LHE - DXB' },
  ];

  const flightOptions = [
    { value: 'SV', label: 'SV' },
    { value: 'PK', label: 'PK' },
    { value: 'EK', label: 'EK' },
  ];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    return { 
      value: `${hour.toString().padStart(2, '0')}:00 ${ampm}`, 
      label: `${hour.toString().padStart(2, '0')}:00 ${ampm}` 
    };
  });

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold">Flight Information</h1>
      
      {/* Departure Flight Section */}
      <div className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">Departure Flight</h2>
        
        <div className="grid grid-cols-12 gap-4 items-end">
          {/* Sector */}
          <div className="col-span-12 md:col-span-2">
            <MuiDropdown
              control={control}
              name="departure_sector"
              label="Sector"
              options={sectorOptions}
            />
          </div>
          
          {/* Flight */}
          <div className="col-span-12 md:col-span-2">
            <MuiDropdown
              control={control}
              name="departure_flight"
              label="Flight"
              options={flightOptions}
            />
          </div>
          
          {/* Departure Date */}
          <div className="col-span-12 md:col-span-2">
            <MuiDatePicker
              control={control}
              name="departure_date"
              label="Dept: Date"
              format="DD-MM-YYYY"
              className="w-full cursor-pointer"
              minDate={dayjs()}
            />
          </div>
          
          {/* Departure Time */}
          <div className="col-span-6 md:col-span-2">
            <MuiDropdown
              control={control}
              name="departure_time"
              label="Time"
              options={timeOptions}
            />
          </div>
          
          {/* Arrival Date */}
          <div className="col-span-12 md:col-span-2">
            <MuiDatePicker
              control={control}
              name="arrival_date"
              label="ARR: Date"
              format="DD-MM-YYYY"
              className="w-full cursor-pointer"
              minDate={dayjs()}
            />
          </div>
          
          {/* Arrival Time */}
          <div className="col-span-6 md:col-span-2">
            <MuiDropdown
              control={control}
              name="arrival_time"
              label="Time"
              options={timeOptions}
            />
          </div>
        </div>
        
        {/* PNR */}
        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-2">
            <h3 className="text-md font-semibold mb-2">PNR</h3>
            <MuiTextField
              control={control}
              name="departure_pnr"
              placeholder="Enter PNR"
            />
          </div>
        </div>
      </div>
      
      {/* Return Flight Section */}
      <div className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">Return Flight</h2>
        
        <div className="grid grid-cols-12 gap-4 items-end">
          {/* Sector */}
          <div className="col-span-12 md:col-span-2">
            <MuiDropdown
              control={control}
              name="return_sector"
              label="Sector"
              options={sectorOptions}
            />
          </div>
          
          {/* Flight */}
          <div className="col-span-12 md:col-span-2">
            <MuiDropdown
              control={control}
              name="return_flight"
              label="Flight"
              options={flightOptions}
            />
          </div>
          
          {/* Departure Date */}
          <div className="col-span-12 md:col-span-2">
            <MuiDatePicker
              control={control}
              name="return_departure_date"
              label="Dept: Date"
              format="DD-MM-YYYY"
              className="w-full cursor-pointer"
              minDate={dayjs()}
            />
          </div>
          
          {/* Departure Time */}
          <div className="col-span-6 md:col-span-2">
            <MuiDropdown
              control={control}
              name="return_departure_time"
              label="Time"
              options={timeOptions}
            />
          </div>
          
          {/* Arrival Date */}
          <div className="col-span-12 md:col-span-2">
            <MuiDatePicker
              control={control}
              name="return_arrival_date"
              label="ARR: Date"
              format="DD-MM-YYYY"
              className="w-full cursor-pointer"
              minDate={dayjs()}
            />
          </div>
          
          {/* Arrival Time */}
          <div className="col-span-6 md:col-span-2">
            <MuiDropdown
              control={control}
              name="return_arrival_time"
              label="Time"
              options={timeOptions}
            />
          </div>
        </div>
        
        {/* PNR */}
        <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-2">
        <h3 className="text-md font-semibold mb-2">PNR</h3>
            <MuiTextField
              control={control}
              name="return_pnr"
              placeholder="Enter PNR"
            />
          </div>
          <div className="col-span-12 md:col-span-2">
          <h3 className="text-md font-semibold mb-2">Count Nights</h3>
          <MuiTextField
            control={control}
            name="count_nights"
            placeholder="Enter nights"
          />
        </div>

        </div>
     
      </div>
      
    <Button className='w-full' variant='contained'>
      Next
    </Button>
     
    </div>
  );
};

export default FlightInformation;
