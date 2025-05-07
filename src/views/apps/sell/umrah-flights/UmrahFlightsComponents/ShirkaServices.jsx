import React from 'react';
import MuiTextField from '@/components/mui-form-inputs/MuiTextField';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';

const ShirkaServices = () => {
  const { control } = useForm();

  return (
    <div className="">
      <h1 className="text-xl font-bold border-b pb-3">Shirka and Service No</h1>
      
 
      <div className="">
        <h2 className="text-lg font-semibold py-2">Shirka:</h2>
        
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <MuiTextField
              control={control}
              name="shirka"
              placeholder="Enter Shirka"
              fullWidth
              size='small'
            />
          </div>
        </div>
      </div>
      
  
      <div>
     <Button variant='contained' className='w-full mt-3'>Next</Button>
    
      </div>
    </div>
  );
};

export default ShirkaServices;
