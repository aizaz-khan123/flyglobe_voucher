import React, { useState } from 'react';
import { 
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  Divider
} from '@mui/material';

const Transportation = () => {
  const [selectedType, setSelectedType] = useState('bus');
  const [selectedTrip, setSelectedTrip] = useState('');

  const transportTypes = [
    { id: 'bus', label: 'BUS' },
    { id: 'h1', label: 'H-1' },
    { id: 'gmc', label: 'GMC' },
    { id: 'hiace', label: 'HIACEMINI BUS' },
    { id: 'car', label: 'CAR' },
    { id: 'coaster', label: 'COASTER' },
    { id: 'self', label: 'Self' }
  ];

  const transportTrips = {
    bus: [
      { id: 'bus1', label: 'MED Airport-MED(H)' },
      { id: 'bus2', label: 'MAK-MED-MAK' },
      { id: 'bus3', label: 'MAK-MED-MAK-JED' },
      { id: 'bus1', label: 'MED Airport-MED(H)' },
      { id: 'bus2', label: 'MAK-MED-MAK' },
      { id: 'bus3', label: 'MAK-MED-MAK-JED' },      { id: 'bus1', label: 'MED Airport-MED(H)' },
      { id: 'bus2', label: 'MAK-MED-MAK' },
      { id: 'bus3', label: 'MAK-MED-MAK-JED' },      { id: 'bus1', label: 'MED Airport-MED(H)' },
      { id: 'bus2', label: 'MAK-MED-MAK' },
      { id: 'bus3', label: 'MAK-MED-MAK-JED' },      { id: 'bus1', label: 'MED Airport-MED(H)' },
      { id: 'bus2', label: 'MAK-MED-MAK' },
      { id: 'bus3', label: 'MAK-MED-MAK-JED' },      { id: 'bus1', label: 'MED Airport-MED(H)' },
      { id: 'bus2', label: 'MAK-MED-MAK' },
      { id: 'bus3', label: 'MAK-MED-MAK-JED' },      { id: 'bus1', label: 'MED Airport-MED(H)' },
      { id: 'bus2', label: 'MAK-MED-MAK' },
      { id: 'bus3', label: 'MAK-MED-MAK-JED' },
    ],
    h1: [
      { id: 'h1_1', label: 'MED airport-MED-MAK-Med Airport' },
      { id: 'h1_2', label: 'MED-MED airport' },
      { id: 'h1_3', label: 'MAK-MED-MED airport' },
      { id: 'h1_1', label: 'MED airport-MED-MAK-Med Airport' },
      { id: 'h1_2', label: 'MED-MED airport' },
      { id: 'h1_3', label: 'MAK-MED-MED airport' },      { id: 'h1_1', label: 'MED airport-MED-MAK-Med Airport' },
      { id: 'h1_2', label: 'MED-MED airport' },
      { id: 'h1_3', label: 'MAK-MED-MED airport' },      { id: 'h1_1', label: 'MED airport-MED-MAK-Med Airport' },
      { id: 'h1_2', label: 'MED-MED airport' },
      { id: 'h1_3', label: 'MAK-MED-MED airport' },      { id: 'h1_1', label: 'MED airport-MED-MAK-Med Airport' },
      { id: 'h1_2', label: 'MED-MED airport' },
      { id: 'h1_3', label: 'MAK-MED-MED airport' },      { id: 'h1_1', label: 'MED airport-MED-MAK-Med Airport' },
      { id: 'h1_2', label: 'MED-MED airport' },
      { id: 'h1_3', label: 'MAK-MED-MED airport' },      { id: 'h1_1', label: 'MED airport-MED-MAK-Med Airport' },
      { id: 'h1_2', label: 'MED-MED airport' },
      { id: 'h1_3', label: 'MAK-MED-MED airport' },
    ],
    gmc: [
      { id: 'gmc1', label: 'JED-MAK-MAD-MAK-MAD-MAK-JED' },
      { id: 'gmc2', label: 'JED-MAK-MAD-MAK-MAD' },
      { id: 'gmc3', label: 'MED-JEDairport' }
    ],
    hiace: [
      { id: 'hiace1', label: 'MEDairport-MED-MAK-MED-MAK-JED' },
      { id: 'hiace2', label: 'JED-MAK-MED-MAK-MED-MEDairport' },
      { id: 'hiace3', label: 'JED-MAK-MED-MAK-JED' }
    ],
    car: [
      { id: 'car1', label: 'ED-MAK-JED' },
      { id: 'car2', label: 'Short City Trips' },
      { id: 'car3', label: 'Airport Transfers' }
    ],
    coaster: [
      { id: 'coaster1', label: 'Group Tours' },
      { id: 'coaster2', label: 'Long Distance' },
      { id: 'coaster3', label: 'Special Events' }
    ],
    self: [
      { id: 'self1', label: 'Self Drive Option 1' },
      { id: 'self2', label: 'Self Drive Option 2' }
    ]
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setSelectedTrip(''); // Reset trip when type changes
  };

  const handleTripChange = (event) => {
    setSelectedTrip(event.target.value);
  };

  return (
  <>
      <h1 className="text-xl font-bold">Transportation</h1>
      
      {/* Transportation Type Section */}
      <FormControl component="fieldset">
   
      <h1 className="text-lg font-bold">     Transportation Type:</h1>

        <RadioGroup
          row
          value={selectedType}
          onChange={handleTypeChange}
          className="flex flex-wrap gap-4"
        >
          {transportTypes.map((type) => (
            <FormControlLabel
              key={type.id}
              value={type.id}
              control={<Radio color="primary" />}
              label={type.label}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {selectedType && (
        <FormControl component="fieldset" className="w-full">
        
      <h1 className="text-lg font-bold">   Transportation Trip:</h1>

          <RadioGroup
          row
            value={selectedTrip}
            onChange={handleTripChange}
           className="flex flex-wrap gap-4"
          >
            {transportTrips[selectedType]?.map((trip) => (
          
                <FormControlLabel
                  value={trip.id}
                  control={<Radio color="primary" />}
                  label={trip.label}
                  key={trip.id}
                />
              
            ))}
          </RadioGroup>
        </FormControl>
      )}

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <Button
          variant="contained"
          color="primary"
   className='w-full'
        
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default Transportation;
