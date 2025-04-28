import { Controller } from 'react-hook-form'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const MuiTextarea = ({
    control,
    name,
    label,
    placeholder,
    onChange,
    className,
    startIcon,
    endIcon,
    rows = 4, // default rows for textarea
    minRows,
    maxRows
}) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    multiline
                    fullWidth
                    label={label}
                    placeholder={placeholder}
                    className={className}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onChange={(event) => {
                        field.onChange(event.target.value)
                        onChange?.(event.target.value)
                    }}
                    value={field.value || ''}
                    rows={rows}
                    minRows={minRows}
                    maxRows={maxRows}
                    InputProps={{
                        startAdornment: startIcon && <InputAdornment position="start">{startIcon}</InputAdornment>,
                    }}
                />
            )}
        />
    )
}

export default MuiTextarea
