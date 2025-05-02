import { InputAdornment, ListItemIcon, ListItemText, MenuItem, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import './mui.css'

const MuiDropdown = ({ control, name, label, options = [], onChange, className, selectIcon, placeholder }) => {
  const { control: defaultControl } = useForm()

  return (
    <>
      <Controller
        control={control ?? defaultControl}
        name={name}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            fullWidth
            label={label}
            className={className}
            placeholder={placeholder}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            onChange={event => {
              field.onChange(event.target.value)
              onChange?.(event.target.value)
            }}
            value={field.value ?? ''}
            SelectProps={{
              displayEmpty: true,
              renderValue: selected => {
                if (selected === undefined || selected === null || selected === '') {
                  return (
                    <span className='text-gray-400'>{placeholder ? `Select ${placeholder}` : 'Select an option'}</span>
                  )
                }

                return (options ?? []).find(option => option.value === selected)?.label || ''
              }
            }}
            InputProps={{
              startAdornment: !field.value && <InputAdornment position='start'>{selectIcon}</InputAdornment>

              // endAdornment: field.value && (
              //     <InputAdornment position="end">
              //         <IconButton
              //             onClick={() => {
              //                 field.onChange(""); // Clear selection
              //                 onChange?.("");
              //             }}
              //             size="small"
              //         >
              //             <CloseIcon />
              //         </IconButton>
              //     </InputAdornment>
              // ),
            }}
          >
            {(options ?? []).map(option => (
              <MenuItem key={option.value} value={option.value} className='flex gap-3 items-start'>
                {option.icon && <ListItemIcon sx={{ minWidth: 36 }}>{option.icon}</ListItemIcon>}
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
            {/* {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                <ListItemIcon>
                                    <FlightTakeoffIcon color="success" />
                                </ListItemIcon>
                                <ListItemText primary={`${option.value} ${option.value}`} secondary={option.value} />
                            </MenuItem>
                        ))} */}
          </TextField>
        )}
      />
    </>
  )
}

export default MuiDropdown
