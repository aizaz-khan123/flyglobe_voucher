import ImportPnrform from "@/views/apps/import-pnr/components/ImportPnrform"
import ImportPnrResult from "@/views/apps/import-pnr/components/ImportPnrResult"

const page = () => {
  return (
    <>
      {/* <PageTitle
                title={"Import PNR"}
                breadCrumbItems={[{ label: "Import PNR" }, { label: "Import PNR", active: true }]}
            /> */}
      Import PNR
      <div className='mt-5'>
        <ImportPnrform />
        <ImportPnrResult />
      </div>
    </>
  )
}

export default page
