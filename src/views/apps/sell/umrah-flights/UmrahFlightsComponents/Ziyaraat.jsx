import React, { useState } from 'react';
import { 
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper
} from '@mui/material';

const Ziyaraat = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <h1 className="text-xl font-bold">Ziyaraat</h1>
      
      <FormControl component="fieldset">
        <RadioGroup
        row
          value={selectedOption}
          onChange={handleChange}
          className="flex flex-wrap gap-4"
        >
          <FormControlLabel
            value="none"
            control={<Radio color="primary" />}
            label="None"
          />
          <FormControlLabel
            value="makkah"
            control={<Radio color="primary" />}
            label="Makkah Ziarat"
          />
          <FormControlLabel
            value="madina"
            control={<Radio color="primary" />}
            label="Madina Ziarat"
          />
        </RadioGroup>
      </FormControl>

      <div className="flex justify-end pt-4">
        <Button
          variant="contained"
       className='w-full'
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default Ziyaraat;
