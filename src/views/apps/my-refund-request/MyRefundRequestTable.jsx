'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  Box,
  TablePagination,
} from '@mui/material';
import { useMyRefundRequestQuery } from '@/redux-store/services/api';
import tableStyles from '@core/styles/table.module.css';

const formatAmountWithCommas = (amount) =>
  typeof amount === 'number' ? amount.toLocaleString() : '0';

const MyRefundrequestRow = ({ myRefundData }) => {
  const {
    booking,
    status,
    created_at,
    refunded_amount,
    base_fare,
    tax,
    total_amount,
  } = myRefundData;

  return (
    <tr>
      <td className="p-3 border-b text-primary underline">
        {booking?.booking_id}
      </td>
      <td className="p-3 border-b">{booking?.booking_pnr}</td>
      <td className="p-3 border-b">{status}</td>
      <td className="p-3 border-b">{booking?.booked_by_user?.name}</td>
      <td className="p-3 border-b">{booking?.created_at}</td>
      <td className="p-3 border-b">{created_at}</td>
      <td className="p-3 border-b">{booking?.airline?.name}</td>
      <td className="p-3 border-b">{booking?.supplier?.name}</td>
      <td className="p-3 border-b">{formatAmountWithCommas(base_fare)}</td>
      <td className="p-3 border-b">{formatAmountWithCommas(tax)}</td>
      <td className="p-3 border-b">{formatAmountWithCommas(total_amount)}</td>
      <td className="p-3 border-b">{refunded_amount || 'N/A'}</td>
    </tr>
  );
};

const MyRefundRequestTable = () => {
  const [searchText, setSearchText] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    data: detail_data,
    isFetching,
    refetch: myRefundRequestRefetch,
  } = useMyRefundRequestQuery({
    searchText,
    pageUrl,
    page: page + 1,
    pageSize: rowsPerPage,
  });

  const myRefundDetail = detail_data?.data || [];
  const totalCount = detail_data?.total || 0;

  useEffect(() => {
    myRefundRequestRefetch();
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value);
      }, debounce);
      return () => clearTimeout(timeout);
    }, [value]);

    return (
      <TextField
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        size="small"
      />
    );
  };

  return (
    <Card sx={{ mt: 5 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <DebouncedInput
            value={searchText ?? ''}
            onChange={(value) => setSearchText(String(value))}
            placeholder="Search refund requests..."
            sx={{ width: '100%', maxWidth: 400 }}
          />
        </Box>

        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th className="text-left p-3 border-b">Booking ID</th>
                <th className="text-left p-3 border-b">PNR</th>
                <th className="text-left p-3 border-b">Request Status</th>
                <th className="text-left p-3 border-b">Booking By</th>
                <th className="text-left p-3 border-b">Booked At</th>
                <th className="text-left p-3 border-b">Requested DateTime</th>
                <th className="text-left p-3 border-b">Airline</th>
                <th className="text-left p-3 border-b">Supplier</th>
                <th className="text-left p-3 border-b">Base Fare</th>
                <th className="text-left p-3 border-b">Tax</th>
                <th className="text-left p-3 border-b">Total Amount</th>
                <th className="text-left p-3 border-b">Refunded Amount</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan={12}>
                    <Box display="flex" justifyContent="center" py={3}>
                      <CircularProgress />
                    </Box>
                  </td>
                </tr>
              ) : myRefundDetail.length > 0 ? (
                myRefundDetail.map((myRefundData, index) => (
                  <MyRefundrequestRow
                    key={index}
                    myRefundData={myRefundData}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={12}>
                    <Box display="flex" justifyContent="center" py={3}>
                      <Typography>No refund requests found</Typography>
                    </Box>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
  );
};

export { MyRefundRequestTable };
