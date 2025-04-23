//MUI Imports
import Grid from '@mui/material/Grid2'

//Component Imports
import LogisticsStatisticsCard from '@views/apps/logistics/dashboard/LogisticsStatisticsCard'

import LogisticsShipmentStatistics from '@views/apps/logistics/dashboard/LogisticsShipmentStatistics'

//Data Imports
import { getLogisticsData, getStatisticsData } from '@/app/server/actions'
import BookingTable from '@/views/apps/bookings/BookingTable'

const LogisticsDashboard = async () => {
  // Vars
  const data = await getStatisticsData()
  const vehicleData = await getLogisticsData()
  const hidePagination = true

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <LogisticsStatisticsCard data={data?.statsHorizontalWithBorder} />
      </Grid>
      {/* <Grid size={{ xs: 12, md: 6 }}>
        <LogisticsVehicleOverview />
      </Grid> */}
      <Grid size={{ xs: 12, md: 12 }}>
        <LogisticsShipmentStatistics />
      </Grid>
      {/* <Grid size={{ xs: 12, md: 4 }}>
        <LogisticsDeliveryPerformance />
      </Grid> */}
      {/* <Grid size={{ xs: 12, md: 4 }}>
        <LogisticsDeliveryExceptions />
      </Grid> */}
      {/* <Grid size={{ xs: 12, md: 4 }}>
        <LogisticsOrdersByCountries />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <BookingTable hidePagination={hidePagination} />
        {/* <LogisticsOverviewTable vehicleData={vehicleData?.vehicles} /> */}
      </Grid>
    </Grid>
  )
}

export default LogisticsDashboard
