import { Autocomplete, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import './mui.css'
import { IoCloseCircleOutline } from 'react-icons/io5'

const MuiAutocomplete = ({
    control,
    name,
    label,
    options = [],
    onChange,
    onInputChange,
    className,
    selectIcon,
    inputValue,
    setInputValue,
    onFocus,
    selectLabelInsteadOfValue = false,
    value,
    loading = false,
    placeholder,
    inputRef
}) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const selectedValue = value ?? field.value ?? null;

                return (
                    <Autocomplete
                        fullWidth
                        className={className}
                        options={options}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
                        isOptionEqualToValue={(option, val) =>
                            selectLabelInsteadOfValue
                                ? option.label === (val?.label || val)
                                : option.value === (val?.value || val)
                        }
                        value={
                            selectLabelInsteadOfValue
                                ? (options ?? []).find(opt => opt.label === selectedValue) || null
                                : (options ?? []).find(opt => opt.value === selectedValue) || null
                        }
                        onChange={(_, newValue) => {
                            const output = selectLabelInsteadOfValue ? newValue?.label ?? '' : newValue?.value ?? '';
                            field.onChange(output);
                            onChange?.(output);
                        }}
                        onInputChange={(e, newInputValue, reason) => {
                            if (setInputValue) {
                                setInputValue(newInputValue);
                            }
                            onInputChange?.(newInputValue, reason);
                        }}
                        inputValue={inputValue}
                        loading={loading}
                        onFocus={onFocus}
                        clearOnBlur={false}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputRef={inputRef}
                                label={label}
                                placeholder={placeholder}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            {!selectedValue && selectIcon && (
                                                <InputAdornment position="start">{selectIcon}</InputAdornment>
                                            )}
                                            {params.InputProps.startAdornment}
                                        </>
                                    ),
                                    endAdornment: (
                                        <>
                                            {loading ? (
                                                <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                )
            }}
        />
    )
}

export default MuiAutocomplete;
