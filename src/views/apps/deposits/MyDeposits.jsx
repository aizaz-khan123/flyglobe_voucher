'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { numberHelper } from '../refund-request/numberHelpers';
import { useDepositsAgencyListQuery } from '@/redux-store/services/api';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import AgencyDepositeRequestModal from './AgencyDepositeRequestModal';
import tableStyles from '@core/styles/table.module.css';

const MyDeposits = () => {
  const [searchText, setSearchText] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [depositeRequestModal, setDepositeRequestModal] = useState(false);
  const { data: detail_data, isFetching, refetch: RefundRequestRefetch } = useDepositsAgencyListQuery({ searchText, pageUrl });
  const agencyDepositeDetails = detail_data?.data || [];
  const links = detail_data?.links;

  useEffect(() => {
    RefundRequestRefetch();
  }, []);

  const columns = useMemo(() => [
    {
      header: "Bank",
      accessorKey: "bank.bank_name",
      cell: ({ row }) => row.original.bank?.bank_name ?? "N/A",
    },
    {
      header: "Deposit Amount",
      accessorKey: "deposit_amount",
      cell: ({ row }) => numberHelper.formatAmountWithCommas(row.original.deposit_amount),
    },
    {
      header: "Approved By",
      accessorKey: "approved_by",
      cell: ({ row }) => row.original.approved_by ?? "N/A",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => row.original.status,
    },
    {
      header: "Receipt",
      accessorKey: "reciept",
      cell: ({ row }) => (
        <img src={row.original.reciept} alt="receipt" height={50} width={50} />
      ),
    }
  ], []);

  const table = useReactTable({
    data: agencyDepositeDetails,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDepositeRequestModal = () => {
    setDepositeRequestModal(prev => !prev);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5 pt-5">
        <div className="inline-flex items-center" />
        <Button variant="contained" onClick={handleDepositeRequestModal}>
          Request Deposit
        </Button>
      </div>

      <Card className="mt-5 bg-base-100">
        <CardContent className="p-2">
          <div className="overflow-x-auto p-3">
          <table className={tableStyles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="text-left px-4 py-2 border-b font-medium text-base-content/80">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan={table.getAllColumns().length}>
                      <div className="flex justify-center items-center py-5">
                        <CircularProgress />
                      </div>
                    </td>
                  </tr>
                ) : agencyDepositeDetails.length > 0 ? (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-base-200/40">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-2 border-b">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={table.getAllColumns().length}>
                      <div className="text-center py-4">No data available</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end px-5 pb-5 pt-3">
            {/* <Pagination pagination={links} clickHandler={(url) => url && setPageUrl(url)} /> */}
          </div>
        </CardContent>
      </Card>

      <AgencyDepositeRequestModal
        isOpen={depositeRequestModal}
        handleDepositeRequestModal={handleDepositeRequestModal}
        RefundRequestRefetch={RefundRequestRefetch}
      />
    </>
  );
};

export default MyDeposits;
