import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
  MenuItem
} from '@mui/material';
import dayjs from 'dayjs';
import MuiDatePicker from '@/components/mui-form-inputs/MuiDatePicker';
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown';
import MuiTextField from '@/components/mui-form-inputs/MuiTextField';

const MautamerInformation = () => {
  const { control } = useForm();

  const partyOptions = [
    { value: 'party1', label: 'Party 1' },
    { value: 'party2', label: 'Party 2' },
    { value: 'party3', label: 'Party 3' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const shinkaOptions = [
    { value: 'accommodation', label: 'ACCOMMODATION ONLY' },
    { value: 'full', label: 'FULL SERVICE' },
  ];

  const columnStyle = { width: '20%' };

  return (
    <>
      <h1 className="text-xl font-bold border-b pb-3">Mautamer's Information</h1>

      {/* Party Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Party:</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">


          <MuiDropdown
            size='small'

            control={control}
            name="party_options"
            options={partyOptions}
          />

          <MuiTextField
            control={control}
            size='small'

            name="phone_number"
            placeholder="Enter Group Head/Phone No"
          />
        </div>

      </div>

   
   {/* Responsive Table Wrapper */}
<div className="overflow-auto mt-4">
  <Table className="min-w-[800px]">
    <TableHead className="bg-[#8a9dc2] text-white">
      <TableRow>
        <TableCell style={columnStyle} className="text-white py-2">Name</TableCell>
        <TableCell style={columnStyle} className="text-white py-2">PPNO</TableCell>
        <TableCell style={columnStyle} className="text-white py-2">DOB</TableCell>
        <TableCell style={columnStyle} className="text-white py-2">Gender</TableCell>
        <TableCell style={columnStyle} className="text-white py-2">Shinka</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell style={columnStyle}>
          <TextField
            placeholder="Enter Name"
            fullWidth
            variant="outlined"
            size="small"
          />
        </TableCell>
        <TableCell style={columnStyle}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
          />
        </TableCell>
        <TableCell style={columnStyle}>
          <MuiDatePicker
            control={control}
            name="dob"
            format="DD-MM-YYYY"
            className="w-full cursor-pointer"
            minDate={dayjs()}
            size="small"
          />
        </TableCell>
        <TableCell style={columnStyle}>
          <MuiDropdown
            size="small"
            control={control}
            name="gender"
            options={genderOptions}
          />
        </TableCell>
        <TableCell style={columnStyle}>
          <MuiDropdown
            size="small"
            control={control}
            name="shinka"
            options={shinkaOptions}
          />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>

   
      <div className="flex justify-end mt-4">
        <Button
          variant="contained"
          className="w-full"
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default MautamerInformation;
