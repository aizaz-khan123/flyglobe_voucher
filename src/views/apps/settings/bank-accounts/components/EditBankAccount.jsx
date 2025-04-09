import { useEffect } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { useShowBankAccountQuery, useUpdateBankAccountMutation } from '@/redux-store/services/api'

const EditBankAccount = ({ open, onClose, bankAccountId }) => {
  const {
    data: bank_account,
    isSuccess: isBankAccountsSuccess,
    error,
    isLoading: isShowLoading,
    refetch
  } = useShowBankAccountQuery(bankAccountId, {
    refetchOnMountOrArgChange: true
  })

  const [updateBankAccount, { error: errorBankAccount, isLoading: isLoadingBankAccount }] =
    useUpdateBankAccountMutation()

  const { control, handleSubmit, setError, setValue, reset } = useForm({
    // resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      account_holder_name: '',
      bank_name: '',
      bank_address: '',
      contact_number: '',
      account_number: '',
      iban: '',
      bank_logo: ''
    }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (isBankAccountsSuccess && bank_account) {
      reset({
        account_holder_name: bank_account.account_holder_name || '',
        bank_name: bank_account.bank_name || '',
        bank_address: bank_account.bank_address || '',
        contact_number: bank_account.contact_number || '',
        account_number: bank_account.account_number || '',
        iban: bank_account.iban || '',
        bank_logo: bank_account.bank_logo || ''
      })
    }
  }, [bank_account, isBankAccountsSuccess, reset])

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const handleChangeImage = fileItems => {
    if (fileItems.length > 0) {
      const fileItem = fileItems[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        if (reader.result) {
          setValue('bank_logo', reader.result)
        }
      }

      if (fileItem.type.match('image.*')) {
        reader.readAsDataURL(fileItem)
      }
    } else {
      setValue('bank_logo', '')
    }
  }

  const onSubmit = handleSubmit(async data => {
    const updated_data = {
      _method: 'put',
      ...data
    }

    try {
      const response = await updateBankAccount({ bankAccountId, updated_data }).unwrap()

      if (response.code === 200) {
        // toaster.success(response.message);
        refetch()
        onClose()

        // router.push(routes.apps.settings.bank_accounts);
      } else if (response.errors) {
        setErrors(response.errors)
      }
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors)
      } else {
        // toaster.error("An error occurred while updating the bank account");
      }
    }
  })

  if (isShowLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <span className='loading loading-spinner loading-lg'></span>
        <p className='ml-2'>Loading bank account details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-red-500'>
        <p>Error fetching bank account details.</p>
      </div>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle className='font-bold flex items-center justify-between'>
        Edit Bank Account
        <IoMdClose className='cursor-pointer' onClick={onClose} />
      </DialogTitle>
      <DialogContent>
        <div className='grid grid-cols-1 gap-6 xl:grid-cols-2 mt-5'>
          <div>
            <div className='grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2'>
              <div>
                <MuiTextField
                  control={control}
                  size='md'
                  label='Bank Name'
                  id='bank_name'
                  name='bank_name'
                  placeholder='Enter Bank Name'
                />
              </div>
              <div>
                <MuiTextField
                  control={control}
                  size='md'
                  label='Account Holder Name'
                  id='account_holder_name'
                  name='account_holder_name'
                  placeholder='Enter Account Holder Name'
                />
              </div>
              <div>
                <MuiTextField
                  control={control}
                  size='md'
                  label='Account Number'
                  id='account_number'
                  name='account_number'
                  placeholder='Enter Account Number'
                />
              </div>
              <div>
                <MuiTextField control={control} size='md' label='IBAN' id='iban' name='iban' placeholder='Enter IBAN' />
              </div>
              <div>
                <MuiTextField
                  control={control}
                  size='md'
                  label='Contact Number'
                  id='contact_number'
                  name='contact_number'
                  placeholder='Enter Contact Number'
                />
              </div>
              <div className='col-span-1 md:col-span-2'>
                <MuiTextField
                  control={control}
                  size='md'
                  multiline
                  rows={3}
                  label='Bank Address'
                  id='bank_address'
                  name='bank_address'
                  placeholder='Enter Bank Address'
                />
              </div>
            </div>
          </div>
          <div>
            <div className='mb-2 text-sm font-medium'>Bank Logo</div>
            <div className='filepond-file-upload'>
              <input
                type='file'
                onChange={e => handleChangeImage(e.target.files ? Array.from(e.target.files) : [])}
                accept='image/*'
              />
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={onClose} disabled={isLoadingBankAccount}>
          Cancel
        </Button>
        <Button variant='contained' onClick={onSubmit} disabled={isLoadingBankAccount}>
          {isLoadingBankAccount ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditBankAccount
