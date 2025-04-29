import { AirlineTable } from '@/views/apps/settings/airlines/AirlineTable'

export const metadata = {
  title: 'Airlines'
}

const Airlines = async () => {
  return (
    <AirlineTable />
  )
}

export default Airlines
