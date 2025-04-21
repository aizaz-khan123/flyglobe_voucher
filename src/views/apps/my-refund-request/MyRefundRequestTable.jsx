'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// MUI Imports
import {
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography
} from '@mui/material'
import { useMyRefundRequestQuery } from '@/redux-store/services/api'
// import StatusRefund from '@/components/booking/StatusRefund'
// import DateTimeComp from '@/components/date/DateTimeComp'

const MyRefundrequestRow = ({ myRefundData }) => {
  const { booking, status, created_at, refunded_amount, base_fare, tax, total_amount } = myRefundData
  const formatAmountWithCommas = (amount) => {
    if (amount !== 'number') return '0';
    return amount.toLocaleString();
  };


  return (
    <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell>
      
          <Typography color="primary" sx={{ textDecoration: 'underline' }}>
            {booking?.booking_id}
          </Typography>
  
      </TableCell>
      <TableCell>{booking?.booking_pnr}</TableCell>
      {/* <TableCell><StatusRefund status={status} /></TableCell> */}
      <TableCell>{booking?.booked_by_user?.name}</TableCell>
      {/* <TableCell><DateTimeComp formattedDate={booking?.created_at} /></TableCell>
      <TableCell><DateTimeComp formattedDate={created_at} /></TableCell> */}
      <TableCell>{booking?.airline?.name}</TableCell>
      <TableCell>{booking?.supplier?.name}</TableCell>
      <TableCell>{formatAmountWithCommas(base_fare)}</TableCell>
      <TableCell>{formatAmountWithCommas(tax)}</TableCell>
      <TableCell>{formatAmountWithCommas(total_amount)}</TableCell>
      <TableCell>{refunded_amount || "N/A"}</TableCell>
    </TableRow>
  )
}

const MyRefundRequestTable = () => {
  const [searchText, setSearchText] = useState('')
  const [pageUrl, setPageUrl] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  
  const { data: detail_data, isFetching, refetch: myRefundRequestRefetch } = useMyRefundRequestQuery({ 
    searchText, 
    pageUrl,
    page: page + 1,
    pageSize: rowsPerPage
  })
  
  const myRefundDetail = detail_data?.data || []
  const totalCount = detail_data?.total || 0

  useEffect(() => {
    myRefundRequestRefetch()
  }, [])

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value])

    return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
  }

  return (
    <Card sx={{ mt: 5 }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <DebouncedInput
            value={searchText ?? ''}
            onChange={value => setSearchText(String(value))}
            placeholder='Search refund requests...'
            sx={{ width: '100%', maxWidth: 400 }}
          />
        </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{width:'5rem'}}>Booking ID</TableCell>
                <TableCell>PNR</TableCell>
                <TableCell>Request Status</TableCell>
                <TableCell>Booking By</TableCell>
                <TableCell>Booked At</TableCell>
                <TableCell>Requested DateTime</TableCell>
                <TableCell>Airline</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Base Fare</TableCell>
                <TableCell>Tax</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Refunded Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isFetching ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : myRefundDetail.length > 0 ? (
                myRefundDetail.map((myRefundData, index) => (
                  <MyRefundrequestRow key={index} myRefundData={myRefundData} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    No refund requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </CardContent>
    </Card>
  )
}

export { MyRefundRequestTable }
