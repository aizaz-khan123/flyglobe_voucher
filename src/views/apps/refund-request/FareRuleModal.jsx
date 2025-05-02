'use client'
import React, { useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Paper
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { useLazyRefundRequestShowFareRuleQuery } from '@/redux-store/services/api'

const FareRuleModal = ({ isOpen, booking, handleFareRuleModal }) => {
  const [fareRuleAPiTrigger, { data: fareRuleDetail, isFetching }] = useLazyRefundRequestShowFareRuleQuery()

  useEffect(() => {
    if (isOpen && booking?.booking_id) {
      fareRuleAPiTrigger(booking.booking_id)
    }
  }, [isOpen, booking?.booking_id])

  const fareRules = Array.isArray(fareRuleDetail) ? fareRuleDetail : []

  return (
    <Dialog open={isOpen} onClose={handleFareRuleModal} fullWidth maxWidth='lg'>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6'>Fare Rules</Typography>
        <IconButton onClick={handleFareRuleModal} size='small'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Paper variant='outlined' sx={{ p: 2, mb: 2 }}>
          {isFetching ? (
            <Box display='flex' justifyContent='center' p={2}>
              <CircularProgress />
            </Box>
          ) : fareRules.length === 0 ? (
            <Typography>No fare rules available.</Typography>
          ) : (
            <div sx={{ overflowX: 'auto' }}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Origin</TableCell>
                    <TableCell>Destination</TableCell>
                    <TableCell>Passenger Type</TableCell>
                    <TableCell>Refund Penalty</TableCell>
                    <TableCell>Exchange Penalty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fareRules.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{item.originAirportCode}</TableCell>
                      <TableCell>{item.destinationAirportCode}</TableCell>
                      <TableCell>{item.passengerCode}</TableCell>
                      <TableCell>
                        {item.refundPenalties?.map((penalty, idx) => (
                          <Box key={idx}>
                            <strong>{penalty.applicability}</strong>: {penalty.penalty.currencyCode}{' '}
                            {penalty.penalty.amount}
                          </Box>
                        ))}
                      </TableCell>
                      <TableCell>
                        {item.exchangePenalties?.map((penalty, idx) => (
                          <Box key={idx}>
                            <strong>{penalty.applicability}</strong>: {penalty.penalty.currencyCode}{' '}
                            {penalty.penalty.amount}
                          </Box>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleFareRuleModal} variant='outlined' className='mt-3'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FareRuleModal
