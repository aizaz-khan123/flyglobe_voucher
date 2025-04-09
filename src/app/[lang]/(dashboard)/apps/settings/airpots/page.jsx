import { AirportTable } from '@/views/apps/settings/airports/AirportTable'

export const metadata = {
  title: 'Airports'
}

const AirPorts = async () => {
  return (
    <div>
      Airpots
      {/* <PageTitle
                title={"Airports"}
                breadCrumbItems={[{ label: "Settings" }, { label: "Airports", active: true }]}
            /> */}
      <div className='mt-5'>
        <AirportTable />
      </div>
    </div>
  )
}

export default AirPorts
