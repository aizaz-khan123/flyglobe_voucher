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
  const sectorDeparture = [
    { value: 'ISB', label: 'ISB' },
    { value: 'JED', label: 'JED' },
    { value: 'LHE', label: 'LHE' },
  ];

  const sectorDestination = [
    { value: 'JED', label: 'ISB' },
    { value: 'ISB', label: 'JED' },
    { value: 'DXB', label: 'LHE' },
  ];
  const flightDeparture = [
    { value: 'ISB', label: 'ISB' },
    { value: 'JED', label: 'JED' },
    { value: 'LHE', label: 'LHE' },
  ];

  const flightDestination = [
    { value: 'JED', label: 'ISB' },
    { value: 'ISB', label: 'JED' },
    { value: 'DXB', label: 'LHE' },
  ];



  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    return {
      value: `${hour.toString().padStart(2, '0')}:00 ${ampm}`,
      label: `${hour.toString().padStart(2, '0')}:00 ${ampm}`
    };
  });


  const hourOptions = [...Array(12)].map((_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));
  const minuteOptions = ['00', '15', '30', '45'].map(m => ({ label: m, value: m }));
  const ampmOptions = ['AM', 'PM'].map(m => ({ label: m, value: m }));




  return (
    <div className="">
      <h1 className="text-xl font-bold border-b pb-3">Flight Information</h1>

      <div className="border-b py-3">
        <h2 className="text-lg font-semibold mb-4">Departure Flight</h2>

        <div className="grid grid-cols-12 gap-4 items-end">

          {/* Sector */}
          <div className="col-span-12 md:col-span-2">
            <label className="mb-2 block font-medium text-black">Sector</label>
            <div className="flex gap-4">
              <MuiDropdown
                size='small'

                control={control}
                name="departure_sector"
                options={sectorDeparture}
              />
              <MuiDropdown
                size='small'

                control={control}
                name="destination_sector"
                options={sectorDestination}
              />
            </div>
          </div>



          {/* Flight */}
          <div className="col-span-12 md:col-span-2">
            <label className="mb-2 block font-medium text-black">Flight</label>
            <div className="flex gap-4">
              <MuiDropdown
                size='small'

                control={control}
                name="departure_flight"
                options={flightDeparture}
              />
              <MuiDropdown
                size='small'

                control={control}
                name="destination_flight"
                options={flightDestination}
              />
            </div>
          </div>

          {/* Departure Date & Time */}
          <div className="col-span-12 md:col-span-4">
            <label className="mb-2 block font-medium text-black">Dept: Date & Time</label>
            <div className="flex gap-4">
              <MuiDatePicker
                control={control}
                name="departure_date"
                format="DD-MM-YYYY"
                className="w-full cursor-pointer"
                minDate={dayjs()}
                size='small'

              />
              <MuiDropdown
                size='small'

                control={control}
                name="departure_hour"
                options={hourOptions}
              />
              <MuiDropdown
                size='small'

                control={control}
                name="departure_minute"
                options={minuteOptions}
              />
              <MuiDropdown
                size='small'

                control={control}
                name="departure_ampm"
                options={ampmOptions}
              />
            </div>
          </div>

          {/* Arrival Date & Time */}
          <div className="col-span-12 md:col-span-4">
            <label className="mb-2 block font-medium text-black">ARR: Date & Time</label>
            <div className="flex gap-4">
              <MuiDatePicker
                control={control}
                name="arrival_date"
                format="DD-MM-YYYY"
                className="w-full cursor-pointer"
                minDate={dayjs()}
                size='small'
              />
              <MuiDropdown
                size='small'
                control={control}
                name="arrival_hour"
                options={hourOptions}
              />
              <MuiDropdown
                size='small'

                control={control}
                name="arrival_minute"
                options={minuteOptions}
              />
              <MuiDropdown
                size='small'

                control={control}
                name="arrival_ampm"
                options={ampmOptions}
              />
            </div>
          </div>
        </div>

        {/* PNR */}
        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-2">
            <label className="mb-2 block font-medium text-black">PNR</label>
            <MuiTextField
              control={control}
              name="departure_pnr"
              size='small'

              placeholder="Enter PNR"
            />
          </div>
        </div>
      </div>

      <div className="border-b py-3">
        <h2 className="text-lg font-semibold mb-4">Return Flight</h2>

        <div className="grid grid-cols-12 gap-4 items-end">

       
          <div className="col-span-12 md:col-span-2">
            <label className="mb-2 block font-medium text-black">Sector</label>
            <div className="flex gap-4">
              <MuiDropdown
                size='small'

                control={control}
                name="departure_sector"
                options={sectorDeparture}
              />
              <MuiDropdown
                size='small'

                control={control}
                name="destination_sector"
                options={sectorDestination}
              />
            </div>
          </div>



          {/* Flight */}
          <div className="col-span-12 md:col-span-2">
            <label className="mb-2 block font-medium text-black">Flight</label>
            <div className="flex gap-4">
              <MuiDropdown
                size='small'

                control={control}
                name="departure_flight"
                options={flightDeparture}
              />
              <MuiDropdown
                size='small'

                control={control}
                name="destination_flight"
                options={flightDestination}
              />
            </div>
          </div>

          {/* Departure Date & Time */}
          <div className="col-span-12 md:col-span-4">
            <label className="mb-2 block font-medium text-black">Dept: Date & Time</label>
            <div className="flex gap-4">
              <MuiDatePicker
                control={control}
                name="departure_date"
                format="DD-MM-YYYY"
                className="w-full cursor-pointer"
                minDate={dayjs()}
                size='small'

              />
              <MuiDropdown
                size='small'

                control={control}
                name="departure_hour"
                options={hourOptions}
              />
              <MuiDropdown
                size='small'

                control={control}
                name="departure_minute"
                options={minuteOptions}
              />
              <MuiDropdown
                size='small'

                control={control}
                name="departure_ampm"
                options={ampmOptions}
              />
            </div>
          </div>

          {/* Arrival Date & Time */}
          <div className="col-span-12 md:col-span-4">
            <label className="mb-2 block font-medium text-black">ARR: Date & Time</label>
            <div className="flex gap-4">
              <MuiDatePicker
                control={control}
                name="arrival_date"
                format="DD-MM-YYYY"
                className="w-full cursor-pointer"
                minDate={dayjs()}
                size='small'
              />
              <MuiDropdown
                size='small'
                control={control}
                name="arrival_hour"
                options={hourOptions}
              />
              <MuiDropdown
                size='small'

                control={control}
                name="arrival_minute"
                options={minuteOptions}
              />
              <MuiDropdown
                size='small'

                control={control}
                name="arrival_ampm"
                options={ampmOptions}
              />
            </div>
          </div>
        </div>

        {/* PNR */}
        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-2">
            <h3 className="text-md font-semibold mb-2">PNR</h3>
            <MuiTextField
              size='small'
              control={control}
              name="return_pnr"
              placeholder="Enter PNR"
            />
          </div>
          <div className="col-span-12 md:col-span-2">
            <h3 className="text-md font-semibold mb-2">Count Nights</h3>
            <MuiTextField
              control={control}
              size='small'

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
