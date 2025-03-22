import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

import React from 'react'

const RecentSearch = () => {
  return (
    <div>
      <Card>
        <CardHeader title='Recent Searches' />
        <CardContent>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Card>
                <CardContent>
                  <div className='flex gap-3'>
                    <Typography variant='h6'>LHR</Typography>
                    <Typography variant='h6'>ISB</Typography>
                  </div>
                  <div className='flex gap-3'>
                    <p>01/25/2025</p>
                  </div>
                  <div className='flex gap-2'>
                    <p>One Way</p>
                    <li>4 Travellers</li>
                    <li>Economy</li>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default RecentSearch
