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

  // Equal width for all columns (adjust percentage as needed)
  const columnStyle = { width: '20%' };

  return (
    <Paper elevation={3} className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Mautamer's Information</h1>

      {/* Party Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Party:</h2>
        <div className="flex gap-4 flex-wrap">
          <TextField
            select
            label="Select Party"
            variant="outlined"
            className="min-w-[200px]"
          >
            {partyOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Group Head/Phone No"
            variant="outlined"
            className="min-w-[250px]"
          />
        </div>
      </div>

      {/* Table Section */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={columnStyle}>Name</TableCell>
            <TableCell style={columnStyle}>PPNO</TableCell>
            <TableCell style={columnStyle}>DOB</TableCell>
            <TableCell style={columnStyle}>Gender</TableCell>
            <TableCell style={columnStyle}>Shinka</TableCell>
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
                className="w-full"
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    size: 'small',
                    fullWidth: true
                  }
                }}
              />
            </TableCell>
            <TableCell style={columnStyle}>
              <TextField
                select
                defaultValue="male"
                fullWidth
                variant="outlined"
                size="small"
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </TableCell>
            <TableCell style={columnStyle}>
              <TextField
                select
                defaultValue="accommodation"
                fullWidth
                variant="outlined"
                size="small"
              >
                {shinkaOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Next Button */}
      <div className="flex justify-end mt-4">
        <Button
          variant="contained"
          className="w-full"
        >
          Next
        </Button>
      </div>
    </Paper>
  );
};

export default MautamerInformation;
