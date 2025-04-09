import { MarginTable } from './components/MarginTable'

export const metadata = {
  title: 'Airline Margins & Commission'
}

const MarginPage = async () => {
  return (
    <div>
      {/* <PageTitle
                title={"Airline Margins & Commission"}
                breadCrumbItems={[{ label: "Settings" }, { label: "Airline Margins & Commission", active: true }]}
            /> */}
      Airline Margin
      <div className='mt-5'>
        <MarginTable />
      </div>
    </div>
  )
}

export default MarginPage
