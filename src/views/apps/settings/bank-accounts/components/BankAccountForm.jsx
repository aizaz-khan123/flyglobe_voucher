import { useEffect } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle , CircularProgress } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import { useCreateBankAccountMutation, useUpdateBankAccountMutation, useShowBankAccountQuery } from '@/redux-store/services/api'


const bankAccountSchema = z.object({
  account_holder_name: z.string({required_error: "Account Holder Name Required!"}).trim(),
  bank_name: z.string({ required_error: "Bank Name Required!" }).trim().min(5, { message: "Bank Name Should be greater than 5 digit!" }).max(50),
  bank_address: z.string().max(200).optional(),
  contact_number: z.string({ required_error: "Contact Number Required!" }),
  account_number: z.string({ required_error: "Account Number Required!" }),
  iban: z.string({required_error: "IBAN is required!"}),
  bank_logo: z.string().nullable().optional(),
});

const BankAccountForm = ({ 
  open, 
  onClose, 
  refetch, 
  bankAccountId,
  
}) => {
  const { control, handleSubmit, setError, setValue, reset } = useForm({
       resolver: zodResolver(bankAccountSchema)
  })

  // Fetch bank account details if in edit mode
  const { data: bankAccountDetails, isLoading: isDetailsLoading } = useShowBankAccountQuery(bankAccountId, {
    skip: !bankAccountId
  })

  const [createBankAccount, { isLoading: isCreating }] = useCreateBankAccountMutation()
  const [updateBankAccount, { isLoading: isUpdating }] = useUpdateBankAccountMutation()


  useEffect(() => {
    if (open) {
      // Always reset to default values when opening modal
      reset({
        account_holder_name: '',
        bank_name: '',
        bank_address: '',
        contact_number: '',
        account_number: '',
        iban: '',
        bank_logo: null
      })
      
      // Only populate if we're in edit mode and have data
      if (bankAccountId && bankAccountDetails) {
        reset({
          account_holder_name: bankAccountDetails.account_holder_name || '',
          bank_name: bankAccountDetails.bank_name || '',
          bank_address: bankAccountDetails.bank_address || '',
          contact_number: bankAccountDetails.contact_number || '',
          account_number: bankAccountDetails.account_number || '',
          iban: bankAccountDetails.iban || '',
          bank_logo: bankAccountDetails.bank_logo || null
        })
      }
    }
  }, [open, bankAccountId, bankAccountDetails, reset])

 
  const handleChangeImage = fileItems => {
    if (fileItems.length > 0) {
      const fileItem = fileItems[0]

      const file = new File([fileItem.file], fileItem.file.name, {
        type: fileItem.file.type,
        lastModified: fileItem.file.lastModified
      })

      setValue('bank_logo', file)
    } else {
      setValue('bank_logo', undefined)
    }
  }

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }


const onSubmit = handleSubmit(async data => {
    if (bankAccountId) {
      // Edit existing account
      const updated_data = {
        _method: 'put',
        ...data
      }
  
      await updateBankAccount({ 
        bankAccountId, 
        updated_data 
      }).then(response => {
        if ('error' in response) {
          setErrors(response?.error?.data?.errors)
          
return
        }
  
        toast.success(response?.message || 'Bank Account updated successfully')
        refetch()
        onClose()
        reset()
      })
    } else {
      // Create new account
      await createBankAccount(data).then(response => {
        if ('error' in response) {
          setErrors(response?.error?.data?.errors)
          
return
        }
  
        toast.success(response?.message || 'Bank Account created successfully')
        refetch()
        onClose()
        reset()
      })
    }
  })

  if (isDetailsLoading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <div className="flex justify-center items-center p-10">
            <CircularProgress />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="font-bold flex items-center justify-between">
        {bankAccountId ? 'Edit Bank Account' : 'Add New Bank Account'}
        <IoMdClose className="cursor-pointer" onClick={onClose} />
      </DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mt-5">
          <div>
            <div className="grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2">
              <div>
                <MuiTextField
                  control={control}
                  size="md"
                  label="Bank Name"
                  id="bank_name"
                  name="bank_name"
                  placeholder="Enter Bank Name"
                />
              </div>
              <div>
                <MuiTextField
                  control={control}
                  size="md"
                  label="Account Holder Name"
                  id="account_holder_name"
                  name="account_holder_name"
                  placeholder="Enter Account Holder Name"
                />
              </div>
              <div>
                <MuiTextField
                  control={control}
                  size="md"
                  label="Account Number"
                  id="account_number"
                  name="account_number"
                  placeholder="Enter Account Number"
                />
              </div>
              <div>
                <MuiTextField
                  control={control}
                  size="md"
                  label="IBAN"
                  id="iban"
                  name="iban"
                  placeholder="Enter IBAN"
                />
              </div>
              <div>
                <MuiTextField
                  control={control}
                  size="md"
                  label="Contact Number"
                  id="contact_number"
                  name="contact_number"
                  placeholder="Enter Contact Number"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <MuiTextField
                  control={control}
                  size="md"
                  multiline
                  rows={3}
                  label="Bank Address"
                  id="bank_address"
                  name="bank_address"
                  placeholder="Enter Bank Address"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">Bank Logo</div>
            <div className="filepond-file-upload">
              <input
                type="file"
                onupdatefiles={handleChangeImage}
                labelIdle={`<div>Drag and Drop your files or <span style="text-decoration: underline">Browse</span></div>`}
              />
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} disabled={isCreating || isUpdating}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={onSubmit} 
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? (
            <CircularProgress size={24} />
          ) : bankAccountId ? (
            'Update'
          ) : (
            'Save'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BankAccountForm
