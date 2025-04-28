import { Autocomplete, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import './mui.css'
import { IoCloseCircleOutline } from 'react-icons/io5'

const MuiFlightSearchAutoComplete = ({
  control,
  name,
  label,
  options,
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
      render={({ field, fieldState }) => (
        <Autocomplete
          options={options}
          getOptionLabel={option => (typeof option === 'string' ? option : option.label)}
          value={options.find(option => option?.value === field?.value) ?? null}
          inputValue={inputValue ?? ''}
          onChange={(_, newValue) => {
            if (typeof newValue === 'string') {
              field.onChange(newValue)
              onChange?.(newValue)
              setInputValue?.(newValue)
            } else {
              const selectedValue = newValue ? (selectLabelInsteadOfValue ? newValue.label : newValue.value) : ''

              field.onChange(selectedValue)
              onChange?.(selectedValue)
              setInputValue?.(newValue ? newValue.label : '')
            }
          }}
          onInputChange={(_, newValue, reason) => {
            setInputValue?.(newValue ?? '')
            onInputChange?.(_, newValue ?? '', reason)
          }}
          freeSolo
          renderInput={params => (
            <TextField
              {...params}
              label={label}
              inputRef={inputRef}
              className={className}
              placeholder={placeholder}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              InputProps={{
                ...params.InputProps,
                startAdornment: selectIcon && (
                  <InputAdornment position='start' className='px-2 !mr-0'>
                    {selectIcon}
                  </InputAdornment>
                ),
                endAdornment: (
                  <div className='absolute right-3'>
                    {loading ? (
                      <CircularProgress size={20} className='mr-2' />
                    ) : (
                      field.value && (
                        <IconButton
                          size='small'
                          onClick={() => {
                            field.onChange('')
                            setInputValue?.('')
                            onChange?.(null)
                          }}
                        >
                          <IoCloseCircleOutline fontSize='xl' />
                        </IconButton>
                      )
                    )}
                  </div>
                )
              }}
            />
          )}
          renderOption={(props, option, index) => (
            <li
              {...props}
              key={option?.value ?? `option-${index}`}
              className='flex gap-3 items-center py-2 px-4 cursor-pointer hover:bg-gray-200'
            >
              {typeof option !== 'string' && option.icon}
              <div>
                <div>{typeof option === 'string' ? option : option.label}</div>
                {typeof option !== 'string' && option.subLabel && (
                  <div className='text-gray-500 text-sm'>{option.subLabel}</div>
                )}
              </div>
            </li>
          )}
        />
      )}
    />
  )
}

export default MuiFlightSearchAutoComplete
