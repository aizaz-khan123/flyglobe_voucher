import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from '@mui/material'
import React, { forwardRef, useState } from 'react'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid2'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { RangeDatePicker, SingleDatePicker } from 'react-google-flight-datepicker'
import { formatDate } from 'date-fns/format'

const FlightSearch = () => {
  const [furnishingDetails, setFurnishingDetails] = useState(['Fridge', 'AC', 'TV'])
  const furnishingArray = [
    'AC',
    'TV',
    'RO',
    'Bed',
    'WiFi',
    'Sofa',
    'Fridge',
    'Cupboard',
    'Microwave',
    'Dining Table',
    'Washing Machine'
  ]
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const handleDateChange = (dates, event) => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)
  }

  const CustomInput = forwardRef((props, ref) => {
    // Vars
    const startDate = props.start !== null ? formatDate(props.start, 'MM/dd/yyyy') : ''
    const endDate = props.end !== null ? ` - ${formatDate(props.end, 'MM/dd/yyyy')}` : null
    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <TextField fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />
  })

  return (
    <div>
      <Card>
        <CardHeader title='Search Flights' />
        <CardContent>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <FormLabel>Travel Type</FormLabel>
              <RadioGroup
                row
                name='radio-buttons-group'
                defaultValue='oneWay'
                // onChange={e => setCardData({ ...cardData, addressType: e.target.value })}
              >
                <FormControlLabel value='oneWay' control={<Radio />} label='One Way' />
                <FormControlLabel value='roundTrip' control={<Radio />} label='Round Trip' />
                <FormControlLabel value='multiCity' control={<Radio />} label='Multi City' />
              </RadioGroup>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Autocomplete
                fullWidth
                onChange={(event, value) => setFurnishingDetails(value)}
                id='flight-from'
                options={furnishingArray}
                // value={furnishingDetails}
                // defaultValue={furnishingDetails}
                // getOptionLabel={option => option || ''}
                // popupIcon={<img src="/images/flight/FlightImage.png" className="h-8" />}
                renderInput={params => <TextField {...params} label='From' />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...otherProps } = getTagProps({ index })

                    return <Chip key={key} size='small' label={option} {...otherProps} />
                  })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Autocomplete
                fullWidth
                onChange={(event, value) => setFurnishingDetails(value)}
                id='flight-to'
                options={furnishingArray}
                // value={furnishingDetails}
                // defaultValue={furnishingDetails}
                // getOptionLabel={option => option || ''}
                renderInput={params => <TextField {...params} label='To' />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...otherProps } = getTagProps({ index })

                    return <Chip key={key} size='small' label={option} {...otherProps} />
                  })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <AppReactDatepicker
                selectsRange
                endDate={endDate}
                selected={startDate}
                startDate={startDate}
                id='date-range-picker'
                onChange={handleDateChange}
                shouldCloseOnSelect={false}
                customInput={<CustomInput label='Depature Date' start={startDate} end={endDate} />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <AppReactDatepicker
                // selected={formData.date}
                showYearDropdown
                showMonthDropdown
                // onChange={date => setFormData({ ...formData, date })}
                placeholderText='MM/DD/YYYY'
                customInput={<TextField fullWidth label='Return Date' placeholder='MM-DD-YYYY' />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Travelers</InputLabel>
                <Select
                  label='From'
                  //   value={formData.country}
                  value='test'
                  //   onChange={e => setFormData({ ...formData, country: e.target.value })}
                >
                  <MenuItem value='UK'>UK</MenuItem>
                  <MenuItem value='USA'>USA</MenuItem>
                  <MenuItem value='Australia'>Australia</MenuItem>
                  <MenuItem value='Germany'>Germany</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Financial Profiles</InputLabel>
                <Select
                  label='From'
                  //   value={formData.country}
                  value='test'
                  //   onChange={e => setFormData({ ...formData, country: e.target.value })}
                >
                  <MenuItem value='UK'>UK</MenuItem>
                  <MenuItem value='USA'>USA</MenuItem>
                  <MenuItem value='Australia'>Australia</MenuItem>
                  <MenuItem value='Germany'>Germany</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
            <Autocomplete
                fullWidth
                onChange={(event, value) => setFurnishingDetails(value)}
                id='cabin-class'
                options={furnishingArray}
                // value={furnishingDetails}
                // defaultValue={furnishingDetails}
                // getOptionLabel={option => option || ''}
                renderInput={params => <TextField {...params} label='Cabin Class' />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...otherProps } = getTagProps({ index })

                    return <Chip key={key} size='small' label={option} {...otherProps} />
                  })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth>
                <Button variant='contained' type='submit' className='py-4'>
                  Get Started!
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default FlightSearch
