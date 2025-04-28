import { TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { Controller } from 'react-hook-form'
import './mui.css'

const MuiTimePicker = ({
    control,
    name,
    label,
    onChange,
    className,
    disabled = false,
    size = 'medium',
    width,
    defaultTime
}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                control={control}
                name={name}
                defaultValue={defaultTime || ''}
                render={({ field, fieldState }) => (
                    <TimePicker
                        {...field}
                        label={label}
                        className={`${className} mui-custom-time-picker`}
                        value={field.value ? dayjs(field.value, 'HH:mm:ss') : null}
                        onChange={(newValue) => {
                            const formattedTime = newValue ? newValue.format('HH:mm:ss') : null;

                            field.onChange(formattedTime);
                            onChange?.(formattedTime);
                        }}
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

export default MuiTimePicker
