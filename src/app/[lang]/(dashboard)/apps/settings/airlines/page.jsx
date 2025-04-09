import { AirlineTable } from '@/views/apps/settings/airlines/AirlineTable'

export const metadata = {
  title: 'Airlines'
}

const Airlines = async () => {
  return (
    <div>
      Airlines
      {/* <PageTitle
                title={"Airlines"}
                breadCrumbItems={[{ label: "Settings" }, { label: "Airlines", active: true }]}
            /> */}
      <div className='mt-5'>
        <AirlineTable />
      </div>
    </div>
  )
}

export default Airlines
