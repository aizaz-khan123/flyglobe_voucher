import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { Controller } from 'react-hook-form'
import './mui.css'

const MuiDatePicker = ({
  control,
  name,
  label,
  onChange,
  className,
  minDate = dayjs().subtract(50, 'year'),
  maxDate,
  disabled = false,
  size = 'medium',
  width,
  defaultDate,
  dateFormat = 'YYYY-MM-DD',
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultDate || ''}
        render={({ field, fieldState }) => (
          <DatePicker
            {...field}
            label={label}
            className={`${className} mui-custom-date-picker`}
            value={field.value ? dayjs(field.value) : null}
            onChange={newValue => {
              const formattedDate = newValue ? newValue.format(dateFormat) : null

              field.onChange(formattedDate)
              onChange?.(formattedDate)
            }}
            minDate={minDate}
            maxDate={maxDate}
            shouldDisableDate={date => minDate && date.isBefore(minDate, 'day')}
            disabled={disabled}
            slotProps={{
              textField: {
                size,
                fullWidth: !width,
                sx: width ? { width } : undefined,
                error: !!fieldState.error,
                helperText: fieldState.error?.message
              }
            }}
          />
        )}
      />
    </LocalizationProvider>
  )
}

export default MuiDatePicker
