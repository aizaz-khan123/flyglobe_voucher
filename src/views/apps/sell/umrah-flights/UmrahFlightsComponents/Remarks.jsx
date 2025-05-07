import React from 'react';
import { 
  Button, 
  Paper,
  TextField
} from '@mui/material';

const Remarks = () => {
  return (
    <>
      <h1 className="text-xl font-bold border-b pb-2 mb-3">Remarks</h1>
      
      <TextField
        multiline
        rows={10}
        fullWidth
        variant="outlined"
        placeholder="Enter your remarks here..."
        className="mb-6"
      />
      
        <Button
          variant="contained"
        className='w-full'
        >
          Create Voucher
        </Button>
    </>
  );
};

export default Remarks;
