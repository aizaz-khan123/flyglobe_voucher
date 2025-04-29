import React from 'react'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Controller } from 'react-hook-form'
import { FormLabel } from '@mui/material'

const PhoneNumberInput = ({ control, name, label = 'Phone Number', country = 'pk', rules = {} }) => {
  return (
    <div>
      <FormLabel className='text-xs'> {label}</FormLabel>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <PhoneInput
              value={field.value || ''}
              country={country}
              onChange={value => field.onChange(value)}
              onBlur={field.onBlur}
              containerClass='w-full'
              inputClass={`w-full px-3 py-2 rounded-lg transition-all h-[50px] ps-12 ${fieldState.invalid
                ? 'focus:!-outline-offset-1 focus:!outline-red-500 !border-red-400'
                : '!border !border-gray-300 focus:!outline-none focus:ring-2 focus:!ring-primary focus:!border-transparent'
                }`}
            />
            {fieldState.invalid && <span className='mt-1 text-sm text-error'>{fieldState.error?.message}</span>}
          </>
        )}
      />
    </div>
  )
}

export default PhoneNumberInput
