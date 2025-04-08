import { Typography } from '@mui/material'

import { BankAccountTable } from './components/BankAccountTable'

export const metadata = {
  title: 'Bank Accounts'
}

const BankAccounts = () => {
  return (
    <div>
      <Typography variant='h4'>Bank Accounts</Typography>
      <div className='mt-5'>
        <BankAccountTable />
      </div>
    </div>
  )
}

export default BankAccounts
